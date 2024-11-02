import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function MyAppointment() {
  const { teachers } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const { t } = useTranslation();
  const [showPayPal, setShowPayPal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

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

  const makePayment = (booking) => {
    setCurrentBooking(booking);
    setShowPayPal(true);
  };

  const handleApprove = (orderId) => {
    setShowPayPal(false);
    alert("Payment successful for order " + orderId);
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
                  <p className='text-xs mt-1'>
                    <span className='text-sm text-neutral-700 font-medium'>{t('Date')}</span>
                    {booking.slotDate} - {booking.slotTime}
                  </p>
                </div>
                <div className='flex flex-col gap-2 justify-end'>
                  <button
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
                    onClick={() => makePayment(booking)}
                  >
                    {t('Pay')}
                  </button>

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
      
      {showPayPal && (
        <PayPalScriptProvider options={{ "client-id": "AfhUouOs3xx6CHsWXPhX1K9dUfk0231k2U-8Nra2NkkTRdBdyIkOZVHkbnqEf-E54oMjXlfHTBe8Ddl6" }}>
          <div className="paypal-container">
            <PayPalButtons
              createOrder={async (data, actions) => {
                const response = await axios.post('http://localhost:3000/api/payment/create-order', {
                  bookings: bookings.map(booking => booking.id),
                });
                return response.data.orderID;
              }}
              onApprove={(data, actions) => {
                handleApprove(data.orderID);
              }}
              onError={(err) => {
                console.error("PayPal Checkout onError", err);
                alert("Payment failed. Please try again.");
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}
    </div>
  );
}

  
