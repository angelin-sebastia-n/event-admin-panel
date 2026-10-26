
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events`;

export default function AddEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    venue: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await axios.post(API, form);
      alert("Event added successfully!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not add event. Check that your backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  };

  return (
    <main style={{ maxWidth: "650px", margin: "35px auto", padding: "0 20px" }}>
      <h1 style={{ color: "#172554" }}>Add New Event</h1>
      <p style={{ color: "#64748b" }}>
        Enter the details below to create an event.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "25px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          display: "grid",
          gap: "18px",
        }}
      >
        <div>
          <label htmlFor="eventName">Event Name *</label>
          <input
            id="eventName"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            required
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your event"
            rows="4"
            style={{ ...fieldStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label htmlFor="eventDate">Event Date *</label>
          <input
            id="eventDate"
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="venue">Venue *</label>
          <input
            id="venue"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Enter event venue"
            required
            style={fieldStyle}
          />
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "7px",
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Add Event"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "#e2e8f0",
              color: "#172554",
              border: "none",
              padding: "12px 20px",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
