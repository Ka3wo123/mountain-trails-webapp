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
        display: 'flex',
        justifySelf: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column',
      }}
    >
      <ScaleLoader color={color} />
      {label && <p style={{ marginTop: '10px', fontSize: '14px', color: 'black' }}>{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
