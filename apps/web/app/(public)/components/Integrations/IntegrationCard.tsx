import { Badge } from '@repo/ui/components/ui/badge';

export interface IntegrationItem {
  name: string;
  category: string;
  status: string;
}

export function IntegrationCard({ item }: { item: IntegrationItem }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs hover:border-gray-300 transition-all">
      <div>
        <h4 className="text-sm font-bold text-gray-950">{item.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
      </div>
      <div>
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-[10px] font-semibold text-[#16A34A] px-2 py-0.5"
        >
          {item.status}
        </Badge>
      </div>
    </div>
  );
}
