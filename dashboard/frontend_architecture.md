# Frontend Architecture (React.js)

The PlaceIQ frontend employs React.js built with Vite to ensure blazing fast Hot Module Replacement (HMR) and minimized production bundles, ideal for intense hackathon sprints. 

## 1. Project Directory Structure

```text
/frontend
├── src/
│   ├── assets/           # Static images, styles, fonts
│   ├── components/
│   │   ├── layout/       # Sidebar, Navbar, PageWrappers
│   │   ├── dashboard/    # Widgets, Charts, To-Do lists
│   │   └── spline/       # SplineHero.jsx 
│   ├── pages/
│   │   ├── StudentHome.jsx
│   │   ├── AdminHome.jsx
│   │   └── ProfileUpload.jsx
│   ├── store/            # Zustand state management file
│   ├── services/
│   │   ├── api.js        # Axios instance configured with Auth boundaries
│   │   └── socket.js     # Socket client singleton
│   ├── utils/            # Shared formatting/helpers
│   ├── App.jsx           # Main Router Hub
│   └── main.jsx          # DOM Entry
```

## 2. State & Data Flow Mapping

- **Zustand State (`store/`)**: Provides lightweight, hook-based state management that is faster to implement than Redux but more scalable than plain React Context for real-time applications.
- **REST API Flow**: `api.js` captures user interactions (button pushes, resume uploads) and awaits JSON responses. Handled via standard async/await.
- **WebSocket Flow**: `socket.js` acts as an event listener globally mounted in `App.jsx`. It listens for specific events emitted by the backend Event & Alert Engine (e.g. `urgent_alert`) and uses Zustand actions to pop notification toasts or trigger local state re-renders across any component without prop-drilling.

## 3. Core Page Layout Strategy

### The Dashboard
A multi-grid system structured around widget components.
- **Top Row**: High-level metrics. Output driven strictly by backend's `Readiness Score Engine` and `Decision Engine`.
- **Side Panel**: Upcoming deadlines and Action Planner suggestions.
- **Main View**: Recommendations categorized by "Reach", "Match", and "Safety".

### The Admin Intelligence View
Dedicated route for counselors displaying aggregate mock data:
- Forecast logic graphs.
- At-risk student lists parsed dynamically from backend aggregations.

## 4. The Spline 3D Integration Requirement

PlaceIQ uses a cinematic 3D design to achieve an instant "Wow factor", but 3D engines are heavy computationally.

*The Hero Section is to be an empty container component that will wrap the `@splinetool/react-spline` library.*

```jsx
// src/components/spline/SplineHero.jsx
import React, { Suspense } from 'react';
// Lazy loaded to prevent main-thread blockage
const Spline = React.lazy(() => import('@splinetool/react-spline'));

export const SplineHero = () => {
  return (
    <div className="hero-container w-full h-[60vh] relative overflow-hidden bg-black">
      {/* Leave background and core empty for explicit interactive 3D scene embed */}
      <Suspense fallback={<div className="text-white text-center pt-24">Loading Immersive Experience...</div>}>
         {/*  <Spline scene="<URL_PLACEHOLDER>" />  */}
      </Suspense>
    </div>
  );
};
```
*Note: The actual background implementation details are omitted intentionally inside `SplineHero`, holding room for the final 3D scene hookup.*
