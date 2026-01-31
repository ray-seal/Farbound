#!/bin/bash

# Create a simple SVG icon
cat > icon.svg << 'SVGEOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2a6ebb" rx="80"/>
  <path d="M 256 100 L 180 220 L 220 220 L 180 350 L 280 250 L 240 250 L 320 120 Z" fill="#ffffff" stroke="#b0c4de" stroke-width="8"/>
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#ffffff" text-anchor="middle">FB</text>
</svg>
SVGEOF

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    convert icon.svg -resize 192x192 icon-192.png
    convert icon.svg -resize 512x512 icon-512.png
    echo "Icons created successfully with ImageMagick"
elif command -v magick &> /dev/null; then
    magick icon.svg -resize 192x192 icon-192.png
    magick icon.svg -resize 512x512 icon-512.png
    echo "Icons created successfully with ImageMagick"
else
    echo "ImageMagick not found. Creating placeholder PNGs..."
    # Create simple placeholder using base64 encoded minimal PNG
    echo "Icons need to be created manually or with image editing software."
fi

rm icon.svg
