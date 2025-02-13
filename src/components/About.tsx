import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">About Mountain Trails</h1>
      
      <section className="mb-4">
        <h3>What is Mountain Trails?</h3>
        <p>
          Mountain Trails is a web-based application that allows outdoor enthusiasts to explore,
          discover, and track mountain trails across various locations. Whether you're an avid hiker
          or a casual explorer, our app provides you with detailed information about trails,
          peak elevations, and user achievements. 
        </p>
      </section>
      
      <section className="mb-4">
        <h3>Features:</h3>
        <ul>
          <li>View detailed maps of mountain trails</li>
          <li>Track your achievements and progress</li>
          <li>Join a community of hikers and trail enthusiasts</li>
          <li>Explore statistical insights on your hiking journeys</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3>How to Get Started</h3>
        <p>
          To get started, simply sign up for an account, log in, and start exploring the trails.
          You can also keep track of the peaks you've conquered, add new trails to your collection,
          and view your statistics.
        </p>
        <Link to="/register" className="btn btn-primary">Sign Up</Link>
      </section>

      <section>
        <h3>Get Involved</h3>
        <p>
          If you'd like to contribute or add new trails, feel free to reach out to us! We are always
          looking to expand our database with new, exciting trails. Whether you're a trail mapper, a
          developer, or a hiker with interesting information to share, we welcome all contributions.
        </p>
      </section>
      
    </div>
  );
};

export default About;
