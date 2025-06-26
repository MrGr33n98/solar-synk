import { createContext, useContext } from 'react';

// Auth object for API calls
export const auth = {
  getAuthHeaderValue: async () => {
    // TODO: implement authentication header retrieval
    return "Bearer token";
  }
};

// User Guard Context
interface UserGuardContextType {
  isAuthenticated: boolean;
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const UserGuardContext = createContext<UserGuardContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {}
});

export const useUserGuardContext = () => useContext(UserGuardContext);

// Stack Client App
export const stackClientApp = "stack-client-app";

// Route Handlers
export const StackHandlerRoutes = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export const LoginRedirect = () => {
  return null;
};
