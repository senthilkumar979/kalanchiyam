"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { Alert } from "@/components/ui/Alert";
import { InviteForm } from "@/components/forms/InviteForm";
import { inviteUser } from "./actions";
import { Message } from "@/types/api";

export default function InviteUserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await inviteUser(data.email);

      if (result.success) {
        setMessage({ type: "success", text: "Invitation sent successfully!" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send invitation",
        });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Invite New User
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Send an invitation to join the personal finance app
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {message && (
          <Alert
            type={message.type}
            message={message.text}
            className="mb-6"
          />
        )}

        <InviteForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </PageContainer>
  );
}
