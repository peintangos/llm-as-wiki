import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public share route added in spec-007 (`/share/plan/[token]`)
     * - image files served from public/
     */
    "/((?!_next/static|_next/image|favicon.ico|share/plan|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
