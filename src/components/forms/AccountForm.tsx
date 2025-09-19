import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { accountSchema, type AccountFormData } from "@/types/forms";

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

  const handleFormSubmit = async (data: AccountFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Add New Account
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex space-x-2">
          <Input
            {...register("email_id")}
            type="email"
            placeholder="Enter email address"
            error={errors.email_id?.message}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            {submitText}
          </Button>
        </div>
      </form>
    </div>
  );
};
