// styles/styles.js
export const colors = {
  primary: '#1a73e8',
  secondary: '#fbbc05',
  background: '#f9fafb',
  text: '#111827',
  muted: '#6b7280',
  white: '#ffffff',
}

export const card = {
  base: {
    background: colors.white,
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '16px',
  },
}

export const button = {
  base: {
    background: colors.primary,
    color: colors.white,
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondary: {
    background: colors.secondary,
    color: colors.text,
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  }
}

export const text = {
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: colors.text,
  },
  muted: {
    fontSize: '14px',
    color: colors.muted,
  }
}
