'use client';

import PageHero from '@/components/PageHero';

export default function LogoDesignPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHero
          title="Professional Brand Identity"
          subtitle="Custom logo design that makes your brand unforgettable."
        />
        <div className="mt-16 p-8 glass-card text-center">
          <p className="text-[var(--text-secondary)]">Coming soon with full details and pricing</p>
        </div>
      </div>
    </div>
  );
}
