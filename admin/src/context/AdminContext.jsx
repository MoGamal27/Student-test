import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token')); // Retrieve token from localStorage
    const [teacher, setTeachers] = useState([]);
    const [bookings, setBookings] = useState([]);
    //const [completeBookings, setCompleteBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllTeacher = async () => {
        try {
          const  response = await axios.get(`${backendUrl}/teachers/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setTeachers(response.data.data)
        }else{
            toast.error(response.data.message)
        } 
      } catch (error) {
          toast.error(error.message)
          };
      };
      
      // get all bookings
      const getAllBookings = async () => {
        try {
          const  response  = await axios.get('http://localhost:3000/api/bookings/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            toast.success(response.data)
            console.log(response.data.data) 
            setBookings(response.data.data);   
        }else{
            toast.error(response.data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
          }

          // delete booking 
          const deleteBooking = async (id) => {
            try {
                const response = await axios.delete(`${backendUrl}/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    // update your local state to remove the deleted booking
                     setBookings(bookings.filter(booking => booking.id !== id));
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An error occurred while deleting the booking');
                }
            }
        };

              // get all students 
              const getAllUsers = async () => {
                try {
                  const  response  = await axios.get(`${backendUrl}/users/`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (response.data.success) {
                    toast.success(response.data.message)
                    setUsers(response.data.data)
                }else{
                    toast.error(response.data.message)
                } 
              } catch (error) {
                toast.error(error.message)
                };
                  }

                  // complete booking
                  const completeBooking = async (id) => {
                    try {
                      const  response  = await axios.put('http://localhost:3000/api/bookings/completed', 
                        {
                          id: id,
                        },
                        {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                     if(response.data.success){
                      toast.success(response.data.message);
                      console.log(response.data.data)
                       // Update local state to reflect the completed booking
                   setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));    
                     }else{
                      toast.error(response.data.message);
                     }
                    } catch (error) {
                      console.error('Error fetching complete booking', error
                        .response || error);
                        toast.error(error.message);
                        }

                  }

                  // get complete booking
                  const getCompleteBooking = async () => {
                    try {
                      const  response  = await axios.get('http://localhost:3000/api/bookings/completed-booking', {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (response.data.success) {
                        toast.success(response.data);
                        console.log(response.data.data)
                        setBookings(response.data.data);
                    }else{
                        toast.error(response.data.message)
                    }
        
                } catch (error) {
                    toast.error(error.message)
                }
                      }


    const value = {
        token, setToken,
        backendUrl, 
        teacher, getAllTeacher, 
        bookings, getAllBookings, 
        deleteBooking, 
        users, getAllUsers, 
        completeBooking, getCompleteBooking
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
