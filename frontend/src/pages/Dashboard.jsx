
import { useEffect, useState } from "react";
import axios from "axios";

const API = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/events`;

const emptyForm = {
  eventName: "",
  description: "",
  eventDate: "",
  venue: "",
};

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchEvents() {
    try {
      setError("");
      const response = await axios.get(API);
      setEvents(response.data);
    } catch (err) {
      setError("Unable to load events. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function startEdit(event) {
    setEditingId(event._id);
    setForm({
      eventName: event.eventName || "",
      description: event.description || "",
      eventDate: event.eventDate
        ? String(event.eventDate).slice(0, 10)
        : "",
      venue: event.venue || "",
    });
    setError("");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveEdit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
      setForm(emptyForm);
      await fetchEvents();
      alert("Event updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      setEvents((previous) =>
        previous.filter((event) => event._id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event.");
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    marginTop: "6px",
    fontSize: "15px",
  };

  const buttonStyle = (background) => ({
    background,
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "9px 13px",
    cursor: "pointer",
  });

  return (
    <main style={{ maxWidth: "1200px", margin: "auto", padding: "30px 5%" }}>
      <h1 style={{ color: "#172554" }}>Event Dashboard</h1>
      <p style={{ color: "#64748b" }}>
        View and manage your registered events.
      </p>

      {error && (
        <p style={{ color: "#dc2626", background: "#fee2e2", padding: "12px" }}>
          {error}
        </p>
      )}

      {editingId && (
        <form
          onSubmit={saveEdit}
          style={{
            display: "grid",
            gap: "15px",
            background: "white",
            padding: "22px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            margin: "25px 0",
          }}
        >
          <h2 style={{ margin: 0 }}>Edit Event</h2>

          <label>
            Event Name *
            <input
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              style={inputStyle}
            />
          </label>

          <label>
            Event Date *
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label>
            Venue *
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={saving}
              style={buttonStyle("#2563eb")}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setError("");
              }}
              style={buttonStyle("#64748b")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "24px" }}>
          <table
            style={{
              width: "100%",
              minWidth: "750px",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead style={{ background: "#eff6ff" }}>
              <tr>
                {[
                  "Event ID",
                  "Event Name",
                  "Event Date",
                  "Venue",
                  "Total Registrations",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} style={cellStyle}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td style={cellStyle}>{event._id.slice(-6)}</td>
                  <td style={cellStyle}>{event.eventName}</td>
                  <td style={cellStyle}>
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-GB", {
                          timeZone: "UTC",
                        })
                      : "—"}
                  </td>
                  <td style={cellStyle}>{event.venue}</td>
                  <td style={cellStyle}>{event.totalRegistrations || 0}</td>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => startEdit(event)}
                        style={buttonStyle("#0f766e")}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        style={buttonStyle("#dc2626")}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan="6" style={cellStyle}>
                    No events found. Add your first event!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const cellStyle = {
  padding: "13px",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "left",
  whiteSpace: "nowrap",
};
