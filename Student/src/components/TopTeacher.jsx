import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext';

export default function TopTeacher() {
    const navigate = useNavigate();
    const { teachers } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='flex flex-col justify-center items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>{t('ourTeacher')}</h1>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {teachers.slice(0, 5).map((teacher, index) => (
                    <div
                        onClick={() => navigate(`/appointment/${teacher.id}`)}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        key={teacher.id}
                    >
                        <img
                            className='bg-blue-50 w-full h-48 object-cover'
                            src={teacher.image}
                            alt={teacher.name}
                        />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <p>{t('Avi')}</p>
                            </div>
                            <p className='font-medium text-base'>{teacher.name}</p>
                            <p className='text-sm text-gray-600'>{teacher.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
