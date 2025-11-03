import { Skeleton } from "@/Components/ui/skeleton";

// Invoice Table Skeleton
export function InvoiceTableSkeleton() {
  return (
    <div className="p-4">
      {/* Table Header Skeleton */}
      <div className="border-b border-neutral-200 pb-3 mb-4">
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Table Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent Syncs Skeleton
export function RecentSyncsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

// Transaction Table Skeleton
export function TransactionTableSkeleton() {
  return (
    <div className="p-4">
      {/* Table Header Skeleton */}
      <div className="border-b border-neutral-200 pb-3 mb-4">
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Table Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Automation Settings Page Skeleton
export function AutomationSettingsSkeleton() {
  return (
    <main id="main-content" className="flex-1 w-full p-8">
      {/* Page Header Skeleton */}
      <div id="page-header" className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Scan Frequency Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-80 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forwarding Settings Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <Skeleton className="h-6 w-36 mb-4" />
        <Skeleton className="h-4 w-72 mb-6" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Notification Settings Section Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <Skeleton className="h-6 w-28 mb-4" />
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex justify-end gap-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  );
}
