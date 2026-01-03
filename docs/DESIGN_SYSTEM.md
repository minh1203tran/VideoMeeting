# Meeting Assistant - Design System Documentation

## 🎨 Design Overview

This project implements a **Claymorphism + Vibrant & Block-based** design system, combining:
- Soft 3D, toy-like aesthetic with rounded edges and thick borders
- Vibrant, energetic color palette with high contrast
- Bold block layouts with geometric shapes
- Smooth animations and playful interactions

## 🎯 Design Principles

### Claymorphism Characteristics
- **Border Radius**: 16-24px for a soft, rounded appearance
- **Thick Borders**: 3-4px solid borders for definition
- **Double Shadows**: Inner + outer shadows for depth (no hard lines)
- **Pastel Colors**: Soft peach, baby blue, mint, lilac backgrounds
- **Soft Animations**: Bounce effects with cubic-bezier(0.34, 1.56, 0.64, 1)

### Vibrant & Block-based Elements
- **Bold Colors**: Electric purple, neon green, vivid pink accents
- **Large Sections**: 48px+ gaps between blocks
- **High Contrast**: Ensuring WCAG AA compliance (4.5:1 minimum)
- **Geometric Shapes**: Clean, defined rectangular sections
- **Animated Patterns**: Smooth color shifts on hover (200-300ms)

## 🎨 Color Palette

### Clay Pastel Colors
```css
--clay-peach: #FDBCB4
--clay-blue: #ADD8E6
--clay-mint: #98FF98
--clay-lilac: #E6E6FA
--clay-cream: #FFF8DC
--clay-rose: #FFE4E1
```

### Primary Colors (Trust Blue)
```css
--primary-50: #EFF6FF
--primary-100: #DBEAFE
--primary-400: #60A5FA
--primary-500: #3B82F6
--primary-600: #2563EB (Default)
--primary-700: #1D4ED8
```

### Vibrant Accent Colors
```css
--accent-green: #39FF14 (Neon Green)
--accent-purple: #BF00FF (Electric Purple)
--accent-pink: #FF1493 (Vivid Pink)
--accent-cyan: #00FFFF (Bright Cyan)
--accent-orange: #F97316 (Orange CTA)
```

### Semantic Colors
```css
--background: #F8FAFC (Light Gray Blue)
--surface: #FFFFFF (White)
--text: #1E293B (Slate 900)
--text-muted: #475569 (Slate 600)
--border: #E2E8F0 (Slate 200)
```

## 🔤 Typography

### Font Families

**Headings**: Poppins (Modern, geometric, friendly)
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
```

**Body Text**: Open Sans (Clean, readable, professional)
```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap">
```

**Playful Elements**: Fredoka (Optional for fun accents)
```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap">
```

### Font Scale
- **Heading 1**: 3.75rem (60px) - Hero titles
- **Heading 2**: 3rem (48px) - Section headers
- **Heading 3**: 1.875rem (30px) - Card titles
- **Body**: 1rem (16px) - Main content
- **Small**: 0.875rem (14px) - Captions

## 🧱 Components

### Clay Buttons
```tsx
// Primary Button
<button className="btn-clay btn-clay-primary">
  Click Me
</button>

// Secondary Button (Peach/Rose)
<button className="btn-clay btn-clay-secondary">
  Secondary
</button>

// Success Button (Mint)
<button className="btn-clay btn-clay-success">
  Success
</button>
```

### Clay Cards
```tsx
// Basic Card
<div className="card-clay bg-white border-white/80 p-6">
  Content
</div>

// Hoverable Card
<div className="card-clay card-clay-hover bg-white p-6">
  Interactive Content
</div>

// Gradient Card
<div className="card-clay bg-gradient-to-br from-primary-50 to-clay-blue/30 border-primary-200 p-6">
  Featured Content
</div>
```

### Clay Inputs
```tsx
<input 
  type="text" 
  className="input-clay" 
  placeholder="Enter text..."
/>
```

### Vibrant Blocks
```tsx
<section className="block-vibrant">
  <h2>Large Block Section</h2>
  <p>High contrast, bold borders</p>
</section>
```

## 🎭 Shadows

### Clay Shadows
```css
/* Default Clay Shadow */
box-shadow: inset -2px -2px 8px rgba(0, 0, 0, 0.1), 
            4px 4px 12px rgba(0, 0, 0, 0.15);

/* Small Clay Shadow */
box-shadow: inset -1px -1px 4px rgba(0, 0, 0, 0.1), 
            2px 2px 6px rgba(0, 0, 0, 0.1);

/* Large Clay Shadow */
box-shadow: inset -3px -3px 12px rgba(0, 0, 0, 0.12), 
            6px 6px 16px rgba(0, 0, 0, 0.2);

/* Hover Clay Shadow */
box-shadow: inset -2px -2px 8px rgba(0, 0, 0, 0.15), 
            6px 6px 16px rgba(0, 0, 0, 0.25);
```

### Vibrant Shadows
```css
/* Vibrant Blue Shadow */
box-shadow: 0 8px 32px rgba(37, 99, 235, 0.25);

/* Large Vibrant Shadow */
box-shadow: 0 12px 48px rgba(37, 99, 235, 0.35);
```

## ✨ Animations

### Available Animations
```tsx
// Soft Bounce (Clay style)
<div className="animate-soft-bounce">...</div>

// Fade In
<div className="animate-fade-in">...</div>

// Slide Up
<div className="animate-slide-up">...</div>

// Scale In
<div className="animate-scale-in">...</div>
```

### Animation Durations
- **Quick**: 150ms (micro-interactions)
- **Normal**: 200-300ms (most UI transitions)
- **Slow**: 500ms (special effects)

### Easing Functions
- **Soft Bounce**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Ease Out**: Default for entering elements
- **Ease In**: Default for exiting elements

## ♿ Accessibility

### Contrast Requirements
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text (18px+)**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 for borders/icons

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
All interactive elements have visible focus states:
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

## 📱 Responsive Breakpoints

```js
{
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

## 🎯 Usage Guidelines

### DO ✅
- Use clay shadows on all interactive elements
- Maintain 4.5:1 text contrast in light mode
- Add `cursor-pointer` to clickable elements
- Use vibrant colors for CTAs and important actions
- Keep border radius between 16-24px
- Use 200-300ms transitions for smoothness

### DON'T ❌
- Use emojis as UI icons (use SVG from Lucide React)
- Use scale transforms that shift layout on hover
- Mix different border radius values randomly
- Use linear animations (feels robotic)
- Ignore `prefers-reduced-motion`
- Use colors with insufficient contrast

## 📦 Component Library

### Common Components
- `Button` - Clay-styled buttons with variants
- `Card` - Clay cards with hover states
- `Input` - Clay-styled form inputs
- `Modal` - Overlay dialogs with clay styling

### Feature Components
- `MeetingRoomCard` - Display meeting room info
- `ParticipantList` - Show meeting participants

### Layout Components
- `Header` - Fixed floating navigation
- `MainLayout` - Main app layout wrapper
- `AuthLayout` - Authentication page layout

## 🚀 Getting Started

1. All styles are in `tailwind.config.js` and `src/index.css`
2. Use Tailwind classes with custom clay/vibrant utilities
3. Import components from `@/components/common` or `@/components/features`
4. Follow the design patterns in existing pages

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- [Google Fonts - Open Sans](https://fonts.google.com/specimen/Open+Sans)

---

**Design System Version**: 1.0.0  
**Last Updated**: December 3, 2025
