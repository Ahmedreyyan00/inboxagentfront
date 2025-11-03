import { Skeleton } from "./skeleton"

// Card skeleton for dashboard stats
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

// Dashboard Stats Card Skeleton
export function DashboardStatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-4 w-32 mb-1" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

// Table skeleton for data tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

// Invoice card skeleton
export function InvoiceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

// Button skeleton
export function ButtonSkeleton({ width = "w-24" }: { width?: string }) {
  return <Skeleton className={`h-10 ${width}`} />
}

// Full page loading skeleton
export function FullPageSkeleton() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <Skeleton className="h-8 w-8 mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  )
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Transaction row skeleton
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  )
}

// Modal skeleton
export function ModalSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

// Account Settings Page Skeleton
export function AccountSettingsSkeleton() {
  return (
    <main className="flex flex-col p-10 w-full">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Personal Details Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Security Settings Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-28 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Account Preferences Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Account Control Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <div className="mb-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <Skeleton className="h-5 w-28 mb-1" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Bottom Buttons Skeleton */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex justify-end gap-4 z-20">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  );
}

// Dashboard Page Skeleton
export function DashboardPageSkeleton() {
  return (
    <main className="p-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Invoice Table Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// Subscription Page Skeleton
export function SubscriptionPageSkeleton() {
  return (
    <main className="flex-1 p-6 lg:p-10">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-3" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Alert Skeleton */}
      <div className="mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Usage Section Skeleton */}
      <div className="mb-8 bg-white rounded-xl border border-neutral-200 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
        </div>
      </div>

      {/* Current Plan Section Skeleton */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border-2 border-neutral-200 p-6">
            {/* Plan Header */}
            <div className="border-b border-neutral-100 pb-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            {/* Button */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Transaction History Skeleton */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export const AdminUserInsightsSkeleton = () => (
  <main id="main-content" className="flex-1 p-8">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-28" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-8 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="p-4 flex items-center justify-between border-t border-neutral-200">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </main>
);

export const AdminSettingsSkeleton = () => (
  <main id="main-content" className="flex-1 p-8">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Distribution */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <Skeleton className="w-3 h-3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

export const AdminSystemHealthSkeleton = () => (
  <main id="main-content" className="flex-1 p-8">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* System Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Skeleton className="w-5 h-5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors Table */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-200">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
);
