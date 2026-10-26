
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddEvent from "./pages/AddEvent";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>404 - Page Not Found</h2>
                <a href="/">Back to Dashboard</a>
              </div>
            }
          />
        </Routes>

        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "30px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} Event Admin Panel
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
