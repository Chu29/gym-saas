import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const growthData = [
  { month: 'Jan', active: 620, signups: 40 },
  { month: 'Mar', active: 750, signups: 55 },
  { month: 'May', active: 890, signups: 65 },
  { month: 'Jul', active: 1010, signups: 80 },
  { month: 'Sep', active: 1140, signups: 72 },
  { month: 'Nov', active: 1280, signups: 95 },
];

const revenueData = [
  { name: 'Membership SaaS', value: 12513, color: '#047857' },
  { name: 'PT Add-ons', value: 4414, color: '#334155' },
  { name: 'Guest & Day Passes', value: 1473, color: '#94a3b8' },
];

const attendanceData = [
  { time: '6A', count: 45 },
  { time: '8A', count: 95 },
  { time: '10A', count: 140 },
  { time: '12P', count: 180 },
  { time: '2P', count: 130 },
  { time: '4P', count: 210 },
  { time: '5P', count: 320, peak: true },
  { time: '6P', count: 348, peak: true },
  { time: '7P', count: 290, peak: true },
  { time: '9P', count: 110 },
];

export function TelemetryCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* 1. Velocity Telemetry (Membership Growth) */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Velocity Telemetry
              </span>
              <h2 className="text-sm font-bold text-gray-900">Membership Growth & Retention</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-700" /> Active
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> Signups
              </span>
            </div>
          </div>

          <div className="mt-4 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#047857"
                  strokeWidth={2.5}
                  fill="url(#growthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-600">
          <span className="font-medium text-emerald-700">● Net Retention: 97.4%</span>
          <span>6-mo cohort churn: 2.6%</span>
        </div>
      </div>

      {/* 2. Revenue Breakdown */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Revenue Breakdown
          </span>
          <h2 className="text-sm font-bold text-gray-900">Stream Distribution</h2>

          <div className="relative mt-2 flex h-40 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  innerRadius={48}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-gray-900">18.4k XFA</span>
              <span className="text-[10px] uppercase text-gray-400">Billed</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-gray-100 pt-3 text-xs">
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-700" /> Membership SaaS
            </span>
            <span className="font-semibold text-gray-900">12,513 XFA (68%)</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-700" /> PT Add-ons
            </span>
            <span className="font-semibold text-gray-900">4,414 XFA (24%)</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Guest & Day Passes
            </span>
            <span className="font-semibold text-gray-900">1,473 XFA (8%)</span>
          </div>
        </div>
      </div>

      {/* 3. Access Control Ingress */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Access Control Ingress
              </span>
              <h2 className="text-sm font-bold text-gray-900">Hourly Attendance Curve</h2>
            </div>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
              Cap: 350
            </span>
          </div>

          <div className="mt-4 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} barSize={14}>
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {attendanceData.map((entry, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static chart data that never reorders
                    <Cell key={`bar-${index}`} fill={entry.peak ? '#047857' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-600">
          <span className="font-medium text-gray-900">⚡ Peak: 5:00 PM – 7:30 PM</span>
          <span className="font-semibold text-emerald-700">88% Max</span>
        </div>
      </div>
    </div>
  );
}
