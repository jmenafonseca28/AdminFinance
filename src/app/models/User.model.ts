import type UserLogin from "./UserLogin.model";

export default interface User extends UserLogin {
    id: string;
    name: string;
    lastName: string;
    role: string;
}