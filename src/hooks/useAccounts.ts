import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Account } from "@/types/database";
import { Message } from "@/types/api";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  const fetchAccounts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching accounts:", error);
        setMessage({ type: "error", text: "Failed to fetch accounts" });
      } else {
        setAccounts(data || []);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
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
          setMessage({
            type: "error",
            text: "This email address is already in the system.",
          });
        } else {
          setMessage({
            type: "error",
            text: error.message,
          });
        }
        return false;
      } else {
        setMessage({
          type: "success",
          text: "Account added successfully!",
        });
        await fetchAccounts();
        return true;
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
      return false;
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
        setMessage({
          type: "error",
          text: error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: `Account ${
            !currentStatus ? "activated" : "deactivated"
          } successfully!`,
        });
        await fetchAccounts();
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("accounts").delete().eq("email_id", id);

      if (error) {
        setMessage({
          type: "error",
          text: error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: "Account deleted successfully!",
        });
        await fetchAccounts();
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    isLoading,
    message,
    setMessage,
    addAccount,
    toggleAccountStatus,
    deleteAccount,
    refetch: fetchAccounts,
  };
};
