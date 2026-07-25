import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const categoryEmoji = {
  pothole: "🕳️",
  manhole: "🚧",
  water: "💧",
  electricity: "⚡",
  road: "🛣️",
  other: "♻️",
};

const statusColor = {
  open: "#f59e0b",
  in_progress: "#6b7280",
  resolved: "#4ade80",
  rejected: "#fb7185",
};

const statusLabel = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const STATUSES = ["open", "in_progress", "resolved", "rejected"];

const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UpvoteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [logs, setLogs] = useState([]);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Officer status update
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/issues/${id}`)
      .then((r) => {
        setIssue(r.data.issue);
        setLogs(r.data.status_logs || []);
        setVoted(r.data.user_voted || false);
        setVoteCount(r.data.issue.vote_count || 0);
      })
      .catch(() => setError("Issue not found."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".share-menu-wrapper")) setShowShareMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleVote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (voteLoading) return;
    setVoteLoading(true);

    const wasVoted = voted;
    // Optimistic update
    setVoted(!wasVoted);
    setVoteCount((c) => (wasVoted ? c - 1 : c + 1));

    try {
      if (wasVoted) {
        await api.delete(`/issues/${id}/vote`);
      } else {
        await api.post(`/issues/${id}/vote`);
      }
    } catch {
      // Revert on error
      setVoted(wasVoted);
      setVoteCount((c) => (wasVoted ? c + 1 : c - 1));
    } finally {
      setVoteLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setStatusLoading(true);
    try {
      const res = await api.patch(`/issues/${id}/status`, {
        status: newStatus,
        note: statusNote,
      });
      setIssue(res.data.issue);
      setLogs((prev) => [
        ...prev,
        {
          old_status: issue.status,
          new_status: newStatus,
          note: statusNote,
          changed_by_name: user.name,
          created_at: new Date().toISOString(),
        },
      ]);
      setShowStatusPanel(false);
      setStatusNote("");
      setNewStatus("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div
        className="page-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--border-default)",
            borderTopColor: "var(--amber-500)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (error)
    return (
      <div
        className="page-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🔍</div>
        <h3>{error}</h3>
        <Link to="/map" className="btn btn-secondary">
          Back to Map
        </Link>
      </div>
    );

  const coords = issue.coordinates;
  const lat = coords ? coords[1] : null;
  const lng = coords ? coords[0] : null;

  return (
    <div className="page-wrapper" style={{ padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "780px" }}>
        {/* Back */}
        <Link
          to="/map"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            textDecoration: "none",
            marginBottom: "24px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <BackIcon /> Back to Map
        </Link>

        {/* Issue image */}
        {issue.image_url && (
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginBottom: "28px",
              height: "340px",
            }}
          >
            <img
              src={issue.image_url}
              alt={issue.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>
              {categoryEmoji[issue.category]}
            </span>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.72rem",
                fontWeight: "700",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                background: statusColor[issue.status] + "18",
                color: statusColor[issue.status],
                border: `1px solid ${statusColor[issue.status]}33`,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: statusColor[issue.status],
                  display: "inline-block",
                  marginRight: "5px",
                  boxShadow:
                    issue.status === "open"
                      ? `0 0 6px ${statusColor[issue.status]}`
                      : "none",
                }}
              />
              {statusLabel[issue.status]}
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontWeight: "600",
              }}
            >
              {issue.category}
            </span>
          </div>

          <h2 style={{ marginBottom: "10px", lineHeight: "1.3" }}>
            {issue.title}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            {issue.address && <span>📍 {issue.address}</span>}
            <span>🕐 {timeAgo(issue.created_at)}</span>
            <span>👤 {issue.user?.name || "Anonymous"}</span>
          </div>
        </div>

        {/* Action bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          {/* Vote button */}
          <button
            onClick={handleVote}
            disabled={voteLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "var(--radius-full)",
              background: voted
                ? "rgba(251,191,36,0.12)"
                : "var(--bg-elevated)",
              border: `1px solid ${voted ? "rgba(251,191,36,0.35)" : "var(--border-default)"}`,
              color: voted ? "var(--amber-400)" : "var(--text-secondary)",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor: voteLoading ? "wait" : "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!voted) {
                e.currentTarget.style.borderColor = "rgba(251,191,36,0.25)";
                e.currentTarget.style.color = "var(--amber-400)";
              }
            }}
            onMouseLeave={(e) => {
              if (!voted) {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
          >
            <UpvoteIcon />
            {voteCount} {voteCount === 1 ? "vote" : "votes"}
          </button>

          {/* Share */}
          <div className="share-menu-wrapper" style={{ position: "relative" }}>
            <button
              onClick={() => {
                const shareText = `🚨 Civic Issue Reported on FixTown!\n\n📌 ${issue.title}\n📍 ${issue.address || "Location pinned on map"}\n🏷️ Category: ${issue.category}\n\nKindly vote to raise this issue to the higher authorities and get it resolved faster.\n\n👉 View & Vote: ${window.location.href}`;
                if (navigator.share) {
                  navigator
                    .share({
                      title: issue.title,
                      text: shareText,
                      url: window.location.href,
                    })
                    .catch(() => {});
                } else {
                  setShowShareMenu((v) => !v);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <ShareIcon /> Share
            </button>

            {showShareMenu &&
              (() => {
                const shareText = `🚨 Civic Issue Reported on FixTown!\n\n📌 ${issue.title}\n📍 ${issue.address || "Location pinned on map"}\n🏷️ Category: ${issue.category}\n\nKindly vote to raise this issue to the higher authorities and get it resolved faster.\n\n👉 View & Vote: ${window.location.href}`;
                const links = [
                  {
                    label: "WhatsApp",
                    emoji: "💬",
                    url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                  },
                  {
                    label: "X (Twitter)",
                    emoji: "🐦",
                    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                  },
                  {
                    label: "Telegram",
                    emoji: "✈️",
                    url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`,
                  },
                  { label: "Copy Link", emoji: "🔗", url: null },
                ];
                return (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-lg)",
                      padding: "8px",
                      minWidth: "180px",
                      boxShadow: "var(--shadow-lg)",
                      zIndex: 50,
                      animation: "fadeInUp 0.2s var(--ease-out) both",
                    }}
                  >
                    {links.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          if (s.url) {
                            window.open(s.url, "_blank");
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                          setShowShareMenu(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "var(--radius-md)",
                          background: "transparent",
                          border: "none",
                          color:
                            s.label === "Copy Link" && copied
                              ? "#4ade80"
                              : "var(--text-secondary)",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--bg-elevated)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span>{s.emoji}</span>
                        {s.label === "Copy Link" && copied
                          ? "Copied!"
                          : s.label}
                      </button>
                    ))}
                  </div>
                );
              })()}
          </div>

          {/* Officer: update status */}
          {user?.role === "officer" && (
            <button
              onClick={() => setShowStatusPanel((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "var(--radius-full)",
                background: showStatusPanel
                  ? "rgba(251,191,36,0.1)"
                  : "var(--bg-elevated)",
                border: `1px solid ${showStatusPanel ? "rgba(251,191,36,0.3)" : "var(--border-default)"}`,
                color: showStatusPanel
                  ? "var(--amber-400)"
                  : "var(--text-secondary)",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.15s",
                marginLeft: "auto",
              }}
            >
              🏛️ Update Status
            </button>
          )}
        </div>

        {/* Officer status update panel */}
        {showStatusPanel && user?.role === "officer" && (
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              marginBottom: "24px",
              animation: "fadeInUp 0.2s var(--ease-out)",
            }}
          >
            <h4 style={{ marginBottom: "14px", fontSize: "0.95rem" }}>
              Update Issue Status
            </h4>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "14px",
              }}
            >
              {STATUSES.filter((s) => s !== issue.status).map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    background:
                      newStatus === s
                        ? statusColor[s] + "22"
                        : "var(--bg-surface)",
                    border: `1px solid ${newStatus === s ? statusColor[s] + "55" : "var(--border-default)"}`,
                    color:
                      newStatus === s
                        ? statusColor[s]
                        : "var(--text-secondary)",
                    transition: "all 0.15s",
                  }}
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
            <textarea
              className="form-textarea"
              placeholder="Add a note (optional)…"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={2}
              style={{ marginBottom: "12px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleStatusUpdate}
                disabled={!newStatus || statusLoading}
                style={{ opacity: !newStatus || statusLoading ? 0.6 : 1 }}
              >
                {statusLoading ? "Updating…" : "Confirm Update"}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowStatusPanel(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
          className="issue-grid"
        >
          {/* Left column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Description */}
            {issue.description && (
              <div className="card" style={{ padding: "20px" }}>
                <h4
                  style={{
                    marginBottom: "10px",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Description
                </h4>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.7",
                    color: "var(--text-secondary)",
                  }}
                >
                  {issue.description}
                </p>
              </div>
            )}

            {/* Status timeline */}
            <div className="card" style={{ padding: "20px" }}>
              <h4
                style={{
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Status Timeline
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "0" }}
              >
                {/* Initial open */}
                <TimelineItem
                  status="open"
                  label="Issue Reported"
                  by={issue.user?.name}
                  date={issue.created_at}
                  isFirst={true}
                  isLast={logs.length === 0}
                />
                {logs.map((log, i) => (
                  <TimelineItem
                    key={i}
                    status={log.new_status}
                    label={`Changed to ${statusLabel[log.new_status]}`}
                    by={log.changed_by_name}
                    date={log.created_at}
                    note={log.note}
                    isLast={i === logs.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Map */}
            {lat && lng && (
              <div
                className="card"
                style={{ padding: "0", overflow: "hidden" }}
              >
                <div style={{ height: "220px" }}>
                  <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lng]}>
                      <Popup>{issue.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                {issue.address && (
                  <div
                    style={{
                      padding: "12px 14px",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    📍 {issue.address}
                  </div>
                )}
              </div>
            )}

            {/* Issue info card */}
            <div className="card" style={{ padding: "20px" }}>
              <h4
                style={{
                  marginBottom: "14px",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Details
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.875rem",
                }}
              >
                {[
                  {
                    label: "Category",
                    value: `${categoryEmoji[issue.category]} ${issue.category}`,
                  },
                  { label: "Status", value: statusLabel[issue.status] },
                  { label: "Votes", value: voteCount },
                  { label: "Reported", value: timeAgo(issue.created_at) },
                  { label: "Reporter", value: issue.user?.name || "—" },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "8px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        textTransform:
                          row.label === "Category" || row.label === "Status"
                            ? "capitalize"
                            : "none",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .issue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function TimelineItem({ status, label, by, date, note, isFirst, isLast }) {
  const color = statusColor[status] || "#f59e0b";
  const timeAgo = (d) => {
    const diff = Math.floor((Date.now() - new Date(d)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        paddingBottom: isLast ? "0" : "16px",
        position: "relative",
      }}
    >
      {/* Vertical line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "22px",
            width: "1px",
            bottom: "0",
            background: "var(--border-subtle)",
          }}
        />
      )}
      {/* Dot */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          flexShrink: 0,
          background: color + "22",
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1px",
          boxShadow: isLast ? `0 0 8px ${color}44` : "none",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: color,
          }}
        />
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingTop: "1px" }}>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {by && <span>{by} · </span>}
          {timeAgo(date)}
        </div>
        {note && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginTop: "4px",
              fontStyle: "italic",
            }}
          >
            "{note}"
          </div>
        )}
      </div>
    </div>
  );
}
