import { Preferences } from '@capacitor/preferences';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private baseURL = 'YOUR_API_BASE_URL';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private rememberMeKey = 'remember_me';

  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting login for user:', email);

      // Simulate API call - replace with actual API in production
      const mockResponse = {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          name: email.split('@')[0],
          email: email,
          avatar: undefined,
          createdAt: new Date().toISOString(),
        },
      };

      await this.storeAuthData(mockResponse, rememberMe);
      console.log('AuthService: Login successful');

      return {
        success: true,
        user: mockResponse.user,
        token: mockResponse.token,
      };

      // Uncomment for real API call:
      /*
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await this.storeAuthData(data, rememberMe);
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }
      */
    } catch (error) {
      console.error('AuthService: Login error:', error);
      return {
        success: false,
        error: 'Network error or invalid credentials',
      };
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting registration for user:', email);

      const mockResponse = {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '2',
          name: name,
          email: email,
          avatar: undefined,
          createdAt: new Date().toISOString(),
        },
      };

      await this.storeAuthData(mockResponse, false);
      console.log('AuthService: Registration successful');

      return {
        success: true,
        user: mockResponse.user,
        token: mockResponse.token,
      };
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      return {
        success: false,
        error: 'Network error or registration failed',
      };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('AuthService: Logging out user');

      await Preferences.remove({ key: this.tokenKey });
      await Preferences.remove({ key: this.userKey });
      await Preferences.remove({ key: this.rememberMeKey });

      console.log('AuthService: Logout successful');
      return { success: true };
    } catch (error) {
      console.error('AuthService: Logout error:', error);
      return {
        success: false,
        error: 'Logout failed',
      };
    }
  }

  async isAuthenticated(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      const { value: token } = await Preferences.get({ key: this.tokenKey });
      const { value: userData } = await Preferences.get({ key: this.userKey });

      if (token && userData) {
        const user = JSON.parse(userData);
        console.log('AuthService: User is authenticated:', user.email);
        return {
          authenticated: true,
          user,
        };
      }

      console.log('AuthService: User is not authenticated');
      return { authenticated: false };
    } catch (error) {
      console.error('AuthService: Authentication check error:', error);
      return { authenticated: false };
    }
  }

  async updateProfile(userData: Partial<User>): Promise<AuthResponse> {
    try {
      console.log('AuthService: Updating profile');

      const { value: currentUserData } = await Preferences.get({ key: this.userKey });
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        const updatedUser = { ...currentUser, ...userData };
        await Preferences.set({
          key: this.userKey,
          value: JSON.stringify(updatedUser),
        });

        console.log('AuthService: Profile update successful');
        return {
          success: true,
          user: updatedUser,
        };
      }

      return {
        success: false,
        error: 'User not found',
      };
    } catch (error) {
      console.error('AuthService: Profile update error:', error);
      return {
        success: false,
        error: 'Profile update failed',
      };
    }
  }

  private async storeAuthData(data: any, rememberMe: boolean) {
    try {
      const { token, user } = data;

      await Preferences.set({ key: this.tokenKey, value: token });
      await Preferences.set({ key: this.userKey, value: JSON.stringify(user) });
      await Preferences.set({ key: this.rememberMeKey, value: JSON.stringify(rememberMe) });

      console.log('AuthService: Auth data stored successfully');
    } catch (error) {
      console.error('AuthService: Error storing auth data:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();