import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Log } from './logger';

export default function URLShortner() {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const updateUrl = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const shortenAll = () => {
    const output = [];

    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortcode } = urls[i];

      if (!/^https?:\/\/.+/.test(longUrl)) {
        alert(`Invalid URL at position ${i + 1}`);
        return;
      }

      const customCode = shortcode || uuidv4().slice(0, 6);
      if (!/^[a-zA-Z0-9]{4,10}$/.test(customCode)) {
        alert(`Invalid shortcode at position ${i + 1}`);
        return;
      }

      if (localStorage.getItem(customCode)) {
        alert(`Shortcode already exists: ${customCode}`);
        return;
      }

      const validMinutes = parseInt(validity) || 30;
      const now = new Date();
      const expiry = new Date(now.getTime() + validMinutes * 60000);

      const record = {
        longUrl,
        createdAt: now.toISOString(),
        expiry: expiry.toISOString(),
        clicks: []
      };

      localStorage.setItem(customCode, JSON.stringify(record));
      output.push({ code: customCode, expiry: expiry.toISOString(), longUrl });

      Log("frontend", "info", "component", `Shortened ${longUrl} to /${customCode}`);
    }

    setResults(output);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Shorten URLs (Max 5)</Typography>

      {urls.map((url, i) => (
        <Box key={i} display="flex" gap={2} mb={2}>
          <TextField
            label="Long URL"
            fullWidth
            value={url.longUrl}
            onChange={(e) => updateUrl(i, 'longUrl', e.target.value)}
          />
          <TextField
            label="Validity (min)"
            value={url.validity}
            onChange={(e) => updateUrl(i, 'validity', e.target.value)}
          />
          <TextField
            label="Custom Shortcode"
            value={url.shortcode}
            onChange={(e) => updateUrl(i, 'shortcode', e.target.value)}
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={addUrl} disabled={urls.length >= 5}>
        + Add
      </Button>
      <Button variant="contained" onClick={shortenAll} sx={{ ml: 2 }}>
        Shorten
      </Button>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((r, i) => (
            <Box key={i} mt={1}>
              <a
                href={`${window.location.origin}/${r.code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${window.location.origin}/${r.code}`}
              </a>
              <Typography variant="body2">
                Expires: {new Date(r.expiry).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
