import '@/App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import MountainTrailsMap from '@/components/MountainMap';
import Header from '@/components/Navbar';
import Statistics from '@/components/Statistics';
import Register from '@/components/Register';
import { AuthProvider } from '@/context/authContext';
import UserProfile from '@/components/UserProfile';
import projectData from '@/../package.json';
import About from './components/About';
import NotFound from './components/NotFound';
import { ROUTES } from './constants';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Header />}>
        <Route index element={<MountainTrailsMap />} />
        <Route path={ROUTES.USERS_STATS} element={<Statistics />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <footer style={{ fontSize: '0.7rem', justifySelf: 'center' }}>
        Mountain trails &copy; version: {projectData.version} | <a href="/about">About</a>
      </footer>
    </AuthProvider>
  );
};

export default App;
