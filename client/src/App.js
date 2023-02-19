import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import About from "./About";
import Fib from "./Fib";
import Home from "./Home";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              Fib Finder
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <NavLink className="navbar-brand" to="/">
                  Home
                </NavLink>
                <NavLink className="navbar-brand" to="/fib">
                  Fib Finder
                </NavLink>
                <NavLink className="navbar-brand" to="/about">
                  About Us
                </NavLink>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="container mt-4">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/fib" element={<Fib />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
