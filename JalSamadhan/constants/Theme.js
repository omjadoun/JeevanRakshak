export const COLORS = {
  primary: '#2E86AB',
  primaryDark: '#1E5F8E',
  secondary: '#A23B72',
  accent: '#F18F01',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#E1E8ED',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,
  margin: 16,
};

export const FONTS = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  body1: {
    fontSize: 16,
    color: COLORS.text,
  },
  body2: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};
