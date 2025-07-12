export const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99999
};

export const modalContainerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '12px',
  maxWidth: '400px',
  width: '100%',
  margin: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  position: 'relative'
};

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

export const titleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '600',
  margin: 0
};

export const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#666'
};

export const buttonContainerStyle: React.CSSProperties = {
  marginBottom: '16px'
};

export const shareButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: 'white',
  cursor: 'pointer',
  marginBottom: '8px',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

export const linkCopyContainerStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '8px'
};

export const inputContainerStyle: React.CSSProperties = {
  display: 'flex'
};

export const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '6px 0 0 6px',
  backgroundColor: '#f9f9f9',
  fontSize: '14px'
};

export const copyButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '0 6px 6px 0',
  cursor: 'pointer'
};
