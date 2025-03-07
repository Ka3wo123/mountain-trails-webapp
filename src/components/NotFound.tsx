import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4">404</h1>
      <h2>Page Not Found</h2>
      <p>Oops! It looks like the page you're looking for doesn't exist.</p>
      <p>
        You can go back to the{' '}
        <Link to="/" className="btn btn-primary">
          Homepage
        </Link>{' '}
        or check our
        <Link to="/about" className="btn btn-secondary ms-2">
          About Page
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFound;
