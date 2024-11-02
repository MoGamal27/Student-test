/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import info from "/src/assets/assets_frontend/info_icon.svg";
import { createBooking } from '../api/apiBooking';
import { jwtDecode } from 'jwt-decode';

export default function Appointment() {
    const { teacherId } = useParams();
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const daysOfweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const fetchTeacherInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/teachers/${teacherId}`);
            setTeacherInfo(response.data);
        } catch (error) {
            console.error("Error fetching teacher data:", error);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/schedules/?teacherId=${teacherId}`);
            const scheduleData = response.data[0];
            if (scheduleData && scheduleData.availableTimes) {
                const parsedSlots = JSON.parse(scheduleData.availableTimes);
                setAvailableSlots(parsedSlots);
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
    };

    const handleBooking = async () => {
        if (!slotTime) {
            alert("Please select a time slot.");
            return;
        }

        const selectedDate = new Date(slotTime);
        const startTime = new Date(selectedDate);
        const endTime = new Date(selectedDate);
        endTime.setMinutes(endTime.getMinutes() + 30);

        try {
            const decodedToken = jwtDecode(token);
            const studentId = decodedToken.id ? parseInt(decodedToken.id, 10) : null;

            if (!studentId) {
                alert('Student ID is missing. Please log in again.');
                return;
            }

            const booking = await createBooking(token, teacherId, startTime.toISOString(), endTime.toISOString(), studentId);
            console.log('Booking created:', booking);
            alert('Booking successful!');
        } catch (error) {
            console.error(error.message);
            alert('Error creating booking: ' + error.message);
        }
    };

    useEffect(() => {
        fetchTeacherInfo();
        fetchAvailableSlots();
    }, [teacherId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${daysOfweek[date.getDay()]}, ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return teacherInfo && (
        <div>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={teacherInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>{teacherInfo.name}</p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <video className='w-320 h-240' src={teacherInfo.video} controls></video>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={info} alt="" /></p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{teacherInfo.bio}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{teacherInfo.fee}</span>
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Available Slots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableSlots.map((slot, index) => (
                        <button
                            key={index}
                            className={`p-2 rounded ${slotTime === slot ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setSlotTime(slot)}
                        >
                            {formatDate(slot)}
                        </button>
                    ))}
                </div>
                {slotTime && (
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleBooking}
                    >
                        Book Appointment
                    </button>
                )}
            </div>
        </div>
    );
}*/


import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import info from '../assets/assets_frontend/info_icon.svg';
import { jwtDecode } from 'jwt-decode';


export default function Appointment() {
  const { teacherId } = useParams();
    const [teacherInfo, setTeacherInfo] = useState(null);
  const navigate = useNavigate();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

   // Fetch teacher info
   const fetchTeacherInfo = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/teachers/${teacherId}`);
        setTeacherInfo(response.data.data);
    } catch (error) {
        console.error("Error fetching teacher data:", error);
    }
};

    // Fetch booked slots for the selected date
    const fetchBookedSlots = async (date) => {
        try {
          const formattedDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
          const response = await axios.get(
            `http://localhost:3000/api/bookings/booked-slots`,
            {
              params: { 
                teacherId: teacherId,
                slotDate: formattedDate
              }
            }
          );
          
          if (response.data.success) {
            return response.data.bookedSlots;
          }
          return [];
        } catch (error) {
          console.error('Error fetching booked slots:', error);
          return [];
        }
      };
    
      // Generate available time slots
      const generateAvailableSlots = async () => {
        const slots = [];
        let today = new Date();
    
        for (let i = 0; i < 7; i++) {
          let currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);
    
          let endTime = new Date(currentDate);
          endTime.setHours(21, 0, 0, 0);
    
          if (today.getDate() === currentDate.getDate()) {
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
          } else {
            currentDate.setHours(10);
            currentDate.setMinutes(0);
          }
    
          // Fetch booked slots for this date
          const bookedSlotsForDate = await fetchBookedSlots(currentDate);
    
          let timeSlots = [];
          while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            
            timeSlots.push({
              datetime: new Date(currentDate),
              time: formattedTime,
              isBooked: bookedSlotsForDate.includes(formattedTime)
            });
    
            currentDate.setMinutes(currentDate.getMinutes() + 30);
          }
          slots.push(timeSlots);
        }
        setAvailableSlots(slots);
      };
    
      // Handle time slot selection
      const handleTimeSlotClick = (slot) => {
        if (!slot.isBooked) {
          setSlotTime(slot.time);
        }
      };

  // Book appointment
  const bookAppointment = async () => {
    const decodedToken = jwtDecode(token);
    const studentId = decodedToken.id ? parseInt(decodedToken.id, 10) : null;

        if (!studentId) {
         toast.warn('Please login to book an appointment');
      return navigate('/login');
            }

    try {
      setLoading(true);
      const date = availableSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      const  response  = await axios.post(
        'http://localhost:3000/api/bookings/create',
        { studentId, teacherId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/my-apponint');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error booking appointment' + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
    // Handle date selection
    const handleDateSelect = async (index) => {
        setSlotIndex(index);
        setSlotTime(''); // Clear selected time when changing date
      };

  useEffect(() => {
    fetchTeacherInfo();
  }, [teacherId]);

  useEffect(() => {
    if (teacherInfo) {
      generateAvailableSlots();
    }
  }, [teacherInfo]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!teacherInfo) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img 
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={teacherInfo.image}
            alt={teacherInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            {teacherInfo.name}
          </p>
         
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={info} alt="info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {teacherInfo.bio}
            </p>
          </div>
          <div className="sm:py-5 md:flex-col">
        <video  width={600} height={400} src={teacherInfo.video} controls autoPlay loop muted></video>            
        </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{teacherInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full mt-4">
          {availableSlots.map((slots, index) => (
            <div
              key={index}
              onClick={() => handleDateSelect(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
              }`}
            >
              <p>{slots[0] && daysOfWeek[slots[0].datetime.getDay()]}</p>
              <p>{slots[0] && slots[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {availableSlots[slotIndex]?.map((slot, index) => (
            <p
              key={index}
              onClick={() => handleTimeSlotClick(slot)}
              className={`
                text-sm font-light flex-shrink-0 px-5 py-2 rounded-full 
                ${slot.isBooked 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' 
                  : slot.time === slotTime
                    ? 'bg-primary text-white cursor-pointer'
                    : 'text-gray-800 border border-gray-200 cursor-pointer hover:bg-gray-50'
                }
              `}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          disabled={!slotTime || loading}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
      <div className="flex flex-col justify-center mt-4 pb-4 items-center">
      </div>
    </div>
  );
}
