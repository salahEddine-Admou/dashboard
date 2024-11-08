"use client";

import { ImagePlus, Trash } from "lucide-react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info) {
      // Check if `info` is an object and has the property `secure_url`
      if (typeof result.info !== "string" && result.info.secure_url) {
        onChange(result.info.secure_url);
      }
    }
  };

  const onUploadError = (error: unknown) => {
    console.error("Upload failed: ", error);
    if (error instanceof Error) {
      setErrorMessage(`Upload failed: ${error.message}`);
    } else {
      setErrorMessage("Upload failed: An unknown error occurred.");
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000); // Clear error after 5 seconds
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Uploaded image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUploadSuccess}
        onError={onUploadError}
        uploadPreset="ml_default"
      >
        {({ open }) => {
          const handleClick = () => {
            if (!disabled) {
              open();
            }
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={handleClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
