import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatFileType = (mime_type: string) => {
  if (!mime_type) {
    return null;
  }

  const mimeTypes = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/plain": "txt",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      "pptm",
    "application/zip": "zip",
    "application/rar": "rar",
    "application/7z": "7z",
    "application/tar": "tar",
    "application/gz": "gz",
    "application/bz2": "bz2",
    "application/x-7z-compressed": "7z",
    "application/x-rar-compressed": "rar",
    "application/x-bzip2": "bz2",
    "application/x-gzip": "gz",
    "application/x-tar": "tar",
    "application/x-zip": "zip",
    "application/x-rar": "rar",
    "application/x-7z": "7z",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/heif-sequence": "heif",
    "image/heic-sequence": "heic",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "text/csv": "csv",
  };
  return (
    mimeTypes[mime_type as keyof typeof mimeTypes]?.toUpperCase() ||
    mime_type?.toUpperCase()
  );
};
