import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../common/UserNavbar';

const UserLayout = () => (
  <>
    <UserNavbar />
    <Outlet />
  </>
);

export default UserLayout; 