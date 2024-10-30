/*import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Stripe from 'stripe';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [point, setPoint] = useState(0);
    
    const [accounts, setAccounts] = useState({
      myAccount: { id: '1', points: 100 },
      anotherAccount: { id: '2', points: 50 },
  });

  const transferPoints = (senderId, receiverId, amount) => {
    setAccounts((prev) => {
        const senderPoints = prev[senderId].points - amount;
        const receiverPoints = prev[receiverId].points + amount;
        return {
            ...prev,
            [senderId]: { ...prev[senderId], points: senderPoints },
            [receiverId]: { ...prev[receiverId], points: receiverPoints },
        };
    });
};

////////////
    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
    
        //if (!Stripe || !elements) return;
    
        const response = await axios.post('http://localhost:3000/api/payment/create-payment-intent', {
          payment_method: '4242 4242 4242 4242',
          amount: 1000, // Adjust as necessary

      });
      console.log(response.data);
      
        const { clientSecret } = await response.json();
    
        const payload = await Stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
    
        if (payload.error) {
          setError(`Payment failed: ${payload.error.message}`);
          setProcessing(false);
        } else {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
        }
      };
    

/////////////////////

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/teachers'); // Adjust the URL as necessary
                setTeachers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <AppContext.Provider value={{ teachers , handleSubmit ,accounts , transferPoints}}>
            {children}
        </AppContext.Provider>
    );
};*/
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/teachers'); // Adjust the URL as necessary
                setTeachers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <AppContext.Provider value={{ teachers }}>
            {children}
        </AppContext.Provider>
    );
};