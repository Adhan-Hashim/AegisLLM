# RC2 UX & Performance Audit

This document tracks all friction points, UX inconsistencies, and performance bottlenecks discovered during the RC2 end-to-end walkthrough. These items must be resolved or explicitly deferred before tagging RC3.

## 1. Installation & First Run

### UX-001
**Location**: Installation / Docker
**Issue**: The `docker compose up` logs interleave frontend and backend output making it hard to see if the API actually started successfully.
**Severity**: Low
**Fix**: Add colored log prefixes or a custom startup message in the API `main.py` to clearly announce "AegisLLM API is ready."
**Status**: Open

## 2. Landing Page

### UX-002
**Location**: Landing Page
**Issue**: The Interactive Architecture Diagram lacks a mobile-friendly view; the side-by-side flexbox breaks on very narrow screens.
**Severity**: Medium
**Fix**: Adjust Tailwind classes (`md:flex-row` is present, but spacing on mobile causes overflow).
**Status**: Open

### UX-003
**Location**: Landing Page
**Issue**: The CTA "Simulate an Attack" jumps straight into the Attack Lab without explaining what the lab does. A brief tooltip or subtext might help.
**Severity**: Low
**Fix**: Add sub-text under the button: "No setup required. Live streaming."
**Status**: Open

## 3. Attack Lab

### UX-004
**Location**: Attack Lab
**Issue**: When the streaming SSE connection is establishing, there is a ~200ms delay where nothing happens, which feels unresponsive.
**Severity**: Medium
**Fix**: Add an immediate "Connecting to engine..." loading skeleton before the first `data: ` event arrives.
**Status**: Open

## 4. Replay Center & Session Viewer

### UX-005
**Location**: Replay Center -> Playback Controls
**Issue**: The playback speed selector is a dropdown hidden on the far right; users miss that they can speed up the replay.
**Severity**: Medium
**Fix**: Expose 1x, 2x, 4x as toggle buttons next to the play button.
**Status**: Open

### UX-006
**Location**: Replay Center -> ExplainabilityGraph
**Issue**: Zooming with the scroll wheel on the graph feels too sensitive during playback.
**Severity**: Low
**Fix**: Adjust `zoomOnScroll` sensitivity in ReactFlow props, or require `Ctrl + Scroll` to zoom.
**Status**: Open

## 5. Sessions Catalog

### UX-007
**Location**: Sessions -> Filters
**Issue**: Selecting multiple filters (e.g., Risk > 75 AND Decision = BLOCK) resets the search bar query.
**Severity**: High
**Fix**: Ensure `useState` for filters doesn't accidentally drop the search query state in the component.
**Status**: Open

### UX-008
**Location**: Sessions -> Empty State
**Issue**: When no sessions exist (or match the filter), the empty state icon is a basic text emoji `🔍`. 
**Severity**: Low
**Fix**: Replace with a proper Lucide-react illustration (e.g., `SearchX` with a muted aesthetic).
**Status**: Open

## 6. Rules Studio

### UX-009
**Location**: Rules Studio -> Monaco Editor
**Issue**: Pressing `Ctrl+S` triggers the browser's "Save Page" dialog instead of saving the rule in the Studio.
**Severity**: High (Interrupts developer workflow)
**Priority**: P0
**Fix**: Add an event listener to intercept `Cmd/Ctrl + S` and trigger the rule save function.
**Status**: Open

### UX-010
**Location**: Rules Studio -> Test Runner
**Issue**: "Run All Tests" button doesn't have a loading spinner; if the test payload is large, the UI freezes for a frame.
**Severity**: Medium
**Fix**: Offload test execution to async/await properly and show a spinner.
**Status**: Open

## 7. API Explorer

### UX-011
**Location**: API Explorer
**Issue**: The cURL copy button doesn't provide visual feedback for long enough (tooltip disappears too fast).
**Severity**: Low
**Fix**: Increase the "Copied!" timeout from 2000ms to 3000ms, and use a green checkmark icon briefly.
**Status**: Open

## Accessibility & Polish

### UX-012
**Location**: Global Navigation
**Issue**: Keyboard focus rings are missing or inconsistent across the primary navigation links.
**Severity**: High (A11y Blocker)
**Priority**: P0
**Fix**: Ensure `focus-visible:ring-2 focus-visible:ring-blue-500` is applied globally to interactive elements.
**Status**: Open

### UX-013
**Location**: Global -> Inspector
**Issue**: Color contrast on the "JSON" raw data payload inside the Inspector fails WCAG AA standards (grey text on dark background).
**Severity**: Medium
**Fix**: Lighten the JSON syntax highlighting colors.
**Status**: Open

---

## Baseline Performance Metrics (v1.0.0-rc.1)

| Metric | Measured Value | Target | Status |
|--------|----------------|--------|--------|
| Dashboard First Load (LCP) | 1.2s | < 1.5s | ✅ Pass |
| Replay FPS (1x speed) | 60 FPS | 60 FPS | ✅ Pass |
| Replay FPS (4x speed) | 45 FPS | > 30 FPS | ✅ Pass |
| Max Graph Nodes Rendered | 35 | N/A | Info |
| Monaco Editor Load Time | 450ms | < 500ms | ✅ Pass |
| Sessions Search Latency (10k items) | 12ms | < 50ms | ✅ Pass |
| Risk Engine Eval Latency | 14.2ms | < 20ms | ✅ Pass |
| Timeline Re-render Latency | 4ms | < 16ms | ✅ Pass |

*Note: All performance targets currently passing. No immediate blocking performance optimizations required for v1.0.*
