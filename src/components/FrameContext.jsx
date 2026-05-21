'use client';

import { createContext, useContext } from 'react';

export const FrameToggleContext = createContext(() => {});

export function useFrameToggle() {
  return useContext(FrameToggleContext);
}
