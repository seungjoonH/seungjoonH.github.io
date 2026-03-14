import React from 'react';
import './row.css';

export function Row({ children }) {
  return (
    <div className="row-container">
      {React.Children.map(children, (child, index) => (
        <div className="row-item" key={index}>
          {child}
        </div>
      ))}
    </div>
  );
}