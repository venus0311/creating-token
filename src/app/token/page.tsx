'use client';

import { Suspense } from 'react';
import Loading from './loading';
import TokenContent from './TokenContent';

export default function TokenPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TokenContent />
    </Suspense>
  );
}
