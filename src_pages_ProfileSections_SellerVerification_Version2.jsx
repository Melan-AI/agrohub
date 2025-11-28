import React, { useState } from "react";

/*
  Seller Verification Portal with KW-ADP-2025-XXXX validation.
*/
export default function SellerVerification() {
  const [code, setCode] = useState("");
  const [valid, setValid] = useState(null);

  function validate(e) {
    e.preventDefault();
    const regex = /^KW-ADP-2025-\d{4}$/;
    const ok = regex.test(code.trim());
    setValid(ok);
    if (!ok) alert("Invalid Kwara ADP Registration Code. Correct format: KW-ADP-2025-XXXX (digits).");
    else alert("Seller verification code accepted. You may proceed to list products.");
  }

  return (
    <div className="seller-verification">
      <h4>Seller Verification Portal</h4>
      <p>Enter your Kwara ADP Registration Code (required before listing products).</p>
      <form onSubmit={validate}>
        <input placeholder="KW-ADP-2025-1234" value={code} onChange={(e)=>setCode(e.target.value)} required />
        <div className="actions">
          <button className="btn primary" type="submit">Validate</button>
        </div>
      </form>
      {valid === true && <div className="success">Code valid — seller access granted (prototype).</div>}
      {valid === false && <div className="error">Invalid format.</div>}
    </div>
  );
}