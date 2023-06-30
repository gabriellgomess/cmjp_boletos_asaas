import React, {useContext} from 'react'
import {MyContext} from '../contexts/MyContext'
import {Link, useNavigate} from 'react-router-dom'

// Importing the Login & Register Componet
import Login from './Login'
import Register from './Register'

function Home(){

    const {rootState,logoutUser} = useContext(MyContext);
    const {isAuth,theUser,showLogin} = rootState;

    // Hook from react-router-dom
    const navigate = useNavigate();

    // If user Logged in
    if(isAuth)
    {
        // Navigate to Dashboard
        navigate(`${process.env.REACT_APP_PATH}/dashboard`);

        return null; // Return null or <></> while waiting for the navigate to complete
    }
    // Showing Login Or Register Page According to the condition
    else if(showLogin){
        return <Login/>;
    }
    else{
        return <Register/>;
    }
}

export default Home;
