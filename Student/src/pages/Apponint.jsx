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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import info from "/src/assets/assets_frontend/info_icon.svg";
import { createBooking } from '../api/apiBooking';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function Appointment() {
    const { teacherId } = useParams();
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [slotTime, setSlotTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const { t } = useTranslation();


    const daysOfweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Fetch teacher info
    const fetchTeacherInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/teachers/${teacherId}`);
            setTeacherInfo(response.data);
        } catch (error) {
            console.error("Error fetching teacher data:", error);
        }
    };

    // Fetch available slots and booked slots
    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/schedules/schedule/${teacherId}`);
            const scheduleData = response.data[0];
            if (scheduleData && scheduleData.availableTimes) {
                setAvailableSlots(scheduleData.availableTimes);
            }

            // Fetch booked slots
            const bookedResponse = await axios.get(`http://localhost:3000/api/bookings/teacher/${teacherId}`);
            const bookedSlots = bookedResponse.data.data.map(booking => ({
                startTime: new Date(booking.startTime).toISOString(),
                endTime: new Date(booking.endTime).toISOString(),
            }));

            // Store booked slots in state
            setBookedSlots(bookedSlots);
        } catch (error) {
            console.error("Error fetching available or booked slots:", error);
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

    const isSlotBooked = (slot) => {
        return bookedSlots.some(bookedSlot => {
            const bookedStartTime = new Date(bookedSlot.startTime);
            const bookedEndTime = new Date(bookedSlot.endTime);
            const slotTime = new Date(slot);

            return slotTime >= bookedStartTime && slotTime < bookedEndTime;
        });
    };

    return teacherInfo && (
        <div>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={teacherInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>{teacherInfo.name}</p>
                    <div className='sm:py-5 md:flex-col'>
                        <video  width={600} height={400} src={teacherInfo.video} controls autoPlay loop muted></video>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'> {t('about5')} <img src={info} alt="" /></p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{teacherInfo.bio}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                    {t('fee')}   <span className='text-gray-600'>{teacherInfo.fees}</span>
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('slot')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableSlots.map((slot, index) => (
                        <button
                            key={index}
                            className={`p-2 rounded ${slotTime === slot ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isSlotBooked(slot) ? 'bg-red-400 text-white cursor-not-allowed' : ''}`}
                            onClick={() => !isSlotBooked(slot) && setSlotTime(slot)}
                            disabled={isSlotBooked(slot)}
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
                       {t('Book')}
                    </button>
                )}
            </div>
        </div>
    );
}

