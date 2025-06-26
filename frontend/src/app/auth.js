import React, { createContext, useContext } from 'react';

// Auth object for API calls
export const auth = {
    getAuthHeaderValue: async() => {
        // TODO: implement authentication header retrieval
        return "Bearer token";
    }
};

// User Guard Context
export const UserGuardContext = createContext({
    isAuthenticated: false,
    user: null,
    login: async() => {},
    logout: async() => {}
});

export const useUserGuardContext = () => useContext(UserGuardContext);

// Stack Client App (stub)
export const stackClientApp = "stack-client-app";

// Route Handlers (stubs to be implemented)
export const StackHandlerRoutes = (props) => props.children;

export const LoginRedirect = () => null;