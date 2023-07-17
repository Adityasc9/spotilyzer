import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./cssFiles/NavBar.css";

function NavBar() {
  return (
    <div className="text-center">
      <a href="/" className="logo">
        Spotilyzer
      </a>
    </div>
  );
}

export default NavBar;
