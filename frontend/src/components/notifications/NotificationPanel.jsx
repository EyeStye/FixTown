import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useDelayedUnmount } from "../../hooks/useDelayedUnmount";

const BellIcon = ({ count }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
    {count > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-6px",
          background: "var(--amber-500)",
          color: "#0a0a0a",
          borderRadius: "999px",
          fontSize: "0.6rem",
          fontWeight: "800",
          minWidth: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 3px",
          lineHeight: 1,
          boxShadow: "0 0 6px rgba(251,191,36,0.5)",
          animation: "pulse-glow 2s infinite",
        }}
      >
        {count > 9 ? "9+" : count}
      </span>
    )}
  </div>
);

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef();

  const unread = notifs.filter((n) => !n.is_read).length;
  const shouldRender = useDelayedUnmount(open);

  useEffect(() => {
    fetchNotifs();
    // Poll every 30s
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await api.get("/notifications?limit=20");
      setNotifs(res.data.notifications || []);
    } catch {
      // silently fail
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch {}
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
          cursor: "pointer",
          color: "var(--text-secondary)",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }
        }}
      >
        <BellIcon count={unread} />
      </button>

      {shouldRender && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            right: "8px",
            width: "calc(100vw - 16px)",
            maxWidth: "320px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 50,
            animation: open ? "fadeInUp 0.2s var(--ease-out) both" : "fadeOutDown 0.15s ease-in both",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>
              Notifications{" "}
              {unread > 0 && (
                <span style={{ color: "var(--amber-400)" }}>({unread})</span>
              )}
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "var(--amber-400)",
                  fontWeight: "600",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                  🔔
                </div>
                No notifications yet
              </div>
            ) : (
              notifs.map((n) => (
                <Link
                  key={n.id}
                  to={`/issues/${n.issue_id}`}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    background: n.is_read
                      ? "transparent"
                      : "rgba(251,191,36,0.04)",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = n.is_read
                      ? "transparent"
                      : "rgba(251,191,36,0.04)")
                  }
                >
                  {/* Unread dot */}
                  <div style={{ paddingTop: "5px", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: n.is_read
                          ? "transparent"
                          : "var(--amber-500)",
                        border: n.is_read
                          ? "1px solid var(--border-default)"
                          : "none",
                        boxShadow: n.is_read
                          ? "none"
                          : "0 0 5px var(--amber-400)",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {n.message}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        marginTop: "3px",
                      }}
                    >
                      {timeAgo(n.created_at)} ago
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}