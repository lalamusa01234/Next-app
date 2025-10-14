'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/features/userSlice';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Common = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    const authenticated_paths = ['/dashboard', '/orders', '/profile', '/wishlist', '/admin'];
    const isPathAuthenticated = authenticated_paths.some(path => pathname.startsWith(path));

    console.log('isPathAuthenticated', isPathAuthenticated);
    if (!token && isPathAuthenticated) {
      console.log('No token found, redirecting to login');
      setLoading(false);
      navigate.push('/');
      return;
    }

    if(!token) return

    axios
      .get('http://localhost:3000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Profile data:', res.data);
        dispatch(setUser(res.data));
        setLoading(false); // Set loading to false after fetching
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        dispatch(setUser(null)); // Clear Redux user
        navigate.push('/404');
        setLoading(false);
      });
  }, [dispatch, navigate, pathname]);

  return <div>{/* Optionally render a loading spinner while loading */}</div>;
};

export default Common;