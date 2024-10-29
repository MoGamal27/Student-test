import React, { useState } from 'react'
import logo from '/src/assets/assets_frontend/upload_area.png'
import { useTranslation } from 'react-i18next';
export default function MyProfile() {

  const [userData, setUserData] = useState({
    name:"Ahmed Mohamed",
    image: logo,
    email:'Ahmedmohamed@gmail.com',
    point:0,
  })
  const [isEdit, setIsEdit] = useState(true);
  const { t } = useTranslation();


  return (
    <div className='max-w-lg mx-4 pt-16 sm:mx-[5%] flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded' src={userData.image} alt="" />
        {
          isEdit 
          ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={ e => setUserData(prev => ({...prev,name:e.target.value}))} /> 
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        }

        <hr className='bg-zinc-400 h-[1px] border-none' />
        <div>
          <p  className='text-neutral-500 underline mt-3'>{t('foter8')}</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>{t('email')}</p>
            <p className='text-blue-500'>{userData.email}</p>
          </div>
          <br />
          <div>
            <p>{t('Point')} : {userData.point}</p>
          </div>
        </div>
    

            <div className='mt-10'>
             {
               isEdit
               ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all ' onClick={()=> setIsEdit(false)}>{t('save')} </button>
               : <button className='border border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition-all' onClick={()=> setIsEdit(true)}>{t('edit')}</button>
             }
            </div>
             
    </div>
  )
}
