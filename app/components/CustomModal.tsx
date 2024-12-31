import React from 'react'
import ModalProps from '../models/ModalProps'

export default function Modal(props: ModalProps) {

    return (
        <div className="modal fade" id={props.idModal} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">{props.title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        {props.body}
                    </div>
                    <div className="modal-footer">
                        {props.textSecondaryButton &&
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.onClickSecondaryButton}>{props.textSecondaryButton}</button>
                        }
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.onClickPrimaryButton}>{props.textPrimaryButton}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}