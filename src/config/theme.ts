/**
 * Centralized Theme Configuration
 * Change fonts here to update across the entire application
 */

export const theme = {
  fonts: {
    // Primary font for body text and general content
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Font for headings and page titles
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Font for brand elements (logo, brand text)
    brand: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Alternative fonts you can switch to:
    // For a more elegant look: '"Playfair Display", serif'
    // For a modern look: '"Inter", system-ui, sans-serif'
    // For better readability: '"Source Sans Pro", system-ui, sans-serif'
  },
  
  colors: {
    brand: {
      primary: '#a30c34',
      secondary: '#8b0a2b',
      light: '#c41e3a',
      dark: '#7a0a26',
    }
  },
  
  // Utility function to update CSS custom properties
  updateCSSVariables: () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Update font variables
      root.style.setProperty('--font-family-primary', theme.fonts.primary);
      root.style.setProperty('--font-family-heading', theme.fonts.heading);
      root.style.setProperty('--font-family-brand', theme.fonts.brand);
      
      // Update color variables
      root.style.setProperty('--color-brand-primary', theme.colors.brand.primary);
      root.style.setProperty('--color-brand-secondary', theme.colors.brand.secondary);
    }
  }
};

// Auto-update CSS variables when this module is imported
if (typeof window !== 'undefined') {
  theme.updateCSSVariables();
}

export default theme;
