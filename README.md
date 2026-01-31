# Farbound - Walking Journey Tracker

A Progressive Web App (PWA) that tracks your walking journey through iconic challenges.

## Features

- **Preset Journeys**:
  - Land's End to John O'Groats (1,407 km)
  - Three Peaks Challenge (737 km)
  - Hobbiton to Mount Doom (1,779 km)
  - Custom Distance

- **Automatic Step Tracking**: Uses device motion sensors to automatically track your steps
- **Milestones**: Reach meaningful landmarks along your journey
- **PWA Support**: Install on your device for offline use
- **Progress Saving**: Your journey progress is saved locally

## Installation

### Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app will install and can be used offline

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Click "Install" in the prompt

## Motion Sensor Permissions

On iOS devices, you'll need to grant motion sensor permission:
1. Click "Request Permission" when prompted
2. Allow motion access in the popup
3. The app will begin tracking your steps automatically

If automatic tracking isn't available, you can use manual entry to add your steps.

## Development

Simple static HTML/CSS/JavaScript app with service worker for PWA functionality.

Files:
- `index.html` - Main HTML structure
- `app.js` - Application logic
- `style.css` - Styling
- `manifest.json` - PWA manifest
- `service-worker.js` - Offline caching
- `icon-192.png`, `icon-512.png` - App icons
