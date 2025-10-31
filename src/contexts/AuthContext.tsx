import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('AuthContext: Checking authentication status');
      const authStatus = await authService.isAuthenticated();

      if (authStatus.authenticated && authStatus.user) {
        setUser(authStatus.user);
        console.log('AuthContext: User is authenticated');
      } else {
        setUser(null);
        console.log('AuthContext: User is not authenticated');
      }
    } catch (error) {
      console.error('AuthContext: Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('AuthContext: Signing in user');
      const result = await authService.login(email, password, rememberMe);

      if (result.success && result.user) {
        setUser(result.user);
        console.log('AuthContext: Sign in successful');
        return { success: true };
      } else {
        console.log('AuthContext: Sign in failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Signing up user');
      const result = await authService.register(name, email, password);

      if (result.success && result.user) {
        setUser(result.user);
        console.log('AuthContext: Sign up successful');
        return { success: true };
      } else {
        console.log('AuthContext: Sign up failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Sign up error:', error);
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user');
      const result = await authService.logout();

      if (result.success) {
        setUser(null);
        console.log('AuthContext: Sign out successful');
        return { success: true };
      } else {
        console.log('AuthContext: Sign out failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Sign out error:', error);
      return { success: false, error: 'Sign out failed' };
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      console.log('AuthContext: Updating profile');
      const result = await authService.updateProfile(userData);

      if (result.success && result.user) {
        setUser(result.user);
        console.log('AuthContext: Profile update successful');
        return { success: true, user: result.user };
      } else {
        console.log('AuthContext: Profile update failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};