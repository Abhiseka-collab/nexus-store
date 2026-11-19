'use client';

import React, { useState, useEffect } from 'react';
import { sanitizeUrl } from '@/utils/security';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Product image',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  ...props
}) => {
  const getSafeSrc = (url?: string | null) => {
    return typeof url === 'string' && url.trim().length > 0
      ? sanitizeUrl(url, fallbackSrc)
      : fallbackSrc;
  };

  const [imgSrc, setImgSrc] = useState<string>(() => getSafeSrc(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(getSafeSrc(src));
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
