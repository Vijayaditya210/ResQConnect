import { DemandRequest } from '../types';

export function calculateDemandPriority(
  requestedResource: string,
  quantity: number,
  affectedPeople: number,
  disasterSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'CRITICAL',
  isVerified: boolean = true
): {
  score: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // 1. Disaster Severity (Max 25 pts)
  switch (disasterSeverity) {
    case 'CRITICAL':
      score += 25;
      reasons.push('Disaster zone severity classified as CRITICAL');
      break;
    case 'HIGH':
      score += 18;
      reasons.push('Disaster zone severity classified as HIGH');
      break;
    case 'MEDIUM':
      score += 12;
      reasons.push('Disaster zone severity classified as MEDIUM');
      break;
    default:
      score += 5;
      reasons.push('Disaster zone severity classified as LOW');
  }

  // 2. Affected Population Impact (Max 25 pts)
  if (affectedPeople >= 10000) {
    score += 25;
    reasons.push(`Massive human impact: ${affectedPeople.toLocaleString()} citizens affected`);
  } else if (affectedPeople >= 5000) {
    score += 20;
    reasons.push(`Severe human impact: ${affectedPeople.toLocaleString()} citizens affected`);
  } else if (affectedPeople >= 1000) {
    score += 15;
    reasons.push(`Substantial human impact: ${affectedPeople.toLocaleString()} citizens affected`);
  } else if (affectedPeople >= 200) {
    score += 10;
    reasons.push(`Moderate human impact: ${affectedPeople.toLocaleString()} citizens affected`);
  } else {
    score += 5;
    reasons.push(`Localized human impact: ${affectedPeople.toLocaleString()} citizens affected`);
  }

  // 3. Resource Criticality (Max 30 pts)
  const norm = requestedResource.toLowerCase();
  if (norm.includes('water') || norm.includes('medicine') || norm.includes('medical') || norm.includes('rescue')) {
    score += 30;
    reasons.push(`Life-critical emergency requirement: ${requestedResource}`);
  } else if (norm.includes('food') || norm.includes('ration')) {
    score += 22;
    reasons.push(`Essential sustenance requirement: ${requestedResource}`);
  } else if (norm.includes('blanket') || norm.includes('shelter') || norm.includes('kit')) {
    score += 15;
    reasons.push(`Vital protective relief item: ${requestedResource}`);
  } else {
    score += 10;
    reasons.push(`General relief supply: ${requestedResource}`);
  }

  // 4. Verification Factor (Max 10 pts)
  if (isVerified) {
    score += 10;
    reasons.push('On-ground situation verified by field authority');
  } else {
    score += 5;
    reasons.push('Pending secondary field verification');
  }

  // 5. Volume Factor (Max 10 pts)
  if (quantity >= 1000) {
    score += 10;
    reasons.push(`High-volume relief shipment: ${quantity.toLocaleString()} units requested`);
  } else {
    score += 6;
    reasons.push(`Standard shipment volume: ${quantity.toLocaleString()} units requested`);
  }

  const finalScore = Math.min(100, score);
  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (finalScore >= 80) priority = 'CRITICAL';
  else if (finalScore >= 60) priority = 'HIGH';
  else if (finalScore >= 40) priority = 'MEDIUM';

  return {
    score: finalScore,
    priority,
    reasons
  };
}
