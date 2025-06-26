import { ReactNode } from 'react';

export interface StackTheme {
  colors: {
    primary: string;
    secondary: string;
    // Adicione mais cores conforme necessário
  };
}

interface StackProviderProps {
  children: ReactNode;
  theme?: StackTheme;
}

export const StackProvider = ({ children }: StackProviderProps) => {
  return <>{children}</>;
};
