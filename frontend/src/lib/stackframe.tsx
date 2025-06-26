import React, { createContext, useContext, ReactNode } from 'react';

export interface StackClientAppOptions {
  projectId?: string;
  publishableClientKey?: string;
  tokenStore?: string;
  redirectMethod?: unknown;
  urls?: Record<string, string>;
}

export class StackClientApp {
  projectId?: string;
  publishableClientKey?: string;
  tokenStore?: string;
  redirectMethod?: unknown;
  urls: Record<string, string> = {};

  constructor(options: StackClientAppOptions = {}) {
    Object.assign(this, options);
  }
}

const AppContext = createContext<StackClientApp | null>(null);
const UserContext = createContext<any>(null);

interface StackProviderProps {
  app: StackClientApp;
  children: ReactNode;
}

export const StackProvider = ({ app, children }: StackProviderProps) => (
  <AppContext.Provider value={app}>{children}</AppContext.Provider>
);

export const StackHandler = (_props: any) => {
  return <div style={{ display: 'none' }}>StackHandler placeholder</div>;
};

export const useStackApp = () => useContext(AppContext) as StackClientApp;

export const useUser = () => useContext(UserContext);

