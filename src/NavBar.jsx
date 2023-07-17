import { Link } from "react-router-dom";

import "./cssFiles/NavBar.css";

function NavBar() {
  return (
    <div className="text-center">
      <Link to="/" className="logo">
        Spotilyzer
      </Link>
    </div>
  );
}

export default NavBar;
