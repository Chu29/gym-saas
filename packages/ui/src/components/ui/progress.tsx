'use client';

import { cn } from '@repo/ui/lib/utils';
import { Progress as RadixProgress } from 'radix-ui';
import * as React from 'react';

function Progress({ className, value, ...props }: React.ComponentProps<typeof RadixProgress.Root>) {
  return (
    <RadixProgress.Root
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-100', className)}
      {...props}
    >
      <RadixProgress.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-[#16a34a] transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </RadixProgress.Root>
  );
}

export { Progress };
