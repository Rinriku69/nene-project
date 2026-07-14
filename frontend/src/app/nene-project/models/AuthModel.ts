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

export interface JwtLoginResponse {
    access_token:string;
}

export interface User{
    username:string;
    email:string;
    currency:number;
    role:string;
    image_url:string|null;
    last_login_at:string | null;
}