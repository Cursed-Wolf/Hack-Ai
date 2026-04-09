# Spline 3D Integration Design Guide

Adding high fidelity 3D via `@splinetool/react-spline` provides unparalleled aesthetic appeal but introduces massive performance footprints that can freeze initial React renders.

## 1. Package Usage & Setup
The standard integration requires importing the runtime environment.

```bash
npm install @splinetool/react-spline @splinetool/runtime
```

**Basic Embedding Pattern:**
```jsx
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <div className="w-full h-screen border-none m-0 p-0 overflow-hidden">
      <Spline scene="https://prod.spline.design/your_scene_id/scene.splinecode" />
    </div>
  );
}
```

## 2. Best Practices & Performance Optimization

### A. Strict Lazy Loading
**Never load Spline synchronously on the main thread during Time-to-Interactive (TTI).**
Since the 3D Engine initialization causes brief main thread blockage, the application will stutter.

*Implementation Policy*: Wrap the component mapping with `React.lazy()` and `Suspense`, rendering a CSS-based loading state (or blurred background image) until the framework fully initializes.

### B. Scene Optimizations (Inside Spline Editor)
Performance bottlenecks originate in the visual asset. Enforce the following rules before exporting `.splinecode`:
1.  **Reduce Polygons**: Always use the "Performance Panel" (in Spline export settings). Keep subdivision levels as low as possible.
2.  **Delete Unseen Geometries**: Anything behind the camera should be permanently erased from the scene, not just hidden.
3.  **Bake Shadows**: Disable dynamic point lighting on static objects and bake the lighting natively onto the material textures.
4.  **Material Simplification**: Minimize the usage of glassmorphism (transmission meshes) as they require heavy real-time ray-recalculation.

### C. Interaction Mechanisms
*   **Event Handling**: Spline events can natively communicate back to React state when clicked.
*   **Using `onLoad`**: Capture the `splineApp` instance.

```jsx
import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function InteractiveHero() {
  const splineRef = useRef(null);

  function onLoad(splineApp) {
    splineRef.current = splineApp; // Save the instance
  }

  function handleTriggerMove() {
      // Triggers Spline internal events programmatically via React
      splineRef.current.emitEvent('mouseHover', 'CubeBox');
  }

  return <Spline scene="your_url" onLoad={onLoad} />;
}
```

By keeping these structures strictly adhered to, the UI ensures fluid navigation while embedding premium cinematic visualization.
