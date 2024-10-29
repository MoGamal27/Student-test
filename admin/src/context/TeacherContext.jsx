import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"

export const TeacherContext = createContext()

const TeacherContextProvider = (props)=> {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [teacher, setTeacher] = useState([])
    const [bookings, setBookings] = useState([])

    const getTeacherById = async (id) => {
        try {
            const  response  = await axios.get(`${backendUrl}/teachers/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.data.success) {
                setTeacher(response.data.teacher)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getBookingByTeacherId = async (id) => {
        try {
            const  response  = await axios.get(`${backendUrl}/bookings/teacher/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.data.success) {
                setBookings(response.data.data)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
 
    const value = {
     teacher, setTeacher, bookings, setBookings, getBookingByTeacherId, getTeacherById, 
    }

    return (
        <TeacherContext.Provider value={value}>
            {props.children}
        </TeacherContext.Provider>
    )

}

export default TeacherContextProvider