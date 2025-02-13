import { ScaleLoader } from 'react-spinners';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

const LoadingSpinner = ({ color = '#6947c9' }: LoadingSpinnerProps) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', margin: '10%'}}>
            <ScaleLoader color={color} />
        </div>
    );
};

export default LoadingSpinner;
