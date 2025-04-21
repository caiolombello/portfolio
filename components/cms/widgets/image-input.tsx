"use client";

import { useState, useCallback } from "react";
import { CmsWidgetControlProps } from "decap-cms-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Image as LucideImage, Link, Upload, AlertCircle } from "lucide-react";
import { processAndUploadImage } from "@/lib/cms/media";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageInputProps extends CmsWidgetControlProps {
  forID: string;
  classNameWrapper: string;
}

export function ImageInput({
  value,
  onChange,
  forID,
  classNameWrapper,
}: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || "");

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "File type not supported. Please upload a JPEG, PNG, WebP, or GIF image.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }
    return null;
  };

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (urlInput.trim()) {
        // Basic URL validation
        try {
          new URL(urlInput.trim());
          onChange(urlInput.trim());
          setUploadError(null);
        } catch {
          setUploadError("Please enter a valid URL");
        }
      }
    },
    [urlInput, onChange],
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file before uploading
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const { regular: imageUrl } = await processAndUploadImage(file);
        onChange(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div className={classNameWrapper}>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${forID}-url`}>Image URL</Label>
              <Input
                id={`${forID}-url`}
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!urlInput.trim()}>
              Set Image URL
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${forID}-file`}>Upload Image</Label>
              <Input
                id={`${forID}-file`}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Maximum size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
              </p>
            </div>
            {isUploading && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {uploadError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {value && (
        <div className="mt-4 space-y-2">
          <Label>Preview</Label>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                e.currentTarget.className = "object-contain p-8";
              }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              onChange("");
              setUrlInput("");
              setUploadError(null);
            }}
          >
            Clear Image
          </Button>
        </div>
      )}
    </div>
  );
}
