# Image Optimization Guide

## Overview

This guide covers best practices for image optimization in TopSmile to improve performance and user experience.

## LazyImage Component

### Usage

```typescript
import { LazyImage } from '../components/LazyImage';

<LazyImage
    src="/path/to/image.jpg"
    alt="Description"
    className="my-image"
/>
```

### Features

- **Intersection Observer**: Loads images only when visible
- **Smooth Transitions**: Fade-in effect on load
- **Placeholder Support**: Optional placeholder while loading
- **Performance**: Reduces initial page load time

### Props

- `src` (required): Image source URL
- `alt` (required): Alternative text for accessibility
- `placeholder` (optional): Placeholder image URL
- All standard img attributes supported

## Image Formats

### Recommended Formats

1. **WebP** - Modern format, 25-35% smaller than JPEG
2. **JPEG** - Photos and complex images
3. **PNG** - Transparency, logos, icons
4. **SVG** - Vector graphics, icons

### Format Guidelines

```html
<!-- Use picture element for WebP with fallback -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description">
</picture>
```

## Responsive Images

### Using srcset

```html
<img
    src="image-800.jpg"
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px,
           (max-width: 1200px) 800px,
           1200px"
    alt="Description"
/>
```

### Breakpoints

- **Mobile**: 400px, 600px
- **Tablet**: 800px, 1024px
- **Desktop**: 1200px, 1600px

## Image Optimization Tools

### Online Tools

- **TinyPNG**: https://tinypng.com/ (PNG/JPEG compression)
- **Squoosh**: https://squoosh.app/ (WebP conversion)
- **SVGOMG**: https://jakearchibald.github.io/svgomg/ (SVG optimization)

### CLI Tools

```bash
# Install imagemagick
brew install imagemagick  # macOS
apt-get install imagemagick  # Linux

# Convert to WebP
convert image.jpg -quality 85 image.webp

# Resize image
convert image.jpg -resize 800x image-800.jpg

# Optimize JPEG
convert image.jpg -quality 85 -strip image-optimized.jpg
```

## Performance Best Practices

### 1. Lazy Loading

✅ Use LazyImage component for all images below the fold
✅ Set rootMargin to preload images slightly before visible
✅ Provide meaningful alt text for accessibility

### 2. Image Sizing

✅ Serve appropriately sized images
✅ Use srcset for responsive images
✅ Avoid serving 2000px images for 400px displays

### 3. Compression

✅ JPEG quality: 80-85 for photos
✅ PNG: Use tools like TinyPNG
✅ WebP: 25-35% smaller than JPEG

### 4. Caching

✅ Set long cache headers for images
✅ Use content hashing in filenames
✅ Consider CDN for static assets

## Image Loading Strategy

### Above the Fold

```html
<!-- Load immediately, no lazy loading -->
<img src="hero.jpg" alt="Hero" loading="eager">
```

### Below the Fold

```typescript
<!-- Use LazyImage component -->
<LazyImage src="content.jpg" alt="Content" />
```

### Background Images

```css
/* Use CSS for background images */
.hero {
    background-image: url('hero.jpg');
    background-size: cover;
}

/* Lazy load with Intersection Observer */
.lazy-bg {
    background-image: none;
}

.lazy-bg.loaded {
    background-image: url('image.jpg');
}
```

## Accessibility

### Alt Text Guidelines

✅ **Descriptive**: Describe what's in the image
✅ **Concise**: Keep under 125 characters
✅ **Contextual**: Consider surrounding content
❌ **Avoid**: "Image of", "Picture of"

### Examples

```html
<!-- Good -->
<img src="dentist.jpg" alt="Dentist examining patient's teeth">

<!-- Bad -->
<img src="dentist.jpg" alt="Image of dentist">

<!-- Decorative images -->
<img src="decoration.jpg" alt="" role="presentation">
```

## CDN Integration

### Cloudinary Example

```typescript
const cloudinaryUrl = (publicId: string, width: number) =>
    `https://res.cloudinary.com/demo/image/upload/w_${width},f_auto,q_auto/${publicId}`;

<LazyImage
    src={cloudinaryUrl('sample', 800)}
    alt="Sample"
/>
```

### Benefits

- Automatic format selection (WebP, AVIF)
- On-the-fly resizing
- Global CDN distribution
- Image optimization

## Monitoring

### Lighthouse Metrics

- **LCP (Largest Contentful Paint)**: < 2.5s
- **Image Size**: Properly sized images
- **Format**: Modern formats (WebP)

### Tools

```bash
# Run Lighthouse
npm run lighthouse

# Check image sizes
npm run analyze
```

## Migration Checklist

- [ ] Replace all `<img>` with `<LazyImage>` below fold
- [ ] Add loading="eager" to above-fold images
- [ ] Convert large images to WebP
- [ ] Generate responsive image sizes
- [ ] Add proper alt text to all images
- [ ] Test on slow 3G connection
- [ ] Verify LCP < 2.5s

## Examples

### Hero Image (Above Fold)

```typescript
<img
    src="/images/hero.jpg"
    alt="TopSmile dental clinic reception"
    loading="eager"
    width="1200"
    height="600"
/>
```

### Content Image (Below Fold)

```typescript
import { LazyImage } from '../components/LazyImage';

<LazyImage
    src="/images/service.jpg"
    alt="Dental cleaning service"
    className="service-image"
/>
```

### Responsive Image

```typescript
<LazyImage
    src="/images/team-800.jpg"
    srcSet="/images/team-400.jpg 400w,
            /images/team-800.jpg 800w,
            /images/team-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px,
           (max-width: 1200px) 800px,
           1200px"
    alt="TopSmile dental team"
/>
```

## Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebP Format](https://developers.google.com/speed/webp)
