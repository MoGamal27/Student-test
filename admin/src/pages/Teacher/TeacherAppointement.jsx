import React, { useContext, useEffect, useState } from 'react';
import { TeacherContext } from '../../context/TeacherContext';
import { assets } from '../../assets/assets';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function TeacherAppointement() {
    const { bookings, getBookingByTeacherId, addPoints } = useContext(TeacherContext);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const decodedToken = jwtDecode(token);
    const teacherId = decodedToken.id ? parseInt(decodedToken.id, 10) : null;
  const [amount, setAmount] = useState(0);

    const handleTransfer = async (userId, amount) => {
        try {
            await addPoints(userId, amount);
            toast.success('Points transferred successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getBookingByTeacherId(teacherId);
        }
    }, [token]);

    return (
        <div className='bg-white mt-10 rounded-lg shadow-md overflow-hidden'>
            <div className='flex items-center gap-2.5 px-4 py-4 bg-gray-100 border-b'>
                <img src={assets.list_icon} alt="" className='w-6 h-6' />
                <p className='font-semibold text-lg'>Latest Bookings</p>
            </div>

            <div className='pt-4 border-t'>
                {bookings && bookings.length > 0 ? (
                    bookings.map((item, index) => (
                        <div className='flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition duration-200 ease-in-out' key={index}>
                            <div className='flex-1 text-sm'>
                                <p className='text-gray-800 font-medium'>Teacher: {item.teacher.name}</p>
                                <p className='text-gray-800 font-medium'>Student Name: {item.student.name}</p>
                                <p className='text-gray-800 font-medium'>Student email: {item.student.email}</p>
                                <p className='text-gray-600'>Date: {item.slotDate}</p>
                                <p className='text-gray-600'>Time: {item.slotTime}</p>
                                <p className='text-gray-600'>Points: {item.student.point}</p>
                            </div>
                            <button
                                onClick={() => handleTransfer(item.student.id, 10)} 
                                className='bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-dark transition duration-200 ease-in-out'
                            >
                                Add Point +10
                            </button>
                        </div>
                    ))
                ) : (
                    <p className='px-6 py-4 text-gray-500'>No bookings available</p>
                )}
            </div>
        </div>
    );
}