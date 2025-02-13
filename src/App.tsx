import '@/App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MountainTrailsMap from '@/components/MountainMap';
import Header from '@/components/Navbar';
import Statistics from '@/components/Statistics';
import Register from '@/components/Register';
import { AuthProvider } from '@/context/authContext';
import UserProfile from '@/components/UserProfile';
import projectData from '@/../package.json';
import About from './components/About';
import NotFound from './components/NotFound';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Header />}>
        <Route index element={<MountainTrailsMap />} />
        <Route path="/stats" element={<Statistics />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:nick/profile" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <footer style={{ fontSize: '0.7rem', justifySelf: 'center' }}>
        Mountain trails &copy; version: {projectData.version} | <a href='/about'>About</a>
      </footer>

    </AuthProvider>
  );
};

export default App;
