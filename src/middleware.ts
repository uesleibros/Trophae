import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response: NextResponse = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data } = await supabase.auth.getSession();


  if (data.session?.user !== undefined && request.nextUrl.pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/", request.url))
}