import { TrailingSlashPathLocationStrategy } from "@angular/common";
import { User } from "./AuthModel";

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

export interface ResourceErrorResponse extends ResourceResponse{
    error:ErrorObjectResponse
}
 
export interface ErrorObjectResponse{
    errors:{
        username?: string[];
        email?: string[];
    };
    message:string;
}

export interface GachaResponse {
    results: GachaItem[];
}

export interface GachaItem{
    name:string;
    description:string;
    rarity:'N'|'R'|'SR'|'SSR';
    url:string;
}

interface Link {
    url:string;
    label:string;
    page:number;
    active: boolean;
}

export interface PaginationResponse<T>{
    currentPage : number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url:string;
    links: Link[];
    next_page_url: string | null;
    path:string;
    per_page: number;
    prev_page_url: string | null;
    to:number;
    total:number;
}

export interface UserResource extends User{
    id:number;
    email_verified_at: string |null;
    created_at: string;
    updated_at: string;
}

export interface filterTerm {
  search:string|null;
  role:string|null;
}