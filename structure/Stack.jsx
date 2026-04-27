import { Children } from 'react';
import './stack.css';

export function Stack({ children, height }) {
  return (
    <div className="stack-container" style={{ '--stack-height': height }}>
      {Children.map(children, (child, index) => (
        <div className="stack-item" style={{ '--stack-item-z-index': index }}>
          {child}
        </div>
      ))}
    </div>
  );
}
