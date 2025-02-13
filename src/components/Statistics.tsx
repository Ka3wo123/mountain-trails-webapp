import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/models/User';
import { get } from '@/utils/httpHelper';
import '@/styles/statistics.css';

const Statistics = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPeaks, setTotalPeaks] = useState<number>(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await get('/users');
                const peaksResponse = await get('/peaks/count');
                setUsers(response.data.data);
                setTotalPeaks(peaksResponse.data.total);
                console.log(peaksResponse)
            } catch (err) {
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Statystyki użytkowników</h1>
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
        </div>
    );
};

export default Statistics;
