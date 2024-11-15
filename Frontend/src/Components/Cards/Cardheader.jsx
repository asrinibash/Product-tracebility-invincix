// CardHeader.jsx
import React from 'react';

const CardHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default CardHeader;
