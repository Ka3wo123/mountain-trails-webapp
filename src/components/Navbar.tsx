// import { Link } from "react-router";
import "../styles/navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                {/* <li><Link to="/">Home</Link></li>
                <li><Link to="/map">Statystyki</Link></li>
                <li><Link to="#">Dodaj trasę</Link></li> */}
                <li><a href="/">Home</a></li>
                <li><a href="/map">Statystyki</a></li>
                <li><a href="#">Dodaj trasę</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
