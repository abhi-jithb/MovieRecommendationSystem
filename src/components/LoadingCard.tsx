import React from 'react';

export default function LoadingCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="aspect-[2/3] w-full">
        <div className="h-full w-full loading-shimmer" />
      </div>
      <div className="absolute bottom-0 w-full bg-black/80 p-4">
        <div className="mb-2 h-6 w-3/4 loading-shimmer rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full loading-shimmer rounded" />
          <div className="h-4 w-5/6 loading-shimmer rounded" />
          <div className="h-4 w-4/6 loading-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}