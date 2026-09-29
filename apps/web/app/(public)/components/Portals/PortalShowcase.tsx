'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import * as React from 'react';
import { PortalCard } from './PortalCard';
import { PORTALS } from './portals-data';

export default function PortalShowcase() {
  const [activeTab, setActiveTab] = React.useState(PORTALS[0]?.id || 'manager');

  return (
    <section id="portals" className="border-b border-gray-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            One Unified Engine. Four Tailored Portals.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            FITNEXA provides dedicated, purpose-built interfaces so owners, managers, coaches, and
            members only see what matters to them.
          </p>
        </div>

        {/* Portals Tabs Switcher */}
        <div className="mt-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center overflow-x-auto pb-2">
              <TabsList className="bg-gray-100/90 p-1 border border-gray-200/70 rounded-xl h-auto flex flex-wrap sm:flex-nowrap gap-1">
                {PORTALS.map((portal) => (
                  <TabsTrigger
                    key={portal.id}
                    value={portal.id}
                    className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-xs"
                  >
                    {portal.tabLabel}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {PORTALS.map((portal) => (
              <TabsContent key={portal.id} value={portal.id}>
                <PortalCard portal={portal} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
