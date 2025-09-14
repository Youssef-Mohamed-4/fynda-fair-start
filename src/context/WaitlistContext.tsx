import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

interface WaitlistContextValue {
  state: WaitlistState;
  setState: (state: WaitlistState) => void;
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
  resetWaitlist: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue | undefined>(undefined);

interface WaitlistProviderProps {
  children: ReactNode;
}

export const WaitlistProvider: React.FC<WaitlistProviderProps> = ({ children }) => {
  const [state, setState] = useState<WaitlistState>('idle');
  const [showSuccess, setShowSuccess] = useState(false);

  const resetWaitlist = useCallback(() => {
    setState('idle');
    setShowSuccess(false);
  }, []);

  const value: WaitlistContextValue = {
    state,
    setState,
    showSuccess,
    setShowSuccess,
    resetWaitlist,
  };

  return (
    <WaitlistContext.Provider value={value}>
      {children}
    </WaitlistContext.Provider>
  );
};

export const useWaitlistContext = (): WaitlistContextValue => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlistContext must be used within a WaitlistProvider');
  }
  return context;
};