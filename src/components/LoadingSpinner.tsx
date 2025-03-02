import { ScaleLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

const LoadingSpinner = ({ color = '#6947c9', label }: LoadingSpinnerProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column',
      }}
    >
      <ScaleLoader color={color} />
      {label && <p style={{ marginTop: '10px', fontSize: '14px', color: 'white' }}>{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
