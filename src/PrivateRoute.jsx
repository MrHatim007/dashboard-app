import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setAuthenticated(!!storedUser);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return authenticated ? children : <Navigate to="/login" />;
}