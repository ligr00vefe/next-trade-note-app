'use client';

import React from 'react'
import styles from './Ui.module.scss'

interface IContainerProps {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
};

const Container: React.FC<IContainerProps> = ({
  children,
  backgroundImage,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
}: IContainerProps) => {
  const style: React.CSSProperties = {};
  if (backgroundImage) {
    style.backgroundImage = `url(${backgroundImage})`;
    style.backgroundSize = backgroundSize;
    style.backgroundPosition = backgroundPosition;
    style.backgroundRepeat = backgroundRepeat;
  }
  return (
    <div
      className={styles.container}
      style={style}
    >
      {children}
    </div>
  )
}

export default Container