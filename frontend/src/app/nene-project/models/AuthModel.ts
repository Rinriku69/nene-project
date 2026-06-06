export interface RegisterModel {
    username:string;
    email:string;
    password:string;
    password_confirmation:string;
}

export interface LoginModel {
    username:string;
    password:string;
}

export interface User{
    username:string;
    email:string;
}