import React, { useState, useContext, useEffect } from 'react';
import logo from '/src/assets/assets_frontend/upload_area.png';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

export default function MyProfile() {
    const { user, getUserById } = useContext(UserContext);
    const [studentId, setStudentId] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setStudentId(decodedToken.id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (studentId) {
            getUserById(studentId);
        }
    }, [studentId, getUserById]);

    if (!user) {
        return <div className="max-w-lg mx-4 pt-16 sm:mx-[5%]">Loading...</div>;
    }

    return (
        <div className='max-w-lg mx-4 pt-16 sm:mx-[5%] flex flex-col gap-2 text-sm'>
            <p className='font-medium text-3xl text-neutral-800 mt-4'>{user.name}</p>
            <hr className='bg-zinc-400 h-[1px] border-none' />
            <div>
                <p className='text-neutral-500 underline mt-3'>{t('foter8')}</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>{t('email')}</p>
                    <p className='text-blue-500'>{user.email}</p>
                </div>
                <br />
                <div>
                    <p>{t('Point')} : {user.point}</p>
                </div>
            </div>
        </div>
    );
}
