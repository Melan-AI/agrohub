import React, { useState, useEffect } from "react";

/*
  EmailVerification simulates sending a code and verifying it.
  Integration point: replace sendCode / verifyCode with backend email service.
*/
export default function EmailVerification({ email, onVerified, onCancel }) {
  const [codeSent, setCodeSent] = useState(false);
  const [entered, setEntered] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // simulate sending code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setCodeSent(true);
    console.info(`Simulated verification code for ${email}: ${code}`);
  }, [email]);

  function verify(e) {
    e.preventDefault();
    setAttempts(a => a + 1);
    if (entered === sentCode) {
      onVerified();
    } else {
      alert("Incorrect code. (Check console for the simulated code in this prototype.)");
    }
  }

  return (
    <div className="verification">
      <h3>Email Verification</h3>
      <p>A verification code was sent to <strong>{email}</strong>. (Prototype prints the code in browser console.)</p>
      <form onSubmit={verify}>
        <input type="text" placeholder="6-digit code" value={entered} onChange={(e)=>setEntered(e.target.value)} required />
        <div className="modal-actions">
          <button className="btn primary" type="submit">Verify & Create Account</button>
          <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}