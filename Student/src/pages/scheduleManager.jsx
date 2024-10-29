import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function ScheduleManager() {
    const [teacherId, setTeacherId] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const { t } = useTranslation();


    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'teacher') {
                setTeacherId(decodedToken.id);
                fetchSchedule(decodedToken.id);
            }
        }
    }, [token]);

    const fetchSchedule = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/schedules/${id}`);
            setAvailableSlots(response.data.availableTimes);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        }
    };

    const handleAddSlot = async () => {
        if (!newSlot) return;

        try {
            const updatedSlots = [...availableSlots, newSlot];
            await axios.put(`http://localhost:3000/api/schedules/${teacherId}`, {
                availableTimes: updatedSlots
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableSlots(updatedSlots);
            setNewSlot('');
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    const handleRemoveSlot = async (slotToRemove) => {
        try {
            const updatedSlots = availableSlots.filter(slot => slot !== slotToRemove);
            await axios.put(`http://localhost:3000/api/schedules/${teacherId}`, {
                availableTimes: updatedSlots
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableSlots(updatedSlots);
        } catch (error) {
            console.error("Error removing slot:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('Schedule')}</h1>
            
            <div className="mb-4">
                <input
                    type="datetime-local"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button 
                    onClick={handleAddSlot}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {t('AddSlot')}
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">{t('AvailableSlots')}</h2>
            <ul className="space-y-2">
                {availableSlots.map((slot, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{formatDate(slot)}</span>
                        <button 
                            onClick={() => handleRemoveSlot(slot)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            {t('Remove')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}