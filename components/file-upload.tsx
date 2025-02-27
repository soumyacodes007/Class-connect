"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
  onChange,
  value,
  endpoint
}: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
          onError={() => {
            toast.error("Failed to load image");
            onChange("");
          }}
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-blue-200 stroke-blue-400" />
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <UploadDropzone
        endpoint={endpoint}
        appearance={{
          button: "bg-blue-500 p-2",
          uploadIcon: "text-blue-500",
          label: "Drop your image here or click to browse"
        }}
        content={{
          label: "Drop your image here or click to browse",
          allowedContent: "Images up to 4MB"
        }}
        onClientUploadComplete={(res) => {
          if (!res?.[0]?.url) {
            toast.error("Failed to upload file");
            return;
          }
          onChange(res[0].url);
          toast.success("File uploaded successfully!");
          if ((window as any).__uploadLoadingToast) {
            toast.dismiss((window as any).__uploadLoadingToast);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          toast.error(error.message || "Failed to upload file");
          if ((window as any).__uploadLoadingToast) {
            toast.dismiss((window as any).__uploadLoadingToast);
          }
        }}
        onUploadBegin={() => {
          const loadingToast = toast.loading("Uploading file...");
          (window as any).__uploadLoadingToast = loadingToast;
        }}
      />
      {!value && (
        <p className="text-sm text-red-500 mt-2">
          Please upload a classroom image
        </p>
      )}
    </div>
  )
}