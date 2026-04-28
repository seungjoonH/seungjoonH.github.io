import { Fragment, useEffect, useState } from 'react';
import styles from './title.module.css';
import { buildCls } from '../../../utils/cssUtil';

export function Title({ text }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\\n');
  const titleContainerCls = buildCls(styles.titleContainer, show && styles.fadeIn);

  return (
    <div className={titleContainerCls}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  );
}