import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/profile', '/contact'];
const publicRoutes = ['/login', '/register'];

export default function middleware(request: NextRequest){
    const currentUser = request.cookies.get("currentUser")?.value;
    //console.log("user:",currentUser);
    
    if(protectedRoutes.includes(request.nextUrl.pathname) && (!currentUser)){
        const response = NextResponse.redirect(new URL('/login', request.url)); 
        return response;
    }


    
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}