'use client';

import { cn } from '@repo/ui/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Accordion as RadixAccordion } from 'radix-ui';
import * as React from 'react';

function Accordion({ ...props }: React.ComponentProps<typeof RadixAccordion.Root>) {
  return <RadixAccordion.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof RadixAccordion.Item>) {
  return (
    <RadixAccordion.Item
      data-slot="accordion-item"
      className={cn('border-b border-gray-200', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixAccordion.Trigger>) {
  return (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer text-gray-900',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-gray-500" />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixAccordion.Content>) {
  return (
    <RadixAccordion.Content
      data-slot="accordion-content"
      className={cn(
        'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down text-gray-600 pb-4',
        className,
      )}
      {...props}
    >
      {children}
    </RadixAccordion.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
