import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardAccount } from "@/types/api";

export const useAuth = () => {
  const [account, setAccount] = useState<DashboardAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      const supabase = createClient();

      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      // Fetch user account
      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("*")
        .eq("email_id", user.email)
        .single();

      if (accountError) {
        console.error("Error fetching account:", accountError);
      } else {
        setAccount(accountData);
      }

      setIsLoading(false);
    };

    fetchAccount();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return {
    account,
    isLoading,
    handleSignOut,
  };
};
