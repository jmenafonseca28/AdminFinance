import React, { useEffect, useRef } from 'react'
import ModalProps from '../models/ModalProps'

export default function Modal(props: ModalProps) {

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("MODAL REF", modalRef.current);

        const handleHideModal = () => {
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
                backdrop.remove();
            }
        };

        const loadBootstrapAndAddListener = async () => {
            if (typeof window !== "undefined" && modalRef.current) {
                if (!window.bootstrap) {
                    // @ts-expect-error eslint-disable-next-line
                    await import('bootstrap/dist/js/bootstrap.bundle.min.js');
                }

                const modalElement = modalRef.current;
                modalElement.addEventListener('hide.bs.modal', handleHideModal);

                return () => {
                    modalElement.removeEventListener('hide.bs.modal', handleHideModal);
                };
            }
        };

        loadBootstrapAndAddListener();
    }, []);



    function handleClickPrimaryButton() {
        if (props.onClickPrimaryButton) {
            props.onClickPrimaryButton();
        }
    }

    function handleClickSecondaryButton() {
        if (props.onClickSecondaryButton) {
            props.onClickSecondaryButton();
        }
    }

    return (
        <div className="modal fade" id={props.idModal} tabIndex={-1} ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{props.title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        {props.body}
                    </div>
                    <div className="modal-footer">
                        {props.textSecondaryButton &&
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClickSecondaryButton}>{props.textSecondaryButton}</button>
                        }
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleClickPrimaryButton}>{props.textPrimaryButton}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}