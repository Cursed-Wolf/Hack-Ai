// ============================================================
// PlaceIQ — SplineHero Component
// Full-bleed immersive 3D scene for the dashboard hero section
// ============================================================

import React, { Suspense } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function SplineHero() {
  return (
    <div
      id="spline-hero"
      className="w-screen h-[60vh] relative overflow-hidden -mx-4 sm:-mx-6 -mt-20"
      style={{ marginLeft: 'calc(-50vw + 50%)', width: '100vw' }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full bg-surface-950 text-surface-200/30 animate-pulse">
            Loading 3D scene...
          </div>
        }
      >
        <Spline scene="https://prod.spline.design/Yd-niF7MCBq5cPcg/scene.splinecode" />
      </Suspense>
    </div>
  );
}
