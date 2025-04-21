'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export function dynamicImport<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  ssr = false
) {
  return dynamic(importFn, { ssr });
}

// Example usage:
// const HeavyComponent = dynamicImport(() => import('@/components/HeavyComponent'));
// const ServerComponent = dynamicImport(() => import('@/components/ServerComponent'), { ssr: true }); 