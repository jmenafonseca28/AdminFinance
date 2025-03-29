import bootstrap from 'bootstrap';
import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
import Modal from '../components/CustomModal';

type ModalContextType = {
    showModal: (modalProps: ModalProps) => void;
    hideModal: () => void;
    modalProps: ModalProps | null;
};

type ModalProps = {
    title: string;
    body: ReactNode;
    textPrimaryButton: string;
    onClickPrimaryButton?: () => void;
    textSecondaryButton?: string;
    onClickSecondaryButton?: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);

    const showModal = (modalProps: ModalProps) => {
        if (modalRef.current) {
            setModalProps(modalProps);
            const modal = new bootstrap.Modal(modalRef.current);
            modal.show();
        }
    };

    const hideModal = () => {
        if (modalRef.current) {
            setModalProps(null);
            const modal = new bootstrap.Modal(modalRef.current);
            modal.hide();
        }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, modalProps }}>
            {modalProps && <Modal {...modalProps} ref={modalRef}/>}
            {children}
        </ModalContext.Provider>
    );
};
