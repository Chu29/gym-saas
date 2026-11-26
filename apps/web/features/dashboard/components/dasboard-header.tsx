import { Button } from '@repo/ui/components/ui/button';
import { QrCode, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { RegisterMemberDialog } from '../../../../web/features/member-registration/components/register-member-dialog';

interface DashboardHeaderProps {
  onQuickCheckIn?: () => void;
}
export function DashboardHeader({ onQuickCheckIn }: DashboardHeaderProps) {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between margin-top-4">
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Facility Operations & Executive Dashboard
        </h1>
        <p className="text-xs text-gray-500 sm:text-sm">
          Daily branch performance, member check-in ingress, automated recurring billing, and
          trainer utilization.
        </p>
      </div>

      {/* Top Action Buttons */}
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick QR Check-in */}
          <Button
            type="button"
            onClick={onQuickCheckIn}
            className="h-9 gap-2 rounded-lg bg-emerald-800 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900 focus-visible:ring-emerald-700"
          >
            <QrCode className="h-4 w-4" />
            Quick QR Check-in
          </Button>

          {/* Register New Member */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setRegisterOpen(true)}
            className="h-9 gap-2 rounded-lg border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900"
          >
            <UserPlus className="h-4 w-4 text-gray-500" />
            Register New Member
          </Button>
          <RegisterMemberDialog open={registerOpen} onOpenChange={setRegisterOpen} />
        </div>
      </div>
    </div>
  );
}
