import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import dropdown from "/src/assets/assets_frontend/dropdown_icon.svg";
import { assets } from '../assets/assets_frontend/assets';
import { UserContext } from '../context/UserContext'; // Import the UserContext
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import LanguageSwitcher from './LnaguageSwitcher';


export default function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Access user context
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);
    const { t } = useTranslation();

    
      

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Use the token from local storage
                    },
                });
                const data = await response.json();
                setUser(data); // Set user data in context
            } catch (err) {
                console.error('Failed to fetch user data:', err);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, setUser]);

    
    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
     
            <NavLink to={'/'}><h2 className='cursor-pointer font-semibold text-2xl'>{t('Arabe')}</h2></NavLink>
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to={'/'}>
                    <li className='py-1'>{t('Home')}</li>
                    <hr className='border-none outline-none h-0.5 bg-Black w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/about'}>
                    <li className='py-1'>{t('aboutus')}</li>
                    <hr className='border-none outline-none h-0.5 bg-Black w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/contact'}>
                    <li className='py-1'>{t('Contact')}</li>
                    <hr className='border-none outline-none h-0.5 bg-Black w-3/5 m-auto hidden' />
                </NavLink>
                
             <a target='_blank' href='http://localhost:5175/'>
              <li className='py-1 border text-xs border-primary p-1 rounded-full'>Admin Panal</li>
              <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </a>
            </ul>
            
            <div className='flex items-center gap-4'>     
              <LanguageSwitcher/>
                {
                    token ?
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <span className='font-medium'>{user?.name}</span> {/* Display user name */}
                            <img className='w-2.5' src={dropdown} alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-apponint')} className='hover:text-black cursor-pointer'>{t('MyAppointment')}</p>
                                    <p onClick={()=> navigate('my-profile')} className='hover:text-black cursor-pointer'>{t('My Profile')}</p>
                                    <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>{t('Logout')}</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
                         }
                
                       <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
                      <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                     <div className='flex items-center justify-end px-5 py-6'>
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-start gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to={'/'}><p className='px-4 py-2 rounded inline-block'>{t('Home')}</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to={'/about'}><p className='px-4 py-2 rounded inline-block'>{t('aboutus')}</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to={'/contact'}><p className='px-4 py-2 rounded inline-block'>{t('Contact')}</p></NavLink>
                        <a target='_blank' href='http://localhost:5175/'>
                        <li className='py-1 border text-xs border-primary p-1 rounded-full'>Admin Panal</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                        </a>
                        <LanguageSwitcher/>

                    </ul>
                </div>
            </div>
        </div>
    );
}
