import React, { useState } from "react";
import EmailVerification from "./EmailVerification";

export default function AuthModal({ onClose, onSignIn }) {
  const [tab, setTab] = useState("sign-in"); // CRITICAL FIX: sign-in immediately shows fields
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    houseAddress: "",
  });
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [pendingRegisterData, setPendingRegisterData] = useState(null);

  function handleSignIn(e) {
    e.preventDefault();
    // simulate sign in
    onSignIn({ name: "Demo User", email: signInForm.email });
    onClose();
  }

  function handleRegister(e) {
    e.preventDefault();
    // start email verification step
    setPendingRegisterData(registerForm);
    setAwaitingVerification(true);
  }

  function onVerified() {
    // finalize account creation
    onSignIn({ name: registerForm.fullName, email: registerForm.email });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal glass-box">
        <div className="tabs">
          <button className={tab === "sign-in" ? "active" : ""} onClick={() => setTab("sign-in")}>Sign In</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
        </div>

        {tab === "sign-in" && (
          <form className="auth-form" onSubmit={handleSignIn}>
            <label>Email</label>
            <input type="email" required value={signInForm.email} onChange={(e)=>setSignInForm({...signInForm,email:e.target.value})} />
            <label>Password</label>
            <input type="password" required value={signInForm.password} onChange={(e)=>setSignInForm({...signInForm,password:e.target.value})} />
            <div className="modal-actions">
              <button type="submit" className="btn primary">Sign In</button>
              <button type="button" className="btn ghost" onClick={onClose}>Close</button>
            </div>
          </form>
        )}

        {tab === "register" && !awaitingVerification && (
          <form className="auth-form" onSubmit={handleRegister}>
            <label>Full Name</label>
            <input type="text" required value={registerForm.fullName} onChange={(e)=>setRegisterForm({...registerForm,fullName:e.target.value})} />
            <label>Email</label>
            <input type="email" required value={registerForm.email} onChange={(e)=>setRegisterForm({...registerForm,email:e.target.value})} />
            <label>Password</label>
            <input type="password" required value={registerForm.password} onChange={(e)=>setRegisterForm({...registerForm,password:e.target.value})} />
            <label>Full House Address (for logistics)</label>
            <textarea required value={registerForm.houseAddress} onChange={(e)=>setRegisterForm({...registerForm,houseAddress:e.target.value})}></textarea>
            <div className="modal-actions">
              <button type="submit" className="btn primary">Send Verification Code</button>
              <button type="button" className="btn ghost" onClick={onClose}>Close</button>
            </div>
          </form>
        )}

        {awaitingVerification && (
          <EmailVerification email={pendingRegisterData?.email} onVerified={onVerified} onCancel={() => { setAwaitingVerification(false); setPendingRegisterData(null); }} />
        )}
      </div>
    </div>
  );
}