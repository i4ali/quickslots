'use client';

import { useEffect } from 'react';

interface DisplayAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Google AdSense Display Ad Component
 *
 * Usage:
 * <DisplayAd adSlot="1234567890" adFormat="auto" fullWidthResponsive />
 *
 * Get your ad slot ID from AdSense dashboard after approval
 */
export function DisplayAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}: DisplayAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7409700291514420"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
