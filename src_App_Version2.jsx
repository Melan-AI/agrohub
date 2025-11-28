import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import ProfileMenu from "./components/ProfileMenu";
import TrackOrderDrawer from "./components/TrackOrderDrawer";
import ChatbotFAB from "./components/ChatbotFAB";

export default function App() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  function signIn(mockUser) {
    setUser(mockUser);
    navigate("/marketplace");
  }

  function signOut() {
    setUser(null);
    navigate("/");
  }

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-left">
          <Link to="/" className="logo">AgroHub</Link>
        </div>
        <div className="nav-right">
          <button className="btn ghost" onClick={() => setDrawerOpen(true)}>Track Order</button>
          {user ? (
            <ProfileMenu user={user} onSignOut={signOut} />
          ) : (
            <Link to="/" className="btn primary">Sign In / Register</Link>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Landing onSignIn={signIn} />} />
        <Route path="/marketplace" element={<Marketplace user={user} />} />
      </Routes>

      <TrackOrderDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <ChatbotFAB user={user} />

      <footer className="footer">© Kwara AI Summit — AgroHub</footer>
    </div>
  );
}