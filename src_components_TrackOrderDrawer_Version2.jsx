import React from "react";

/*
  Slide-over drawer showing mock tracking steps and a map placeholder.
*/
export default function TrackOrderDrawer({ open, onClose }) {
  if (!open) return null;
  const history = [
    { step: 1, label: "Order Received", ts: "2025-11-28 09:12", status: "Funds Locked in Escrow" },
    { step: 2, label: "Packed by seller", ts: "2025-11-28 11:00", status: "In Transit" },
    { step: 3, label: "Out for Delivery", ts: "", status: "In Transit" },
  ];
  return (
    <div className="drawer-backdrop">
      <div className="drawer glass-panel">
        <div className="drawer-header">
          <h3>Track Order</h3>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
        <div className="drawer-map placeholder-map">Map Placeholder</div>
        <div className="drawer-history">
          {history.map(h => (
            <div key={h.step} className="track-row">
              <div className="track-step">{h.step}</div>
              <div className="track-info">
                <div className="track-label">{h.label}</div>
                <div className="track-meta">{h.ts} — <strong>{h.status}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}