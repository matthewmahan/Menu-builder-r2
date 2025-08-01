const theme = {
  // Colors
  colors: {
    primary: {
      light: '#60a5fa',
      main: '#2563eb',
      dark: '#1d4ed8',
      darker: '#1e40af'
    },
    secondary: {
      light: '#94a3b8',
      main: '#64748b',
      dark: '#475569',
      darker: '#334155'
    },
    success: {
      light: '#86efac',
      main: '#22c55e',
      dark: '#16a34a',
      darker: '#15803d'
    },
    warning: {
      light: '#fbbf24',
      main: '#f59e0b',
      dark: '#d97706',
      darker: '#b45309'
    },
    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#dc2626',
      darker: '#b91c1c'
    },
    info: {
      light: '#7dd3fc',
      main: '#0ea5e9',
      dark: '#0284c7',
      darker: '#0369a1'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      disabled: '#e2e8f0',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      disabled: '#d1d5db',
      placeholder: '#9ca3af',
      inverse: '#ffffff'
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af'
    }
  },

  // Typography
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    mono: '"Fira Code", "Monaco", "Consolas", "Ubuntu Mono", monospace'
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    xxl: '2rem',      // 32px
    xxxl: '2.5rem'    // 40px
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem',      // 48px
    xxxl: '4rem'      // 64px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },

  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // Transitions
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.2s ease-in-out',
    slow: '0.3s ease-in-out'
  },

  // Component specific
  components: {
    button: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem'
      }
    },
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      }
    },
    card: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    navbar: {
      height: '4rem',
      padding: '0 1rem'
    },
    sidebar: {
      width: '16rem',
      collapsedWidth: '4rem'
    }
  },

  // Media queries
  media: {
    xs: `@media (min-width: 320px)`,
    sm: `@media (min-width: 640px)`,
    md: `@media (min-width: 768px)`,
    lg: `@media (min-width: 1024px)`,
    xl: `@media (min-width: 1280px)`,
    xxl: `@media (min-width: 1536px)`,
    
    // Max width queries
    maxXs: `@media (max-width: 639px)`,
    maxSm: `@media (max-width: 767px)`,
    maxMd: `@media (max-width: 1023px)`,
    maxLg: `@media (max-width: 1279px)`,
    maxXl: `@media (max-width: 1535px)`,

    // Specific device queries
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
    desktop: `@media (min-width: 1024px)`,
    
    // Print
    print: `@media print`,
    
    // Reduced motion
    reducedMotion: `@media (prefers-reduced-motion: reduce)`,
    
    // Dark mode
    dark: `@media (prefers-color-scheme: dark)`,
    
    // High contrast
    highContrast: `@media (prefers-contrast: high)`
  }
};

export default theme;