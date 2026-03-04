import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuth } from '@store/authSlice';

interface ProtectPathProps {
  children: React.ReactNode;
}

const ProtectPath = ({ children }: ProtectPathProps) => {
  const isAuth: boolean = useSelector(selectIsAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectPath;
