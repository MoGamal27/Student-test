import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AppContext } from '../context/AppContext';
import {useStripe} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';



export default function MyAppointment() {
  const { teachers } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const stripe = useStripe();
  const {handleSubmit} = useContext(AppContext);
  const { t } = useTranslation();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setStudentId(decodedToken.id); // Assuming the token contains the student's ID
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchBookings();
    }
  }, [studentId]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bookings/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>{t('MyAppointment')}</p>
      <div>
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const teacher = teachers.find(teacher => teacher.id === booking.teacherId);
            return (
              <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={booking.id}>
                <div>
                  <img className='w-32 bg-indigo-50' src={teacher?.image} alt={teacher?.name} />
                </div>
                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 font-medium'>{teacher?.name}</p>
                  <p>{teacher?.bio}</p>
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>{t('Date')}</span>
                    {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>
                <div></div>
                {/*Payemnt*/}
                <div className='flex flex-col gap-2 justify-end'>
                <form onSubmit={handleSubmit}>
                <button type="submit" disabled={!stripe || processing || succeeded}>{processing ? 'Processing...' : 'Pay'}
                </button>{error && <div>{error}</div>}{succeeded && <div>{t('Payonline')}!</div>}
                </form>
                  <button
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'
                    onClick={() => handleCancelAppointment(booking.id)}
                  >
                    {t('Cancel')}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>{t('No appointments found')}.</p>
        )}
      </div>
    </div>
  );
}

  
