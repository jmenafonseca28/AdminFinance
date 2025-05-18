export default interface ModalProps {
    title: string,
    body: React.ReactNode,
    textPrimaryButton: string,
    idModal: string,
    ref: React.RefObject<HTMLDialogElement | null>,
    onClickPrimaryButton?: Function
    textSecondaryButton?: string,
    onClickSecondaryButton?: Function
}