import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const response: NextResponse = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data } = await supabase.auth.getSession();

  if (data.session?.user && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabaseCallback = createRouteHandlerClient({ cookies });
      await supabaseCallback.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname == "/auth/signout") {
    const sessionData = await supabase.auth.getSession();

    if (sessionData.data !== null)
      await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
