import React, { useEffect, useState } from 'react';
import styles from './title.module.css';
import { buildCls } from '../../utils/cssUtil';

export function Title({ text }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\\n');

  return (
    <div className={buildCls(styles.titleContainer, show && styles.fadeIn)}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}