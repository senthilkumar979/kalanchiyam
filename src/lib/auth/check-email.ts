"use server";

import { createClient } from "@/lib/supabase/server";

export async function isEmailAllowed(email: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data: account, error } = await supabase
      .from("accounts")
      .select("is_active")
      .eq("email_id", email.toLowerCase())
      .single();

    console.log("account", account);
    console.log("error", error);

    if (error || !account) {
      return false;
    }

    return account.is_active;
  } catch (error) {
    console.error("Error checking email permission:", error);
    return false;
  }
}
