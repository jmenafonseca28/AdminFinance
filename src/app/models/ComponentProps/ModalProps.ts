export default interface ModalProps {
    title: string,
    body: React.ReactNode,
    textPrimaryButton: string,
    idModal: string,
    ref: React.RefObject<HTMLDialogElement | null>,
    onClickPrimaryButton?: () => undefined,
    textSecondaryButton?: string,
    onClickSecondaryButton?: () => undefined
}