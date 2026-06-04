export interface ResourceResponse{
    status?:string;
    errors?:{
        username?:string[];
        email?:string[];
        password?:string[];
    }
    message:string;

}