import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Update invite status if this is a new user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Check if this user was invited
        const { data: invite } = await supabase
          .from("invites")
          .select("*")
          .eq("email", user.email)
          .eq("status", "pending")
          .single();

        if (invite) {
          // Update invite status to accepted
          await supabase
            .from("invites")
            .update({ status: "accepted" })
            .eq("id", invite.id);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
