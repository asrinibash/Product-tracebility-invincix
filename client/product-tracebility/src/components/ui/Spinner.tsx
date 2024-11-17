// components/ui/spinner.jsx
import React from 'react';

const Spinner = ({ className = "w-6 h-6 text-white animate-spin" }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4.93 12.93C4.34 13.54 4 14.37 4 15c0 .63.34 1.46.93 1.57l2.9 0 0 5.18 1.57 0c.28 0 .53-.18.66-.44l5.74-11.48c.2-.39-.09-.85-.53-.85H6.86c-.39 0-.74.2-.9.54L4.93 12.93z"
      />
    </svg>
  );
};

export default Spinner;
