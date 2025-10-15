import Script from 'next/script';

export function GoogleAdSense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7409700291514420"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
