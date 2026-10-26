
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#ffffff" : "#dbeafe",
    backgroundColor:
      location.pathname === path ? "#2563eb" : "transparent",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "600",
  });

  return (
    <nav
      style={{
        background: "#172554",
        color: "white",
        padding: "18px 7%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      <h2 style={{ margin: 0 }}>Event Admin</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/" style={linkStyle("/")}>
          Dashboard
        </Link>

        <Link to="/add-event" style={linkStyle("/add-event")}>
          + Add Event
        </Link>
      </div>
    </nav>
  );
}
