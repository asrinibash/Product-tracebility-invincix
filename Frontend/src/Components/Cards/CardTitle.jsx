// CardTitle.jsx
import React from 'react';

const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

export default CardTitle;
