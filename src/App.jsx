import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import "./cssFiles/App.css";
import NavBar from "./NavBar";
import Home from "./Home";
import Result from "./Result";

function App() {
  return (
    <>
      <NavBar />
      <div className="appContainer">
        <Routes>
          <Route path="/spotilyzer" element={<Home />} />
          <Route path="/spotilyzer/result" element={<Result />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
