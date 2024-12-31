export default interface ModalProps {
    title: string,
    body: React.ReactNode,
    textPrimaryButton: string,
    idModal: string,
    onClickPrimaryButton?: () => void,
    textSecondaryButton?: string,
    onClickSecondaryButton?: () => void,
}