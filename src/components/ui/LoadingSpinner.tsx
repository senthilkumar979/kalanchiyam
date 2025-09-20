interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-32 w-32",
};

export const LoadingSpinner = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  return (
    <div className={`text-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto ${spinnerSizes[size]}`}
      />
      {text && <p className="mt-4 text-secondary-600">{text}</p>}
    </div>
  );
};
