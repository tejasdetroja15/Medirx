import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MediRxHomepage from "./MediRxHomepage";
import Cart from "./Cart";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediRxHomepage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add other routes as needed */}
        <Route path="*" element={<MediRxHomepage />} />
      </Routes>
    </Router>
  );
}

export default App;
