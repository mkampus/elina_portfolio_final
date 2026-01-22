// hooks/useModalState.js
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalState = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalState must be used within ModalProvider');
    }
    return context;
};