# SIDMA DECOR — Developer & Client Handover

This document provides instructions for final deployment and ongoing management of the SIDMA DECOR website.

## 🚀 Final Launch Checklist

1. **WhatsApp Number**: 
   - Open `script.js`.
   - Update `SIDMA.phone` (e.g., `919876543210`) and `SIDMA.phoneDisplay`.
2. **Email**: 
   - Update `SIDMA.email` in `script.js` and the `index.html` JSON-LD schema.
3. **Location**: 
   - Update `SIDMA.location` in `script.js`.
4. **Images**: 
   - Replace placeholder images in the `assets/` folder with real product and showroom photos.
   - Recommended resolution for hero: `1920x1080`.
   - Recommended resolution for products: `800x800`.

## 🛠 Features

- **Dynamic Contact Injection**: All phone, email, and location fields across the site are controlled via the `SIDMA` object in `script.js`.
- **Smart Filtering**: Footer category links automatically scroll to the products section and trigger the correct filter.
- **SEO Optimized**: Includes JSON-LD schema with aggregate ratings and an inline SVG favicon for instant branding.
- **Performance**: Optimized scroll reveals, parallax effects, and lazy-loaded images.

## 🎨 Brand Colors

- **Gold**: `#C9A84C` (Base) | `#B3943D` (Hover)
- **Surface**: `#0c0c0f` (Main Background)
- **Overlay**: `rgba(0, 0, 0, 0.7)`

## 📦 Maintenance

To add a new product:
1. Add a new `.product-card` div in `index.html`.
2. Set the `data-category` attribute to one of: `wall`, `ceiling`, `strip`, `decorative`.
3. Add `reveal` class for animation.
