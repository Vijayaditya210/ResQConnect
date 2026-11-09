import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Disaster, ResourceCenter, ResourceItem, DemandRequest,
  Vehicle, Delivery, Shelter, AlertItem, Coordinates
} from '../types';
import {
  SEED_DISASTERS, SEED_RESOURCE_CENTERS, SEED_RESOURCES,
  SEED_DEMANDS, SEED_VEHICLES, SEED_DELIVERIES, SEED_SHELTERS, SEED_ALERTS
} from '../data/seedData';
import { db, isFirebaseConfigured } from '../config/firebase';
import { calculateDemandPriority } from '../utils/prioritization';
import { generateRouteWaypoints, calculateDistanceKm, estimateTravelTimeMins } from '../utils/geoUtils';

interface DataContextType {
  disasters: Disaster[];
  resourceCenters: ResourceCenter[];
  resources: ResourceItem[];
  demands: DemandRequest[];
  vehicles: Vehicle[];
  deliveries: Delivery[];
  shelters: Shelter[];
  alerts: AlertItem[];
  selectedDisaster: Disaster | null;
  setSelectedDisaster: (d: Disaster | null) => void;
  // Actions
  createDemand: (demandInput: Partial<DemandRequest>) => Promise<DemandRequest>;
  allocateResource: (demandId: string, resourceId: string, quantity: number, userId: string) => Promise<{ success: boolean; message: string }>;
  dispatchDelivery: (params: {
    demandId: string;
    resourceCenterId: string;
    vehicleId: string;
    quantity: number;
  }) => Promise<{ success: boolean; deliveryId?: string; message: string }>;
  updateDeliveryStatus: (deliveryId: string, status: Delivery['status']) => void;
  verifyDemand: (demandId: string, isVerified: boolean) => void;
  addAlert: (alert: Omit<AlertItem, 'id' | 'timestamp'>) => void;
  resetDemoData: () => void;
  // Demo Scenario State & Automation
  demoScenarioRunning: boolean;
  demoScenarioStep: number;
  demoScenarioLog: string[];
  startDemoScenario: () => void;
  stopDemoScenario: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LS_PREFIX = 'resqconnect_data_';

function loadOrSeed<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error loading localStorage key ${key}:`, e);
  }
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(seed));
  return seed;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disasters, setDisasters] = useState<Disaster[]>(() => loadOrSeed('disasters', SEED_DISASTERS));
  const [resourceCenters, setResourceCenters] = useState<ResourceCenter[]>(() => loadOrSeed('centers', SEED_RESOURCE_CENTERS));
  const [resources, setResources] = useState<ResourceItem[]>(() => loadOrSeed('resources', SEED_RESOURCES));
  const [demands, setDemands] = useState<DemandRequest[]>(() => loadOrSeed('demands', SEED_DEMANDS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadOrSeed('vehicles', SEED_VEHICLES));
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => loadOrSeed('deliveries', SEED_DELIVERIES));
  const [shelters, setShelters] = useState<Shelter[]>(() => loadOrSeed('shelters', SEED_SHELTERS));
  const [alerts, setAlerts] = useState<AlertItem[]>(() => loadOrSeed('alerts', SEED_ALERTS));
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(() => SEED_DISASTERS[0]);

  // Demo Automation State
  const [demoScenarioRunning, setDemoScenarioRunning] = useState(false);
  const [demoScenarioStep, setDemoScenarioStep] = useState(0);
  const [demoScenarioLog, setDemoScenarioLog] = useState<string[]>([]);
  const demoIntervalRef = useRef<any>(null);

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'disasters', JSON.stringify(disasters));
  }, [disasters]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'centers', JSON.stringify(resourceCenters));
  }, [resourceCenters]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'demands', JSON.stringify(demands));
  }, [demands]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'shelters', JSON.stringify(shelters));
  }, [shelters]);

  useEffect(() => {
    localStorage.setItem(LS_PREFIX + 'alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Alert Adder
  const addAlert = (alertData: Omit<AlertItem, 'id' | 'timestamp'>) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString()
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
  };

  // Create Emergency Demand
  const createDemand = async (demandInput: Partial<DemandRequest>): Promise<DemandRequest> => {
    const disaster = disasters.find(d => d.id === demandInput.disaster_id) || disasters[0];
    const priorityCalc = calculateDemandPriority(
      demandInput.requested_resource || 'Drinking Water',
      demandInput.quantity || 1000,
      demandInput.affected_people || 500,
      disaster.severity,
      demandInput.verification_status === 'VERIFIED'
    );

    const newDemand: DemandRequest = {
      id: `DEM-${Math.floor(1000 + Math.random() * 9000)}`,
      disaster_id: disaster.id,
      disaster_name: disaster.name,
      location_name: demandInput.location_name || 'Vijayawada Aid Post',
      coordinates: demandInput.coordinates || { lat: 16.515, lng: 80.640 },
      requested_resource: demandInput.requested_resource || 'Drinking Water',
      quantity: demandInput.quantity || 1000,
      priority: priorityCalc.priority,
      priority_score: priorityCalc.score,
      priority_reasons: priorityCalc.reasons,
      affected_people: demandInput.affected_people || 500,
      requesting_organization: demandInput.requesting_organization || 'Field Relief Volunteer Team',
      contact_phone: demandInput.contact_phone || '+91 866 250 1122',
      status: 'PENDING',
      verification_status: demandInput.verification_status || 'VERIFIED',
      created_at: new Date().toISOString(),
      urgency_notes: demandInput.urgency_notes
    };

    setDemands(prev => [newDemand, ...prev]);

    addAlert({
      type: 'CRITICAL_DEMAND',
      title: `New ${newDemand.priority} Demand: ${newDemand.location_name}`,
      message: `${newDemand.quantity.toLocaleString()} units of ${newDemand.requested_resource} requested for ${newDemand.affected_people.toLocaleString()} citizens.`,
      severity: newDemand.priority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      related_id: newDemand.id
    });

    return newDemand;
  };

  // Atomic Allocation with Duplicate and Over-Allocation Prevention
  const allocateResource = async (
    demandId: string,
    resourceId: string,
    quantity: number,
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    // 1. Locate stock
    const targetResource = resources.find(r => r.id === resourceId);
    if (!targetResource) {
      return { success: false, message: 'Resource inventory record not found.' };
    }

    const targetDemand = demands.find(d => d.id === demandId);
    if (!targetDemand) {
      return { success: false, message: 'Demand record not found.' };
    }

    // 2. Strict Inventory Validation
    if (targetResource.available_quantity < quantity) {
      return {
        success: false,
        message: `Insufficient available stock! Requested: ${quantity.toLocaleString()}, Available: ${targetResource.available_quantity.toLocaleString()}`
      };
    }

    // 3. Prevent duplicate allocation on already allocated/fulfilled demand
    if (targetDemand.status === 'ALLOCATED' || targetDemand.status === 'IN_TRANSIT' || targetDemand.status === 'FULFILLED') {
      return {
        success: false,
        message: `Demand #${demandId} is already in state '${targetDemand.status}'. Duplicate allocation prevented.`
      };
    }

    // 4. Update Resource Inventory Atomically
    const newAvailable = targetResource.available_quantity - quantity;
    const newAllocated = targetResource.allocated_quantity + quantity;
    const newStockStatus: ResourceItem['status'] = newAvailable === 0 ? 'DEPLETED' : (newAvailable < 200 ? 'LOW_STOCK' : 'AVAILABLE');

    setResources(prev =>
      prev.map(r =>
        r.id === resourceId
          ? {
              ...r,
              available_quantity: newAvailable,
              allocated_quantity: newAllocated,
              status: newStockStatus,
              last_updated: new Date().toISOString()
            }
          : r
      )
    );

    // 5. Update Demand status
    setDemands(prev =>
      prev.map(d =>
        d.id === demandId
          ? {
              ...d,
              status: 'ALLOCATED',
              allocated_resource_id: resourceId,
              allocated_center_id: targetResource.resource_center_id,
              allocated_center_name: targetResource.resource_center_name
            }
          : d
      )
    );

    addAlert({
      type: 'RESOURCE_ALLOCATED',
      title: `Allocation Approved: ${quantity.toLocaleString()} ${targetResource.resource_type}`,
      message: `Allocated from ${targetResource.resource_center_name} for Demand #${demandId} (${targetDemand.location_name}). Remaining stock: ${newAvailable.toLocaleString()}`,
      severity: 'INFO',
      related_id: demandId
    });

    return {
      success: true,
      message: `Successfully allocated ${quantity.toLocaleString()} units from ${targetResource.resource_center_name}. Inventory updated.`
    };
  };

  // Dispatch Logistics Delivery
  const dispatchDelivery = async ({
    demandId,
    resourceCenterId,
    vehicleId,
    quantity
  }: {
    demandId: string;
    resourceCenterId: string;
    vehicleId: string;
    quantity: number;
  }): Promise<{ success: boolean; deliveryId?: string; message: string }> => {
    const demand = demands.find(d => d.id === demandId);
    const center = resourceCenters.find(c => c.id === resourceCenterId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (!demand || !center || !vehicle) {
      return { success: false, message: 'Invalid dispatch parameters. Center, demand, or vehicle missing.' };
    }

    const distanceKm = calculateDistanceKm(center.coordinates, demand.coordinates);
    const travelTimeMins = estimateTravelTimeMins(distanceKm);
    const waypoints = generateRouteWaypoints(center.coordinates, demand.coordinates, 18);

    const newDeliveryId = `DEL-${Math.floor(2000 + Math.random() * 8000)}`;
    const newDelivery: Delivery = {
      id: newDeliveryId,
      demand_id: demand.id,
      disaster_id: demand.disaster_id,
      disaster_name: demand.disaster_name,
      resource_center_id: center.id,
      resource_center_name: center.name,
      destination_name: demand.location_name,
      source_coordinates: center.coordinates,
      destination_coordinates: demand.coordinates,
      vehicle_id: vehicle.id,
      vehicle_number: vehicle.vehicle_number,
      driver_name: vehicle.driver_name,
      driver_phone: vehicle.driver_phone,
      resource_type: demand.requested_resource,
      quantity,
      distance_km: distanceKm,
      estimated_travel_time_mins: travelTimeMins,
      status: 'IN_TRANSIT',
      route_waypoints: waypoints,
      current_step_index: 0,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };

    // Update Deliveries
    setDeliveries(prev => [newDelivery, ...prev]);

    // Update Vehicle
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicle.id
          ? {
              ...v,
              status: 'IN_TRANSIT',
              assigned_delivery_id: newDeliveryId,
              current_coordinates: center.coordinates
            }
          : v
      )
    );

    // Update Demand
    setDemands(prev =>
      prev.map(d =>
        d.id === demand.id
          ? {
              ...d,
              status: 'IN_TRANSIT',
              active_delivery_id: newDeliveryId
            }
          : d
      )
    );

    addAlert({
      type: 'RESOURCE_ALLOCATED',
      title: `Convoy Dispatched: ${vehicle.vehicle_number}`,
      message: `Carrying ${quantity.toLocaleString()} units of ${demand.requested_resource} to ${demand.location_name}. Est. Transit: ${travelTimeMins} mins (${distanceKm} km).`,
      severity: 'INFO',
      related_id: newDeliveryId
    });

    return {
      success: true,
      deliveryId: newDeliveryId,
      message: `Vehicle ${vehicle.vehicle_number} dispatched to ${demand.location_name}.`
    };
  };

  // Update Delivery Status (with Delivered Trigger)
  const updateDeliveryStatus = (deliveryId: string, status: Delivery['status']) => {
    setDeliveries(prev =>
      prev.map(del => {
        if (del.id === deliveryId) {
          const isNowDelivered = status === 'DELIVERED';
          if (isNowDelivered) {
            // Also resolve demand
            setDemands(dPrev =>
              dPrev.map(d =>
                d.id === del.demand_id
                  ? { ...d, status: 'FULFILLED' }
                  : d
              )
            );
            // Free up vehicle
            setVehicles(vPrev =>
              vPrev.map(v =>
                v.id === del.vehicle_id
                  ? { ...v, status: 'AVAILABLE', assigned_delivery_id: undefined, current_coordinates: del.destination_coordinates }
                  : v
              )
            );
            // Trigger confetti
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}

            addAlert({
              type: 'DEMAND_FULFILLED',
              title: `Delivery Completed: ${del.id}`,
              message: `Cargo arrived at ${del.destination_name}. Demand #${del.demand_id} has been RESOLVED.`,
              severity: 'SUCCESS',
              related_id: del.id
            });
          }
          return {
            ...del,
            status,
            delivered_at: isNowDelivered ? new Date().toISOString() : del.delivered_at,
            last_updated: new Date().toISOString()
          };
        }
        return del;
      })
    );
  };

  // Verify Demand
  const verifyDemand = (demandId: string, isVerified: boolean) => {
    setDemands(prev =>
      prev.map(d => {
        if (d.id === demandId) {
          const newStatus = isVerified ? 'VERIFIED' : 'UNVERIFIED';
          const rec = calculateDemandPriority(
            d.requested_resource,
            d.quantity,
            d.affected_people,
            'CRITICAL',
            isVerified
          );
          return {
            ...d,
            verification_status: newStatus,
            priority: rec.priority,
            priority_score: rec.score,
            priority_reasons: rec.reasons
          };
        }
        return d;
      })
    );
  };

  // Reset Demo Data
  const resetDemoData = () => {
    stopDemoScenario();
    localStorage.clear();
    setDisasters(SEED_DISASTERS);
    setResourceCenters(SEED_RESOURCE_CENTERS);
    setResources(SEED_RESOURCES);
    setDemands(SEED_DEMANDS);
    setVehicles(SEED_VEHICLES);
    setDeliveries(SEED_DELIVERIES);
    setShelters(SEED_SHELTERS);
    setAlerts(SEED_ALERTS);
    setSelectedDisaster(SEED_DISASTERS[0]);
    addAlert({
      type: 'DISASTER_ALERT',
      title: 'Demo Environment Reset',
      message: 'All disasters, warehouse inventories, and simulated fleets have been restored to initial state.',
      severity: 'INFO'
    });
  };

  // 1-Click Interactive 2-3 Minute Hackathon Demo Scenario Automation
  const stopDemoScenario = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setDemoScenarioRunning(false);
    setDemoScenarioStep(0);
  };

  const startDemoScenario = () => {
    if (demoScenarioRunning) {
      stopDemoScenario();
      return;
    }

    // Reset DEM-1001 to PENDING so the demo works even after a prior run
    setDemands(prev => prev.map(d =>
      d.id === 'DEM-1001'
        ? { ...d, status: 'PENDING', allocated_resource_id: undefined, allocated_center_id: undefined, allocated_center_name: undefined, active_delivery_id: undefined }
        : d
    ));
    // Also restore RES-01 stock so the allocation doesn't fail on re-run
    setResources(prev => prev.map(r =>
      r.id === 'RES-01'
        ? { ...r, available_quantity: 5000, allocated_quantity: 1000, status: 'AVAILABLE' }
        : r
    ));
    // Free vehicle VEH-01 if it was in transit
    setVehicles(prev => prev.map(v =>
      v.id === 'VEH-01'
        ? { ...v, status: 'AVAILABLE', assigned_delivery_id: undefined }
        : v
    ));

    setDemoScenarioRunning(true);
    setDemoScenarioStep(1);
    setDemoScenarioLog(['Starting automated 2-minute Hackathon Demo Scenario...']);

    let currentStep = 1;
    const createdDemandId = 'DEM-1001';
    let assignedDeliveryId = '';
    let simulationSubStep = 0;

    demoIntervalRef.current = setInterval(() => {
      currentStep += 1;
      setDemoScenarioStep(currentStep);

      if (currentStep === 2) {
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 2: Red Alert Active for Vijayawada Urban Inundation (18,500 people affected).'
        ]);
      } else if (currentStep === 3) {
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 3: Critical emergency demand DEM-1001 for 2,000 Drinking Water units flagged at Ajit Singh Nagar.'
        ]);
      } else if (currentStep === 4) {
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 4: AI Intelligent Matching Engine evaluated Guntur Warehouse with a 95% Match Score.'
        ]);
      } else if (currentStep === 5) {
        // Step 5: Admin Approves Allocation
        allocateResource('DEM-1001', 'RES-01', 2000, 'user_admin_01');
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 5: Resource Allocation approved. Guntur available stock atomically decreased from 5,000 -> 3,000 units.'
        ]);
      } else if (currentStep === 6) {
        // Step 6: Dispatch Vehicle
        dispatchDelivery({
          demandId: 'DEM-1001',
          resourceCenterId: 'RC-GNT-01',
          vehicleId: 'VEH-01',
          quantity: 2000
        }).then(res => {
          if (res.deliveryId) assignedDeliveryId = res.deliveryId;
        });
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 6: Vehicle AP-39-TR-104 dispatched on Google Maps Highway Route NH-16.'
        ]);
      } else if (currentStep >= 7 && currentStep <= 14) {
        // Steps 7-14: DEMO LIVE TRACKING vehicle animation along route
        simulationSubStep += 1;
        const ratio = simulationSubStep / 8;
        setDeliveries(prev =>
          prev.map(del => {
            if (del.demand_id === 'DEM-1001' || del.id === assignedDeliveryId) {
              const waypoints = del.route_waypoints;
              const idx = Math.min(waypoints.length - 1, Math.floor(ratio * (waypoints.length - 1)));
              const pos = waypoints[idx] || del.source_coordinates;

              // Also update vehicle pos
              setVehicles(vPrev =>
                vPrev.map(v =>
                  v.id === del.vehicle_id ? { ...v, current_coordinates: pos, status: 'IN_TRANSIT' } : v
                )
              );

              return { ...del, current_step_index: idx, status: 'IN_TRANSIT' };
            }
            return del;
          })
        );
        setDemoScenarioLog(prev => [
          ...prev,
          `Step ${currentStep}: DEMO LIVE TRACKING - Convoy in transit (${Math.round(ratio * 100)}% route completed).`
        ]);
      } else if (currentStep === 15) {
        // Step 15: Mark Delivered & Demand Resolved (avoid stale closure – mutate both directly)
        let targetDeliveryId = assignedDeliveryId;
        setDeliveries(prev => {
          const target = prev.find(d => d.demand_id === 'DEM-1001' || d.id === assignedDeliveryId);
          if (!target) return prev;
          targetDeliveryId = target.id;
          // Resolve related demand
          setDemands(dPrev =>
            dPrev.map(d =>
              d.id === target.demand_id ? { ...d, status: 'FULFILLED' } : d
            )
          );
          // Free vehicle
          setVehicles(vPrev =>
            vPrev.map(v =>
              v.id === target.vehicle_id
                ? { ...v, status: 'AVAILABLE', assigned_delivery_id: undefined, current_coordinates: target.destination_coordinates }
                : v
            )
          );
          // Confetti
          try {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
          } catch (e) {}

          addAlert({
            type: 'DEMAND_FULFILLED',
            title: `Delivery Completed: ${target.id}`,
            message: `Cargo arrived at ${target.destination_name}. Demand #${target.demand_id} has been RESOLVED.`,
            severity: 'SUCCESS',
            related_id: target.id
          });

          return prev.map(d =>
            (d.id === target.id)
              ? { ...d, status: 'DELIVERED', delivered_at: new Date().toISOString(), last_updated: new Date().toISOString() }
              : d
          );
        });
        setDemoScenarioLog(prev => [
          ...prev,
          'Step 15: Aid successfully DELIVERED to Ajit Singh Nagar. Demand status: RESOLVED. 🎉'
        ]);
      } else if (currentStep >= 16) {
        setDemoScenarioLog(prev => [
          ...prev,
          'Demo Scenario Complete! Full end-to-end pipeline verified.'
        ]);
        stopDemoScenario();
      }
    }, 4500); // 4.5s per step for smooth presentation
  };

  return (
    <DataContext.Provider
      value={{
        disasters,
        resourceCenters,
        resources,
        demands,
        vehicles,
        deliveries,
        shelters,
        alerts,
        selectedDisaster,
        setSelectedDisaster,
        createDemand,
        allocateResource,
        dispatchDelivery,
        updateDeliveryStatus,
        verifyDemand,
        addAlert,
        resetDemoData,
        demoScenarioRunning,
        demoScenarioStep,
        demoScenarioLog,
        startDemoScenario,
        stopDemoScenario
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
