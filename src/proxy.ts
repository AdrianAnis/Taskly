import type { NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/auth/refresh-session";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return refreshSession(request);
}

export const config = {
  matcher: ["/((?!api/wa/webhook|api/cron|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
};
