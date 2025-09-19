interface ContentContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "7xl";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
};

export const ContentContainer = ({
  children,
  maxWidth = "7xl",
  className = "",
}: ContentContainerProps) => {
  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto py-6 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="px-4 py-6 sm:px-0">{children}</div>
    </div>
  );
};
