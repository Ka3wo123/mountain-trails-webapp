import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/models/User';
import '@/styles/statistics.css';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Breadcrumb, ListGroup, ProgressBar } from 'react-bootstrap';
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, ERROR_MESSAGES, ROUTES } from '@/constants';
import CustomPagination from './Pagination';

const Statistics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPeaks, setTotalPeaks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const USERS_LIMIT = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.USERS.PAGINATION(page, USERS_LIMIT));
        const peaksResponse = await axiosInstance.get(API_ENDPOINTS.PEAKS.COUNT);
        setUsers(response.data.data);
        setTotalPeaks(peaksResponse.data);
        setTotalPages(response.data.total);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className='statistics'>
      <Breadcrumb>
        <Breadcrumb.Item href={ROUTES.HOME}>Mapa</Breadcrumb.Item>
        <Breadcrumb.Item href={ROUTES.USERS_STATS} active>Statystyki</Breadcrumb.Item>        
      </Breadcrumb>
      <ListGroup className="peaks-list">
        {users.map((user) => (
          <ListGroup.Item key={user.nick} className="user-info">
            <h2>
              <Link to={ROUTES.USER_PROFILE_PARAM(user.nick)}>
                {user.nick} ({user.name} {user.surname})
              </Link>
            </h2>
            {((user.peaksAchieved.length / totalPeaks) * 100).toFixed(4)}%
            <ProgressBar
              variant={'success'}
              now={user.peaksAchieved.length}
              animated
              max={totalPeaks}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {loading && <LoadingSpinner label="Ładowanie statystyk" />}
    </div>
  );
};

export default Statistics;
