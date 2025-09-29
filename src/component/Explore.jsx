import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";  

import Header from "./Header";
import UserCard from "./UserCard"; 
import { addUser } from './store/userSlice'; 
import { BaseUrl } from '../utils/constants';  

const Explore = () => { 
    const [loading, setLoading] = useState(true); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const user = useSelector((state) => state.user);  

    // Effect for initializing AOS library
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
 
    useEffect(() => {
        const fetchUser = async () => { 
            if (user && Object.keys(user).length > 0) {
                setLoading(false);
                return;
            }

            try { 
                const res = await axios.get(`${BaseUrl}/profile/view`, {
                    withCredentials: true,  
                });
                dispatch(addUser(res.data));  
            } catch (err) {
                console.error("Error fetching user profile:", err); 
                navigate('/explore');
            } finally { 
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch, navigate, user]);  

    return (
        <div>
            <Header /> 
            {/* <UserCard user={user} isLoading={loading} /> */}
            <UserCard/>
        </div>
    );
};

export default Explore;