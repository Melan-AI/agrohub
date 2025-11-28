import React, { useState } from "react";
import AuthModal from "../components/AuthModal";

export default function Landing({ onSignIn }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <main>
      <section className="hero glass-vision">
        <div className="hero-inner">
          <h1>AgroHub — Empowering Agroexplorers & sellers</h1>
          <p>Reducing waste • Improving seller income • Promoting public health</p>
          <button className="btn large" onClick={() => setAuthOpen(true)}>Start</button>
        </div>
      </section>

      <section className="mission glass-panel">
        <h2>Mission & Trust</h2>
        <div className="impact-cards">
          <div className="card">Food waste reduction — measurable impact</div>
          <div className="card">Seller income increase — fair prices</div>
          <div className="card">Public health improvement — safe produce</div>
        </div>
      </section>

      <section className="analytics glass-panel">
        <h2>Analytics & Validation</h2>
        <div className="charts">
          <div className="chart">Top Products (mock)</div>
          <div className="chart">Health Filter Usage (mock)</div>
          <div className="chart">Escrow Value Secured (mock)</div>
        </div>
      </section>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSignIn={onSignIn} />}
    </main>
  );
}