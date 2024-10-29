import React, { useContext, useEffect, useState } from 'react'
import { TeacherContext } from '../../context/TeacherContext'
import { assets } from '../../assets/assets'
import { jwtDecode } from 'jwt-decode'
import { AppContext } from '../../../../Student/src/context/AppContext'

export default function TeacherAppointement() {
  const { bookings, getBookingByTeacherId } = useContext(TeacherContext)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const decodedToken = jwtDecode(token);
  const teacherId = decodedToken.id ? parseInt(decodedToken.id, 10) : null;
  const {accounts ,transferPoints } =useContext(AppContext);
  const [recipientId  ,  setRecipientId] = useState('');
  const [amount, setAmount] = useState(0);

  const handleTransfer = () => {
    if (amount > 0 && amount <= accounts.myAccount.points) {
        transferPoints('myAccount', recipientId, amount);
    } else {
        alert('Invalid amount');
    }
};



  //const { teacher } = useContext(AdminContext)
  useEffect(() => {
    if (token) {
      getBookingByTeacherId(teacherId)
    }
  }, [token])
  return (
    <div className='bg-white mt-10'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {bookings && bookings.length > 0 ? (
            bookings.map((item, index) => (
              <div className='flex items-center justify-between px-6 py-3 hover:bg-gray-100' key={index}>
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800'>Teacher: {item.teacher.name}</p>
                  <p className='text-gray-800'>Student: {item.student.name}</p>
                  <p className='text-gray-600'>Start: {new Date(item.startTime).toLocaleString()}</p>
                  <p className='text-gray-600'>End: {new Date(item.endTime).toLocaleString()}</p>
                  {/*Add Point*/}
                  <p>Point: {accounts.myAccount.points}</p>
                  <input type="text" value={recipientId} onChange={(e)=> setRecipientId(e.target.value)} />
                  <input type="number" placeholder='Amount' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                  <button onClick={handleTransfer}>Transfer Points</button>
                </div>
              </div>
            ))
          ) : (
            <p className='px-6 py-4 text-gray-500'>No bookings available</p>
          )}
        </div>
      </div>
  )   
}
