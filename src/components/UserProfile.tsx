import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "@/models/User";
import { get } from "@/utils/httpHelper";
import { PeakDto } from "@/models/PeakDto";
import '@/styles/user-profile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faMountain } from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
    const { nick } = useParams<{ nick: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [peaks, setPeaks] = useState<PeakDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const limit = 10;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userResponse = await get(`/users/${nick}`);
                setUser(userResponse.data.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchUserPeaks = async () => {
            try {
                const peaksResponse = await get(`/users/${nick}/peaks`, { page, limit });
                setPeaks(peaksResponse.data.data);
                setTotalPages(peaksResponse.data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user peaks:", error);
                setLoading(false);
            }
        };

        fetchUserProfile();
        fetchUserPeaks();
    }, [nick, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (loading) {
        return <div className="text-center text-xl font-semibold">Loading...</div>;
    }

    return (
        <div className="user-profile">
            <h1>
                <em> {user?.nick}</em><br />
                {user?.name} {user?.surname}
            </h1>
            <div>

                <p><strong>Ilość zdobytych szczytów:</strong> {user?.peaksAchieved.length}</p>
            </div>
            <h3>Lista zdobytych szczytów</h3>
            {peaks.length > 0 ? (
                <div>
                    <ul>
                        {peaks.map((peak: PeakDto) => (
                            <li key={peak._id}>
                                <FontAwesomeIcon icon={faMountain} />
                                {peak.name} - {peak.ele} m n.p.m.
                            </li>
                        ))}
                    </ul>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </button>
                        <span>
                            {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </div>
                </div>
            ) : (
                <p>No achieved peaks yet.</p>
            )}
        </div>
    );
}

export default UserProfile;
