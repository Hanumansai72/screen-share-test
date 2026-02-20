# Screen Share Test

A minimal React (Vite + TypeScript) application to demonstrate browser screen-share permissions, stream lifecycle management, and clean React state handling. Built as a sample frontend app to test out robust media capabilities.

## Setup Instructions

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   *Note: Because we are dealing with browser permissions, you usually need to serve this locally over `http://localhost` or via `https` in production for `navigator.mediaDevices` to be available.*

## How It Works

The core logic handles the browser's `getDisplayMedia` API. Instead of sprawling the logic everywhere, it is contained in a single custom hook (`useScreenShare`). 

- It initiates the stream with a clean API check and updates a state machine loosely modeling standard streaming phases (`idle`, `requesting`, `granted`, etc.).
- When the stream goes active, it binds the `MediaStream` to a `video` element and pulls basic metadata via `videoTrack.getSettings()`.
- Crucially, it attaches a listener to `track.onended`. This is how we detect if the user stopped the stream via the native browser UI (the floating "Stop sharing" button) or if the stream was abruptly killed.
- When an end or clear event is triggered, it runs a hard cleanup mapping over all tracks and calling `track.stop()`, explicitly setting the `MediaStream` state back to null to avoid leaks.

## Known Limitations & Quirk Handling

- **Browser Cancellations**: The `getDisplayMedia` spec does not have a clean, standard way of telling you "the user clicked cancel". Browsers just throw a generic `NotAllowedError`. Chrome will actually throw `Permission denied by system` vs `Permission denied`, but Edge and Firefox handle the string slightly differently. The catch logic uses a simple heuristic to guess whether to show a "Permission Denied" UI vs "Cancelled" UI.
- **Microphone Support**: This app is hardcoded to `audio: false` for the raw screen preview, meaning system audio or microphone isn’t merged in.
