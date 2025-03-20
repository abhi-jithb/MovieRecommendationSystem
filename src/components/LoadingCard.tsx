import React from 'react';

export default function LoadingCard() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-4 shadow-md">
      <div className="aspect-[2/3] w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}