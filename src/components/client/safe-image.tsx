"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src"> & { src: string | null | undefined };

/** next/image with a neutral placeholder when the source is missing or fails to load. */
export function SafeImage({ src, alt, className, fill, ...rest }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "grid place-items-center bg-canvas text-slate-300",
          fill ? "absolute inset-0" : "h-full w-full",
        )}
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
