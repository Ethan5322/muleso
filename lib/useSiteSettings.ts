'use client';

import { useEffect, useState } from 'react';
import { SiteSettings, DEFAULT_SETTINGS, mergeSettings } from '@/lib/siteSettings';

/** Fetches editable business info; returns defaults until loaded. */
export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    fetch('/api/site-settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d) setSettings(mergeSettings(d));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
