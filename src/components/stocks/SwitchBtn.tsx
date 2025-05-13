'use client'

import { IStocksParams } from '@/app/actions/getFavorites';
import useFavorite from '@/app/hooks/useFavorite';
import { Switch, styled } from "@mui/material";
import { User } from "@prisma/client";

import React from 'react'

interface ISwitchBtnProps {
  stockId: string;
  currentUser?: User | null;
  stockData: IStocksParams
}

const SwitchBtn = ({ currentUser, stockId, stockData }:ISwitchBtnProps) => {

  const { hasFavorited, toggleFavorite } = useFavorite({
    stockId,
    currentUser,
    stockData
  });
  // console.log('btn_hasFavorited: ', hasFavorited);
  // console.log('btn_stockId: ', stockId);
  console.log('btn_currentUser: ', currentUser);
  // console.log('btn_stockData: ', stockData);

  return (
    <>
      <SwitchIcon 
        onChange={toggleFavorite} 
        defaultChecked={hasFavorited ? true : false}        
      />
    </>
  )
}

export default SwitchBtn


const SwitchIcon = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));