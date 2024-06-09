const handleStyle = {
  width: '24px',
  height: '24px',
  background: '#fff',
  top: '50%',
  transform: 'translateY(-50%)',
  borderRadius: '50%',
  border: '4px solid #000',
  boxShadow: '0 0 0 2px #000',
} as React.CSSProperties

export const handleStyleRight = {
  ...handleStyle,
  right: '-12px',
} as React.CSSProperties

export const handleStyleLeft = {
  ...handleStyle,
  left: '-12px',
} as React.CSSProperties
