import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import imgChat from '../assets/img/chat.png'
import { Toaster } from 'react-hot-toast';
import NotificationComponent from '../components/notifications/NotificationComponent';

const Layout = () => {

  //scroll al inicio de la pagina

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <NotificationComponent />

      <Header />
      <div className='fixed bottom-9 right-4 '>
        <img src={imgChat} alt="" width={35} height={35} />
      </div>
      <div className='section animate__animated animate__fadeIn bg-gray-100'>
      </div>
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout