import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MediRxHomepage from "./MediRxHomepage";
import Cart from "./Cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediRxHomepage />} />
        <Route path="/cart" element={<Cart />} />
        {/* Add other routes as needed */}
        <Route path="*" element={<MediRxHomepage />} />
      </Routes>
    </Router>
  );
}

export default App;
