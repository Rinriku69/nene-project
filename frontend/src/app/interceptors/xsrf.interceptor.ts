import { HttpInterceptorFn } from "@angular/common/http";


function getCookie(name:string):string| null{
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
    return match ? decodeURIComponent(match[3]) : null;
}

export const xsrfInterceptor: HttpInterceptorFn = (req,next) =>{
    const xsrfToken = getCookie("XSRF-TOKEN");

    let reqHeaders = req.headers;
    if(xsrfToken){
        reqHeaders = reqHeaders.set('X-XSRF-TOKEN',xsrfToken);
    }else{
        console.error("Token Not Found in cookie")
    }

    const cloneReq = req.clone({
        headers:reqHeaders,
        withCredentials:true
    })
    // console.log(cloneReq.headers);
    return next(cloneReq);
}