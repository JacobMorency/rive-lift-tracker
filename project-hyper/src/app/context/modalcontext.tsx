"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  isExerciseSelectorOpen: boolean;
  setIsExerciseSelectorOpen: (isOpen: boolean) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isExerciseSelectorOpen,
        setIsExerciseSelectorOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
