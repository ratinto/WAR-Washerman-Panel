# Font Management System

This project uses a centralized font management system to ensure consistency and easy maintenance across all components.

## How to Change Fonts

### Method 1: Update Theme Configuration (Recommended)

Edit `/src/config/theme.ts`:

```typescript
export const theme = {
  fonts: {
    // Change these values to update fonts globally
    primary: 'Your-Primary-Font, system-ui, sans-serif',
    heading: 'Your-Heading-Font, system-ui, sans-serif', 
    brand: 'Your-Brand-Font, system-ui, sans-serif',
  }
};
```

### Method 2: Update CSS Variables

Edit `/src/index.css`:

```css
:root {
  --font-family-primary: 'Your-Primary-Font', system-ui, sans-serif;
  --font-family-heading: 'Your-Heading-Font', system-ui, sans-serif;
  --font-family-brand: 'Your-Brand-Font', system-ui, sans-serif;
}
```

## CSS Classes Available

| Class | Usage | Applied To |
|-------|-------|------------|
| `.page-title` | Main page headings | Dashboard titles, page headers |
| `.card-title` | Card component titles | Recent Work, Statistics cards |
| `.modal-title` | Dialog/modal titles | Order details modal |
| `.brand-logo` | Brand/logo text | WAR logo, brand elements |
| `.font-heading` | Generic heading font | Any heading element |
| `.font-brand` | Generic brand font | Brand-related text |

## Color Classes

| Class | Usage |
|-------|-------|
| `.text-brand-primary` | Primary brand color text |
| `.text-brand-secondary` | Secondary brand color text |
| `.bg-brand-primary` | Primary brand background |
| `.bg-brand-secondary` | Secondary brand background |

## Popular Font Combinations

### Current (Admin Panel Style)
- **Primary**: System fonts (clean, professional)
- **Heading**: System fonts (consistent, readable)
- **Brand**: System fonts (modern, clean)

### Elegant Option
- **Primary**: 'Inter', system-ui, sans-serif
- **Heading**: 'Playfair Display', serif
- **Brand**: 'Playfair Display', serif

### Modern Option  
- **Primary**: 'Source Sans Pro', system-ui, sans-serif
- **Heading**: 'Poppins', system-ui, sans-serif
- **Brand**: 'Poppins', system-ui, sans-serif

### Readable Option
- **Primary**: 'Open Sans', system-ui, sans-serif
- **Heading**: 'Roboto', system-ui, sans-serif  
- **Brand**: 'Roboto', system-ui, sans-serif

## Adding Custom Fonts

1. **Add font imports** to `/src/index.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
   ```

2. **Update theme configuration** in `/src/config/theme.ts`:
   ```typescript
   fonts: {
     primary: '"Inter", system-ui, sans-serif',
     heading: '"Inter", system-ui, sans-serif',
     brand: '"Inter", system-ui, sans-serif',
   }
   ```

3. **Refresh the page** - changes apply automatically!

## Component Examples

### Before (Inline Styles)
```tsx
<h1 style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
  Title
</h1>
```

### After (Centralized Classes)
```tsx
<h1 className="page-title">
  Title  
</h1>
```

## Benefits

✅ **Single source of truth** - Change fonts in one place  
✅ **Consistent styling** - All components use the same fonts  
✅ **Easy maintenance** - No need to update multiple files  
✅ **Type safety** - TypeScript support for theme configuration  
✅ **Performance** - CSS custom properties are efficient  
✅ **Flexibility** - Easy to switch between different font schemes
