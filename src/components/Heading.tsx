'use client';

import React from 'react'

interface IHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<IHeadingProps> = ({
  title,
  subtitle,
  center
}) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className='text-2xl font-bold'>
        {title}
      </div>
      <div className='mt-2 fnt-light text-neutral-500'>
        {subtitle}
      </div>
    </div>
  );
}

export default Heading;