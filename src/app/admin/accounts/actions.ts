"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function inviteUser(email: string) {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Check if email is already invited
    const { data: existingInvite } = await supabase
      .from("invites")
      .select("*")
      .eq("email", email)
      .single();

    if (existingInvite) {
      return { success: false, error: "User has already been invited" };
    }

    // Create admin client for user invitation
    const adminClient = createAdminClient();

    // Invite user via Supabase Auth
    const { error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          invited_by: user.id,
        },
      });

    if (inviteError) {
      return { success: false, error: inviteError.message };
    }

    // Record the invitation in our invites table
    const { error: dbError } = await supabase.from("invites").insert({
      email,
      invited_by: user.id,
      status: "pending",
    });

    if (dbError) {
      console.error("Error recording invitation:", dbError);
      // Don't fail the entire operation if we can't record the invite
    }

    // Send custom email via Resend (optional enhancement)
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "dummy-key"
    ) {
      try {
        await resend.emails.send({
          from: "Kalanchiyam <noreply@kalanchiyam.com>",
          to: [email],
          subject: "You're invited to Kalanchiyam",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You're invited to Kalanchiyam</h2>
            <p>You've been invited to join our personal finance and document management app.</p>
            <p>Click the link below to accept your invitation and create your account:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/callback" 
                  style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a></p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        `,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the entire operation if email sending fails
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error inviting user:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
