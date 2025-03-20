export const themeConfig = {
  light: {
    primary: {
      DEFAULT: '#2563eb', // Blue for primary actions
      hover: '#1d4ed8',
      light: '#dbeafe',
    },
    success: {
      DEFAULT: '#16a34a', // Green for positive numbers/profits
      hover: '#15803d',
      light: '#dcfce7',
    },
    danger: {
      DEFAULT: '#dc2626', // Red for negative numbers/losses
      hover: '#b91c1c',
      light: '#fee2e2',
    },
    warning: {
      DEFAULT: '#eab308', // Yellow for warnings/alerts
      hover: '#ca8a04',
      light: '#fef9c3',
    },
    background: {
      DEFAULT: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      DEFAULT: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
    },
  },
  dark: {
    primary: {
      DEFAULT: '#3b82f6',
      hover: '#2563eb',
      light: '#1e3a8a',
    },
    success: {
      DEFAULT: '#22c55e',
      hover: '#16a34a',
      light: '#14532d',
    },
    danger: {
      DEFAULT: '#ef4444',
      hover: '#dc2626',
      light: '#7f1d1d',
    },
    warning: {
      DEFAULT: '#facc15',
      hover: '#eab308',
      light: '#713f12',
    },
    background: {
      DEFAULT: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      DEFAULT: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-inter)',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
} as const
