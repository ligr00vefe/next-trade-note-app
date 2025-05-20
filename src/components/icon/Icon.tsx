import Image from 'next/image';
import React from 'react';

import letterPath from './images/shape_letter.svg';
import lockPath from './images/shape_lock.svg';
import showPath from './images/shape_show.svg';
import hidePath from './images/shape_hide.svg';

interface IIconProps {
    type: 'letter' | 'lock' | 'show' | 'hide';
    alt?: string;
    width?: number; 
    [x: string]: any;
}

const Icon = ({ type, alt = '', width=35, ...restProps }: IIconProps) => {
    let src = '';
    switch (type) {
        case 'letter':
            src = letterPath;
            break;
        case 'lock':
            src = lockPath;
            break;
        case 'show':
            src = showPath;
            break;
        case 'hide':
            src = hidePath;
            break;
        default:
            throw new Error('지원하는 아이콘 타입이 존재하지 않습니다.');
    }
    return <Image src={src} alt={alt} {...restProps} width={width} />;
};

export default Icon;
