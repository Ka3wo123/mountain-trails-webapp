import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/models/User';
import { get } from '@/utils/httpHelper';
import '@/styles/statistics.css';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const Statistics = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPeaks, setTotalPeaks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await get('/users');
                const peaksResponse = await get('/peaks/count');
                setUsers(response.data.data);
                setTotalPeaks(peaksResponse.data.total);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                toast.error('Coś poszło nie tak');
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Statystyki użytkowników</h1>
            {loading ? <LoadingSpinner /> : (
                <div>
                    {users.map((user) => (
                        <div key={user.nick} className="user-info">
                            <h2>
                                <Link to={`/${user.nick}/profile`}>{user.nick} ({user.name} {user.surname})</Link>
                            </h2>
                            {(user.peaksAchieved.length / totalPeaks * 100).toFixed(4)}%
                            <progress value={parseFloat((user.peaksAchieved.length / totalPeaks).toFixed(7))}></progress>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Statistics;
