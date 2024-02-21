import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const SignIn = () => {
    useEffect(()=>{
        Cookies.set('username', '', {expires: 7})
        // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log(Cookies.get('username'))
    }, []);
  const [user,setUser] = useState({
    userName:"",
    password:""
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser((prev)=>({...prev,[e.target.name]: e.target.value}));
  };
  const handleClick = async e => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3306/SignIn", user)
      const count = res.data[0].count
      var errMess = document.getElementById("s")
      if (count == 1) {
        errMess.innerText = "SUCCESS!"
        errMess.style.color = "green"
        Cookies.set('username', user.userName, {expires: 7})
        console.log(Cookies.get('username'))
        //document.cookie = "username="+user.userName+"; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //console.log(document.cookie)
        navigate("/crimes")
      } else {
        errMess.innerText = "User not found. Please try again."
        errMess.style.color = "red"
      }
    }catch(err){
      console.log(err)
    }
  };
  console.log(user);
  return (
    <div className='form'>
      <h1 id="s">Sign In</h1>
      <button className="signUp"><Link to="/add">Sign Up</Link></button>
      {/* <h2 className="signInError">ERROR!</h2> */}
      <input type="text" placeholder='user name' onChange={handleChange} name="userName"/>
      <input type="text" placeholder='password' onChange={handleChange} name="password"/>
      <button className="confirmSignIn" onClick={handleClick}>Confirm</button>
    </div>
  );
}

export default SignIn