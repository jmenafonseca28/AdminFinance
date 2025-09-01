import type UserLogin from "./UserLogin.model";

export default interface UserRegister extends UserLogin {
    name: string;
    lastName: string;
}