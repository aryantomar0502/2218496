import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { customLogger } from '../utils/logger';

const RedirectHandler = ({ database, setDatabase }) => {
  const { shortcode } = useParams();

  useEffect(() => {
    const idx = database.findIndex((d) => d.shortcode === shortcode);
    if (idx !== -1) {
      const entry = database[idx];
      const now = new Date();
      const expiry = new Date(new Date(entry.createdAt).getTime() + entry.validity * 60000);

      if (now < expiry) {
        entry.clicks.push({
          timestamp: now.toISOString(),
          source: document.referrer || 'Direct',
          location: 'IN', // Simulated
        });

        const updated = [...database];
        updated[idx] = entry;
        setDatabase(updated);

        customLogger('info', `Redirected via shortcode ${shortcode}`);
        window.location.href = entry.longUrl;
      } else {
        alert('This link has expired.');
        customLogger('warn', `Expired shortcode: ${shortcode}`);
      }
    } else {
      alert('Invalid shortcode.');
      customLogger('error', `Invalid shortcode access: ${shortcode}`);
    }
  }, [shortcode, database, setDatabase]);

  return null;
};

export default RedirectHandler;
