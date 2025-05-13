'use client';

import React from 'react'
import styles from './Ui.module.scss'

interface IContainerProps {
  children: React.ReactNode
};

const Container: React.FC<IContainerProps> = ({ children }: IContainerProps) => {
  return (
    <div
      className={styles.container}
    >
      {children}
    </div>
  )
}

export default Container