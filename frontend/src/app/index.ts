/*
This file is here for exporting a stable API for users apps.

Usage examples:

  // API endpoints can be called via the backend client
  import { backend, types } from "app";
  const response: types.EndpointExampleResponseType = await backend.endpoint_example({...})

  // API websocket endpoints are reachable at `${WS_API_URL}/endpointname`
  import { WS_API_URL } from "app";
  const socket = new WebSocket(`${WS_API_URL}/endpointname`)

  // API HTTP endpoints are also reachable at `${API_URL}/endpointname`
  import { API_URL } from "app";
*/

import { ReactNode } from 'react';
import { useUserGuardContext } from './auth';

interface UserGuardProps {
  children: ReactNode;
}

export const UserGuard = ({ children }: UserGuardProps) => {
  const { isAuthenticated } = useUserGuardContext();
  
  if (!isAuthenticated) {
    return null; // Ou redirecionar para página de login
  }
  
  return children;
};

export {
  API_URL, 
  APP_BASE_PATH,
  APP_ID,
  Mode,
  WS_API_URL,
  mode,
} from "../constants";
export * from "./auth";
export const useStackApp = () => ({}); // Placeholder for @stackframe/react

import brain from "../brain";
export const backend = brain;

// export * as types from "../brain/data-contracts";
