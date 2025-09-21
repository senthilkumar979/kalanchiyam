import { createClient } from "@/lib/supabase/client";
import { Account } from "@/types/database";
import { EditAccountFormData } from "@/types/forms";
import { useEffect, useState } from "react";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching accounts:", error);
        throw new Error("Failed to fetch accounts");
      } else {
        setAccounts(data || []);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addAccount = async (email: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("accounts").insert({
        email_id: email.toLowerCase(),
        is_active: true,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This email address is already in the system.");
        } else {
          throw new Error(error.message);
        }
      } else {
        await fetchAccounts();
        return true;
      }
    } catch (error) {
      throw error;
    }
  };

  const toggleAccountStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("accounts")
        .update({ is_active: !currentStatus })
        .eq("email_id", id);

      if (error) {
        throw new Error(error.message);
      } else {
        await fetchAccounts();
      }
    } catch (error) {
      throw error;
    }
  };

  const updateAccount = async (data: EditAccountFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("accounts")
        .update({
          name: data.name,
          avatar_url: data.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("email_id", data.email_id);

      if (error) {
        throw new Error(error.message);
      } else {
        await fetchAccounts();
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("email_id", id);

      if (error) {
        throw new Error(error.message);
      } else {
        await fetchAccounts();
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    isLoading,
    addAccount,
    updateAccount,
    toggleAccountStatus,
    deleteAccount,
    refetch: fetchAccounts,
  };
};
