import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserProfile, UserRole } from '../types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

type StoredAuth = {
  token: string;
  user: UserProfile | null;
  isAuthenticated: boolean;
};

const readStoredAuth = (): StoredAuth => {
  if (typeof window === 'undefined') {
    return { token: '', user: null, isAuthenticated: false };
  }

  const token = localStorage.getItem(TOKEN_KEY) ?? '';
  const storedUser = localStorage.getItem(USER_KEY);

  let user: UserProfile | null = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser) as Record<string, any> & { userType?: UserRole };
      user = {
        id: parsed.id,
        fullName: parsed.fullName ?? parsed.name ?? parsed.username ?? parsed.displayName,
        name: parsed.name ?? parsed.fullName ?? parsed.username,
        username: parsed.username,
        email: parsed.email,
        phone: parsed.phone ?? parsed.phoneNo,
        phoneNo: parsed.phoneNo ?? parsed.phone,
        userType: (parsed.userType as UserRole) ?? (parsed.userType ?? 'customer'),
        avatar: parsed.avatar ?? parsed.avatarUrl,
        avatarUrl: parsed.avatarUrl ?? parsed.avatar,
        token: parsed.token ?? undefined,
        extraData: parsed.extraData,
      } as UserProfile;
    } catch {
      user = null;
    }
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  };
};

const readStoredUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    const parsed = JSON.parse(storedUser) as UserProfile & { userType?: UserRole };
    return {
      id: parsed.id,
      name: (parsed as any).name,
      fullName: parsed.fullName,
      email: parsed.email,
      phone: (parsed as any).phone ?? parsed.phoneNo,
      phoneNo: (parsed as any).phoneNo ?? (parsed as any).phone,
      userType: parsed.userType ?? parsed.userType,
      avatar: parsed.avatar ?? parsed.avatarUrl,
      avatarUrl: parsed.avatarUrl ?? parsed.avatar,
      extraData: parsed.extraData || parsed.otherInfo || parsed.otherData,
    } as UserProfile;
  } catch {
    return null;
  }
};

type AuthContextValue = {
  user: UserProfile | null;
  token: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (payload: { token: string; user: UserProfile }) => void;
  logout: () => void;
  getStoredUser: () => UserProfile | null;
  updateUser: (user: UserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialAuth = readStoredAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState<UserProfile | null>(initialAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [isInitialized] = useState(true);

  useEffect(() => {
    if (user) {
      useAuthStore.getState().setUser(user);
    }
  }, [user]);

  const login = ({ token: nextToken, user: nextUser }: { token: string; user: UserProfile }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    setIsAuthenticated(true);
    useAuthStore.getState().setUser(nextUser);
  };

  const updateUser = (updatedUser: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    useAuthStore.getState().setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    useAuthStore.getState().logout();
  };

  const getStoredUser = () => readStoredUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        getStoredUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthContext is undefined');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.userType ?? 'customer')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
