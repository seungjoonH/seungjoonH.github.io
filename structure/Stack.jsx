import React from 'react';
import './stack.css';

export function Stack({ children, height }) {
  return (
    <div className="stack-container" style={{ height: height }}>
      {React.Children.map(children, (child, index) => (
        <div className="stack-item" style={{ zIndex: index }}>
          {child}
        </div>
      ))}
    </div>
  );
}