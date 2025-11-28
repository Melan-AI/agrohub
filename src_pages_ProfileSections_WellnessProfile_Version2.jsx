import React, { useState } from "react";

/*
  File dropzone uploads a Medical Report (PDF/Image). The prototype simulates Gemini analysis.
  Integration point: upload to server / storage, then call Gemini to analyze and return "Primary Restriction".
*/
export default function WellnessProfile() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [autofill, setAutofill] = useState(false);

  function onDrop(e) {
    const f = e.target.files[0];
    setFile(f);
  }

  function analyze() {
    if (!file) return alert("Please upload a medical report PDF or image.");
    // Simulated analysis:
    const simulated = "Primary Restriction: Low-Sodium (recommended).";
    setAnalysis(simulated);
  }

  return (
    <div className="wellness">
      <h4>My Wellness Profile</h4>
      <p>Upload your Medical Report (PDF/Image) for health-aware product recommendations.</p>
      <input type="file" accept="application/pdf,image/*" onChange={onDrop} />
      {file && <div className="file-row">{file.name}</div>}
      <div className="actions">
        <button className="btn primary" onClick={analyze}>Analyze (Simulated Gemini)</button>
        <label className="checkbox">
          <input type="checkbox" checked={autofill} onChange={(e)=>setAutofill(e.target.checked)} /> Autofill linked payment accounts
        </label>
      </div>
      {analysis && <div className="analysis glass-card">{analysis}</div>}
    </div>
  );
}