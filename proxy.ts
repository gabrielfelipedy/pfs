import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/", "/entradas", "/saidas"];
const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {

    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get('session')?.value;

    const session = await decrypt(cookie);

    if(isProtectedRoute && !session?.username){
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if(isPublicRoute && session?.username){
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next();
}