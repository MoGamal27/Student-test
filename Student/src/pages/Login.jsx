import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const url = state === 'Sign Up' ? 'http://localhost:3000/api/auth/signup' : 'http://localhost:3000/api/auth/signin';
        const payload = state === 'Sign Up' ? {name, email, password} : { email, password };

        try {
            const response = await axios.post(url, payload);
            console.log(response.data); 
            // Store the token
         localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error(error.response.data); // Handle error as needed
        }
    };

    return (
        <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg '>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p> {t('toapp1')} {state === 'Sign Up' ? "sign up" : "login"} {t('toapp')}</p>
                {state === 'Sign Up' && (
                    <div className='w-full'>
                        <p>{t('fullname')}</p>
                        <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
                    </div>
                )}
                <div className='w-full'>
                    <p>{t('email')}</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div className='w-full'>
                    <p>{t('password')}</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
                {state === 'Sign Up' ? (
                    <p>{t('haveaccout')}<span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>{t('Loginhere')}</span></p>
                ) : (
                    <p>{t('Createaccount')}<span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>{t('Loginhere1')}</span></p>
                )}
            </div>
        </form>
    );
}
