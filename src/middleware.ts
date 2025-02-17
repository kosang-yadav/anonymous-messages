import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl;

	console.log("url : ", url)

    const token = await getToken({req : request})

	console.log("token : ", token)

	if (
		token &&
		(url.pathname.startsWith("/login") ||
			url.pathname.startsWith("/signup") ||
			url.pathname.startsWith("/verify") ||
			url.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

    if(!token && url.pathname.startsWith("/dashboard")) return NextResponse.redirect(new URL("/login", request.url));

    return NextResponse.next();
}

export const config = { matcher: ["/signup", "/login", "/dashboard"] };
