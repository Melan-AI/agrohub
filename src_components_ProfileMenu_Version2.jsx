import React, { useState } from "react";
import WellnessProfile from "../pages/ProfileSections/WellnessProfile";
import SellerVerification from "../pages/ProfileSections/SellerVerification";

export default function ProfileMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("wellness");

  return (
    <div className="profile-dropdown">
      <button className="avatar-btn" onClick={() => setOpen(o => !o)}>{user.name[0]}</button>
      {open && (
        <div className="profile-panel glass-box">
          <div className="profile-links">
            <button onClick={() => setView("wellness")}>My Wellness Profile</button>
            <button onClick={() => setView("orders")}>Track My Orders</button>
            <button onClick={() => setView("reviews")}>Reviews & Trust</button>
            <button onClick={() => setView("seller")}>Switch to Seller</button>
            <button onClick={() => setView("qa")}>Questions & Answers</button>
            <hr />
            <button className="btn ghost" onClick={onSignOut}>Sign Out</button>
          </div>

          <div className="profile-content">
            {view === "wellness" && <WellnessProfile />}
            {view === "seller" && <SellerVerification />}
            {view === "orders" && <div><h4>Orders</h4><p>No orders yet (prototype).</p></div>}
            {view === "reviews" && <div><h4>Reviews & Trust</h4><p>Submit a rating for your last seller.</p></div>}
            {view === "qa" && <div><h4>FAQ</h4><p>Common questions and support hub.</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}