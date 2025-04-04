export interface DropDownButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    body: React.ReactNode;
    onClick?: () => void;
}