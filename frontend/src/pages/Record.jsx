import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Record() {
  const location = useLocation();
  const { cardName } = location.state;

  return (
    <div>
      <p>You clicked on the card: {cardName}</p>
    </div>
  );
}

