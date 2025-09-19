import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { inviteSchema, type InviteFormData } from "@/types/forms";

interface InviteFormProps {
  onSubmit: (data: InviteFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

export const InviteForm = ({
  onSubmit,
  isLoading = false,
  submitText = "Send Invitation",
}: InviteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const handleFormSubmit = async (data: InviteFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          {...register("email")}
          type="email"
          label="Email address"
          placeholder="Enter email address"
          error={errors.email?.message}
        />
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          {submitText}
        </Button>
      </form>
    </div>
  );
};
