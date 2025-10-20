'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCart } from '@/features/itemSlice';

export const useCartSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);
};