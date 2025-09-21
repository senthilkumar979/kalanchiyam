"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EditAccountFormData, editAccountSchema } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2, Upload, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditAccountFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AddAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddAccountModalProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      email_id: "",
      name: "",
      avatar_url: "",
    },
  });

  const watchedAvatarUrl = watch("avatar_url");

  // Update preview when avatar URL changes
  useEffect(() => {
    if (watchedAvatarUrl) {
      setAvatarPreview(watchedAvatarUrl);
    } else {
      setAvatarPreview(null);
    }
  }, [watchedAvatarUrl]);

  const handleFormSubmit = async (data: EditAccountFormData) => {
    try {
      const finalData = { ...data };

      // If a file is selected, upload it first
      if (selectedFile) {
        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append("avatar", selectedFile);

        // Try Vercel Blob first, fallback to local storage
        let response = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        });

        // If Vercel Blob fails, try fallback
        if (!response.ok) {
          console.log("Vercel Blob not available, using fallback storage");
          response = await fetch("/api/upload-avatar-fallback", {
            method: "POST",
            body: formData,
          });
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const uploadData = await response.json();
        finalData.avatar_url = uploadData.url;
      }

      await onSubmit(finalData);

      // Clean up blob URL after successful upload
      if (selectedFile && avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }

      // Reset form and close modal
      reset();
      setSelectedFile(null);
      setUploadError(null);
      onClose();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up blob URL if it exists
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    // Reset to empty state
    reset({
      email_id: "",
      name: "",
      avatar_url: "",
    });
    setAvatarPreview(null);
    setSelectedFile(null);
    setUploadError(null);
    onClose();
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPEG, JPG, and PNG files are allowed");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Clear any previous errors
    setUploadError(null);

    // Store the selected file
    setSelectedFile(file);

    // Create a preview URL for the selected file
    try {
      const previewUrl = URL.createObjectURL(file);
      console.log("Created preview URL:", previewUrl);
      setAvatarPreview(previewUrl);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      setUploadError("Failed to create image preview");
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemoveImage = () => {
    // Clean up blob URL if it exists
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    // Reset all states
    setSelectedFile(null);
    setAvatarPreview(null);
    setUploadError(null);

    // Reset the form field to empty
    reset({
      email_id: watch("email_id"),
      name: watch("name"),
      avatar_url: "",
    });
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Account"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Profile Picture
            </h3>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {/* Avatar Display */}
            <div className="relative group">
              {avatarPreview ? (
                <div className="relative">
                  <div className="w-[120px] h-[120px] rounded-full border-4 border-gray-200 shadow-lg overflow-hidden cursor-pointer group-hover:border-blue-300 transition-colors duration-200">
                    {/* Using img instead of Next.js Image for blob URLs to ensure proper preview */}
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image load error:", e);
                        setUploadError("Failed to load image preview");
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully");
                      }}
                      onClick={() => {
                        // Trigger file input when clicking on existing avatar
                        document.getElementById("avatar-upload")?.click();
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => {
                    // Trigger file input when clicking on empty avatar
                    document.getElementById("avatar-upload")?.click();
                  }}
                >
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload Area */}
            {!selectedFile && (
              <div className="w-full max-w-sm">
                <label
                  htmlFor="avatar-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                    isUploading
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : isDragOver
                      ? "border-blue-400 bg-blue-50 scale-105"
                      : uploadError
                      ? "border-red-300 bg-red-50 hover:bg-red-100"
                      : selectedFile
                      ? "border-green-300 bg-green-50 hover:bg-green-100"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400 animate-spin" />
                        <p className="mb-2 text-sm text-gray-500">
                          Uploading...
                        </p>
                      </>
                    ) : isDragOver ? (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-blue-500" />
                        <p className="mb-2 text-sm text-blue-600 font-semibold">
                          Drop image here
                        </p>
                        <p className="text-xs text-blue-500">
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}

            {/* Status Messages */}
            <div className="w-full max-w-sm text-center space-y-1">
              {uploadError && (
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-xs">{uploadError}</p>
                </div>
              )}
              {selectedFile && !uploadError && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs">Ready: {selectedFile.name}</p>
                </div>
              )}
              {!selectedFile && !uploadError && !avatarPreview && (
                <p className="text-xs text-gray-400">
                  Choose a profile picture to personalize the account
                </p>
              )}
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === "development" && avatarPreview && (
                <p className="text-xs text-gray-500">
                  Preview URL: {avatarPreview.substring(0, 50)}...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            {...register("email_id")}
            type="email"
            label="Email Address"
            placeholder="Enter email address"
            error={errors.email_id?.message}
          />

          <Input
            {...register("name")}
            type="text"
            label="Full Name"
            placeholder="Enter full name"
            error={errors.name?.message}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="danger"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            isLoading={isLoading || isUploading}
          >
            {isUploading ? "Uploading..." : "Add Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
