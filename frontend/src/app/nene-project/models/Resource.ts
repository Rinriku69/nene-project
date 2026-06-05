export interface ResourceResponse{
    headers:{
        normalizedNames:{};
        lazyUpdate: null | boolean
    }
    status:number;
    statusText:string;
    url:string;
    ok:boolean;
    name:string;
    message:string;
}

export interface ResouceErrorResponse extends ResourceResponse{
    error:ErrorObjectResponse
}
 
export interface ErrorObjectResponse{
    errors:{
        username?: string[];
        email?: string[];
    };
    message:string;
}
