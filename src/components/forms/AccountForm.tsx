import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/lib/theme-provider";
import { accountSchema, type AccountFormData } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

export const AccountForm = ({
  onSubmit,
  isLoading = false,
  submitText = "Add Account",
}: AccountFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

  const { colors } = useTheme();

  const handleFormSubmit = async (data: AccountFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex gap-4 justify-between items-center align-center"
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: colors.primary[600] }}
        >
          {submitText}
        </h2>
        <div className="flex gap-4 justify-end items-center align-center">
          <Input
            {...register("email_id")}
            type="email"
            placeholder="Enter email address"
            error={errors.email_id?.message}
            className="w-md"
          />

          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            <Plus size={14} /> {submitText}
          </Button>
        </div>
      </form>
    </div>
  );
};
