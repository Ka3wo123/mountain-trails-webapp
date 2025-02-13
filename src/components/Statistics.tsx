import { ProgressBar } from 'react-progressbar-fancy';

const Statistics = () => {
    return (
        <div>            
            <div>
                <ProgressBar score={100} progressColor='purple' label='Zdobyte szczyty'/>                
            </div>
        </div>
    );
}

export default Statistics;
