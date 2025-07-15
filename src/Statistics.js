import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function Statistics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const list = [];
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      try {
        const value = JSON.parse(localStorage.getItem(key));
        if (value?.longUrl) {
          list.push({ code: key, ...value });
        }
      } catch {}
    }
    setData(list);
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5">URL Statistics</Typography>
      {data.map((entry, i) => (
        <Box key={i} mt={2}>
          <Typography><strong>Shortcode:</strong> {entry.code}</Typography>
          <Typography><strong>URL:</strong> {entry.longUrl}</Typography>
          <Typography><strong>Created:</strong> {new Date(entry.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Expires:</strong> {new Date(entry.expiry).toLocaleString()}</Typography>
          <Typography><strong>Clicks:</strong> {entry.clicks.length}</Typography>
          {entry.clicks.map((click, idx) => (
            <Typography key={idx} variant="body2">• {click.timestamp} from {click.source}</Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
}