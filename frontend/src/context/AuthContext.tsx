import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  availableUsers: UserProfile[];
  switchUser: (userId: string) => void;
  canApproveAllocations: boolean;
  canCreateDemands: boolean;
  canManageInventory: boolean;
  canUpdateLogistics: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'resqconnect_active_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedId = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    const found = SEED_USERS.find(u => u.id === savedId);
    return found || SEED_USERS[0];
  });

  const switchUser = (userId: string) => {
    const target = SEED_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, target.id);
    }
  };

  const setRole = (role: UserRole) => {
    const userForRole = SEED_USERS.find(u => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, userForRole.id);
    }
  };

  const canApproveAllocations = currentUser.role === 'ADMIN' || currentUser.role === 'WAREHOUSE_MANAGER';
  const canCreateDemands = currentUser.role === 'ADMIN' || currentUser.role === 'NGO';
  const canManageInventory = currentUser.role === 'ADMIN' || currentUser.role === 'WAREHOUSE_MANAGER';
  const canUpdateLogistics = currentUser.role === 'ADMIN' || currentUser.role === 'VOLUNTEER_LOGISTICS';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        setRole,
        availableUsers: SEED_USERS,
        switchUser,
        canApproveAllocations,
        canCreateDemands,
        canManageInventory,
        canUpdateLogistics
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
