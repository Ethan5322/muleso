'use client';

import ControlPanel from '@/app/corporate/(protected)/control/ControlPanel';

// The main admin (this /admin panel, secured by 2FA + face) manages the
// corporate sub-admins here. Sub-admins log in separately at /corporate.
export default function AdminTeamPage() {
  return (
    <div className="text-[#F0F2FA]">
      <ControlPanel />
    </div>
  );
}
