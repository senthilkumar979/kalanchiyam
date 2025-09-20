"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-80";
      case "md":
        return "w-96";
      case "lg":
        return "w-[32rem]";
      case "xl":
        return "w-[40rem]";
      default:
        return "w-96";
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden transition-all duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black transition-all duration-[2000ms] ease-in-out rounded-l",
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed bg-white shadow-2xl transform transition-all duration-[2000ms] ease-in-out",
          "right-0 top-0 rounded-l mt-2 mr-2",
          "h-[98vh]",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0",
          getSizeClasses()
        )}
        tabIndex={-1}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0 transition-all duration-[1500ms] ease-in-out",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: isOpen ? "500ms" : "0ms" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div
            className={cn(
              "flex-1 overflow-y-auto px-6 py-4 transition-all duration-[1500ms] ease-in-out",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: isOpen ? "600ms" : "0ms" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
