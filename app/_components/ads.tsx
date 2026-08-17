import React, { useEffect, useSyncExternalStore } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

const Ads = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!mounted || !adsenseClient || !adsenseSlot) return;

    const id = requestAnimationFrame(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense push failed:', err);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  if (!mounted || !adsenseClient || !adsenseSlot) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: 'block',
        textAlign: 'center'
      }}
      data-ad-client={adsenseClient}
      data-ad-slot={adsenseSlot}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-full-width-responsive="true"
    />
  );
};
export default Ads;
