interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({
  children,
  className = "",
}: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>{children}</div>
  );
};
