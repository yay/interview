import { Button } from '@mui/material';
import { createContext, useContext, useState } from 'react';

export type DesignContextType = {
  theme: string;
};

// This will be used if no context is provided (no `DesignContext.Provider`).
const defaulDesignContextValue: DesignContextType = {
  theme: 'dark',
};

const DesignContext = createContext<DesignContextType>(defaulDesignContextValue);

export const Context: React.FC = () => {
  const [theme, setTheme] = useState('vivid');
  return (
    <>
      <Button onClick={() => setTheme(theme === 'dark' ? 'vivid' : 'dark')}>Toggle Theme</Button>
      <DesignContext.Provider value={{ theme }}>
        <UserComponent />
      </DesignContext.Provider>
    </>
  );
};

// Wrapping such as this one is not necessary but is a common pattern, so it's illustrated here.
const useDesign = () => {
  // Before `useContext` existed, there was an older way to read context via `DesignContext.Consumer`.
  // All new code should use `useContext` instead.
  return useContext(DesignContext); // get the value from the nearest `DesignContext.Provider`
};

export const UserComponent: React.FC = () => {
  const design = useDesign();
  return <Button disabled>{design.theme}</Button>;
};
