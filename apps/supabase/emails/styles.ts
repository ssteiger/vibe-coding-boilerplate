const colors = {
  foreground: '#171717',
  foregroundLight: '#525252',
  foregroundLighter: '#707070',
  foregroundOnCanvas: '#a3a3a3',
  canvas: '#171717',
  surface: '#ffffff',
  border: '#dfdfdf',
  divider: '#ededed',
  codeBackground: '#f5f5f5',
}

const fontFamily = 'Circular, "Helvetica Neue", Helvetica, Arial, sans-serif'

const radius = '12px'

export const styles = {
  main: {
    backgroundColor: colors.canvas,
    fontFamily,
    margin: '0',
    padding: '48px 16px 56px',
  },

  container: {
    maxWidth: '520px',
  },

  header: {
    padding: '0 0 28px',
  },

  wordmark: {
    color: colors.surface,
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '24px',
    margin: '0',
    textAlign: 'center' as const,
  },

  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius,
  },

  cardBody: {
    padding: '40px 36px 36px',
  },

  title: {
    color: colors.foreground,
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
    margin: '0 0 16px',
  },

  paragraph: {
    color: colors.foregroundLight,
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 12px',
  },

  code: {
    backgroundColor: colors.codeBackground,
    borderRadius: radius,
    color: colors.foreground,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '28px',
    fontWeight: 500,
    letterSpacing: '6px',
    lineHeight: '36px',
    margin: '16px 0 0',
    padding: '16px 0',
    textAlign: 'center' as const,
  },

  buttonSection: {
    padding: '16px 0 0',
  },

  button: {
    backgroundColor: colors.foreground,
    borderRadius: radius,
    color: colors.surface,
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '14px 24px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },

  note: {
    color: colors.foregroundLighter,
    fontSize: '13px',
    lineHeight: '20px',
    margin: '12px 0 0',
    textAlign: 'center' as const,
  },

  hr: {
    borderColor: colors.divider,
    margin: '32px 0 24px',
  },

  small: {
    color: colors.foregroundLighter,
    fontSize: '13px',
    lineHeight: '20px',
    margin: '0 0 8px',
  },

  anchor: {
    color: colors.foreground,
    textDecoration: 'underline',
    wordBreak: 'break-all' as const,
  },

  signature: {
    color: colors.foreground,
    fontSize: '13px',
    lineHeight: '20px',
    margin: '16px 0 0',
  },

  footer: {
    color: colors.foregroundOnCanvas,
    fontSize: '12px',
    lineHeight: '18px',
    margin: '24px 0 0',
    textAlign: 'center' as const,
  },
}
