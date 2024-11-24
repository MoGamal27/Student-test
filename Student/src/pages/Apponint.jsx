import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import info from '../assets/assets_frontend/info_icon.svg';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function Appointment() {
  const { t, i18n } = useTranslation();
  const { teacherId } = useParams();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const navigate = useNavigate();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fetch teacher info
  const fetchTeacherInfo = async () => {
    try {
      const response = await axios.get(`https://booking-lessons-production.up.railway.app/api/teachers/${teacherId}`);
      const teacherData = response.data.data;

      // Translate teacher name and bio using `t`
      setTeacherInfo({
        ...teacherData,
        name: t(`teachers.${teacherId}.name`),
        bio: t(`teachers.${teacherId}.bio`),
      });
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  // Fetch booked slots for the selected date
  const fetchBookedSlots = async (date) => {
    try {
      const formattedDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      const response = await axios.get(
        `https://booking-lessons-production.up.railway.app/api/bookings/booked-slots`,
        {
          params: { 
            teacherId: teacherId,
            slotDate: formattedDate,
          },
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
          minute: '2-digit',
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          isBooked: bookedSlotsForDate.includes(formattedTime),
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(timeSlots);
    }
    setAvailableSlots(slots);
  };

  // Handle time slot selection
  const handleTimeSlotClick = (slot, dateIndex) => {
    if (!slot.isBooked) {
      const slotKey = `${dateIndex}_${slot.time}`;
      const alreadySelected = selectedSlots.some((selectedSlot) => selectedSlot.key === slotKey);

      if (alreadySelected) {
        // Remove the selected slot
        setSelectedSlots((prev) => prev.filter((s) => s.key !== slotKey));
      } else {
        // Add the selected slot
        setSelectedSlots((prev) => [
          ...prev,
          { key: slotKey, dateIndex, time: slot.time, date: availableSlots[dateIndex][0].datetime },
        ]);
      }
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

      const bookingRequests = selectedSlots.map((slot) => {
        const slotDate = `${slot.date.getDate()}_${slot.date.getMonth() + 1}_${slot.date.getFullYear()}`;
        return axios.post(
          'https://booking-lessons-production.up.railway.app/api/bookings/create',
          { studentId, teacherId, slotDate, slotTime: slot.time },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      });

      const responses = await Promise.all(bookingRequests);

      if (responses.every((res) => res.data.success)) {
        toast.success('Appointments booked successfully');
        navigate('/my-appointment');
      } else {
        toast.error('Some appointments could not be booked');
      }
    } catch (error) {
      toast.error('Error booking appointment: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (index) => {
    setSlotIndex(index);
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, [teacherId, i18n.language]);

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

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0">
          <p className="text-2xl font-semibold text-gray-900">{teacherInfo.name}</p>
          <p className="text-sm text-gray-500 mt-1">{teacherInfo.bio}</p>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{teacherInfo.fees}$</span>
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
              onClick={() => handleTimeSlotClick(slot, slotIndex)}
              className={`text-sm px-5 py-2 rounded-full ${
                selectedSlots.some(
                  (s) => s.key === `${slotIndex}_${slot.time}`
                )
                  ? 'bg-primary text-white'
                  : slot.isBooked
                  ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                  : 'border border-gray-200 cursor-pointer'
              }`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          disabled={selectedSlots.length === 0 || loading}
          className="bg-primary text-white px-14 py-3 rounded-full mt-4 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}




