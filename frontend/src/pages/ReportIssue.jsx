import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIES = [
  { value: "pothole", label: "🕳️ Pothole", desc: "Road surface damage" },
  {
    value: "manhole",
    label: "🚧 Open Manhole",
    desc: "Exposed/broken manhole",
  },
  { value: "water", label: "💧 Water Issue", desc: "Leak, flood, drainage" },
  {
    value: "electricity",
    label: "⚡ Electricity",
    desc: "Exposed wires, outage",
  },
  { value: "road", label: "🛣️ Road Damage", desc: "Cracks, potholes, erosion" },
  { value: "other", label: "♻️ Other", desc: "Any civic issue" },
];

// Map click handler component
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [location, setLocation] = useState(null); // { lat, lng }
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=details, 2=location, 3=photo
  const fileRef = useRef();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleLocationPick = async (latlng) => {
    setLocation(latlng);
    // Reverse geocode with Nominatim (free, no key needed)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`,
      );
      const data = await res.json();
      setAddress(data.display_name?.split(",").slice(0, 3).join(", ") || "");
    } catch {
      setAddress(`${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.title) {
      setError("Please enter a title.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(1);
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(1);
      return;
    }
    if (!location) {
      setError("Please pin the location on the map.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
      formData.append("address", address);
      if (imageFile) formData.append("image", imageFile);

      const res = await api.post("/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/issues/${res.data.issue.id}`);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to submit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Details", "Location", "Photo"];

  return (
    <div className="page-wrapper" style={{ padding: "80px 0 80px" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ marginBottom: "8px" }}>Report an Issue</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Help your community by reporting infrastructure problems.
          </p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            marginBottom: "32px",
          }}
        >
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const current = step === n;
            return (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: n < 3 ? 1 : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: done ? "pointer" : "default",
                  }}
                  onClick={() => done && setStep(n)}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      flexShrink: 0,
                      background: current
                        ? "var(--amber-500)"
                        : done
                          ? "rgba(251,191,36,0.2)"
                          : "var(--bg-elevated)",
                      color: current
                        ? "#0a0a0a"
                        : done
                          ? "var(--amber-400)"
                          : "var(--text-muted)",
                      border: `1px solid ${current ? "transparent" : done ? "rgba(251,191,36,0.3)" : "var(--border-default)"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: current
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {n < 3 && (
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      margin: "0 12px",
                      background:
                        step > n
                          ? "rgba(251,191,36,0.3)"
                          : "var(--border-subtle)",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              color: "var(--rose-400)",
              fontSize: "0.875rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div
            className="card"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                name="title"
                placeholder="e.g. Large pothole on MG Road near bus stop"
                value={form.title}
                onChange={handleChange}
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, category: cat.value }))
                    }
                    style={{
                      padding: "10px 8px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${form.category === cat.value ? "rgba(251,191,36,0.4)" : "var(--border-default)"}`,
                      background:
                        form.category === cat.value
                          ? "rgba(251,191,36,0.08)"
                          : "var(--bg-elevated)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color:
                          form.category === cat.value
                            ? "var(--amber-400)"
                            : "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {cat.label}
                    </div>
                    <div
                      style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                    >
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description{" "}
                <span style={{ color: "var(--text-muted)" }}>(optional)</span>
              </label>
              <textarea
                className="form-textarea"
                name="description"
                placeholder="Describe the issue in detail — size, severity, how long it's been there…"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                if (!form.title) {
                  setError("Please enter a title.");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                if (!form.category) {
                  setError("Please select a category.");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                setError("");
                setStep(2);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{ alignSelf: "flex-end" }}
            >
              Next: Pin Location →
            </button>
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
    📍 Click anywhere on the map to pin the exact location of the issue.
  </p>
  <button
    type="button"
    onClick={() => {
      if (!navigator.geolocation) return
      navigator.geolocation.getCurrentPosition(
        (pos) => handleLocationPick({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert('Could not get your location. Please allow location access.')
      )
    }}
    className="btn btn-secondary btn-sm location-btn"
    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
    Use My Location
  </button>
</div>
              {/* {location && (
                <div style={{
                  marginTop: '8px', padding: '8px 12px',
                  background: 'rgba(251,191,36,0.08)', borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  fontSize: '0.8rem', color: 'var(--amber-400)',
                }}>
                  ✓ Pinned: {address || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
                </div>
              )} */}
              {/* Manual lat/lng input */}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input
                  className="form-input"
                  placeholder="Latitude e.g. 28.6139"
                  type="number"
                  step="any"
                  value={location?.lat || ""}
                  onChange={(e) => {
                    const lat = parseFloat(e.target.value);
                    if (!isNaN(lat))
                      handleLocationPick({ lat, lng: location?.lng || 77.209 });
                  }}
                  style={{ flex: 1 }}
                />
                <input
                  className="form-input"
                  placeholder="Longitude e.g. 77.2090"
                  type="number"
                  step="any"
                  value={location?.lng || ""}
                  onChange={(e) => {
                    const lng = parseFloat(e.target.value);
                    if (!isNaN(lng))
                      handleLocationPick({
                        lat: location?.lat || 20.5937,
                        lng,
                      });
                  }}
                  style={{ flex: 1 }}
                />
              </div>

              {location && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    background: "rgba(251,191,36,0.08)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(251,191,36,0.2)",
                    fontSize: "0.8rem",
                    color: "var(--amber-400)",
                  }}
                >
                  ✓ Pinned:{" "}
                  {address ||
                    `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
                </div>
              )}
            </div>

            <div style={{ height: "380px" }}>
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onPick={handleLocationPick} />
                {location && <Marker position={[location.lat, location.lng]} />}
              </MapContainer>
            </div>

            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!location) {
                    setError("Please click on the map to pin a location.");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                  }
                  setError("");
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Next: Add Photo →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Photo ── */}
        {step === 3 && (
          <div
            className="card"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <label
                className="form-label"
                style={{ marginBottom: "10px", display: "block" }}
              >
                Photo{" "}
                <span style={{ color: "var(--text-muted)" }}>
                  (optional but recommended)
                </span>
              </label>

              {imagePreview ? (
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.6)",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "48px 24px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    marginBottom: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)";
                    e.currentTarget.style.background = "rgba(251,191,36,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.background = "";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    📸
                  </div>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    Click to upload a photo
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    JPG, PNG or WebP · max 8MB
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Summary */}
            <div
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                fontSize: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "var(--text-secondary)",
                }}
              >
                Summary
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Title:</span>{" "}
                {form.title}
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Category:</span>{" "}
                {form.category}
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Location:</span>{" "}
                {address || "Pinned on map"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Submitting…" : "🚀 Submit Report"}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 480px) {
          .location-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}