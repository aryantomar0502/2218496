import React, { useState } from "react";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [validity, setValidity] = useState(60);
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);

  const handleShorten = () => {
    // Calculate expiry time
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(validity));

    // Generate short URL (localhost)
    const shortUrl = `http://localhost:3000/${shortcode}`;

    // Save result
    setResult({
      original: longUrl,
      short: shortUrl,
      expires: expiryDate.toString(),
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>URL Shortener</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Long URL</label>
        <br />
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ width: "400px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Validity (mins)</label>
        <br />
        <input
          type="number"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Custom Shortcode</label>
        <br />
        <input
          type="text"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
      </div>
      <button onClick={handleShorten}>SHORTEN</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h4>Results:</h4>
          <p>Original: {result.original}</p>
          <p>Short URL: <a href={result.short}>{result.short}</a></p>
          <p>Expires: {result.expires}</p>
        </div>
      )}
    </div>
  );
}

export default App;
