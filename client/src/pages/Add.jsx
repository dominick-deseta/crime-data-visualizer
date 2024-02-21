import React from 'react';
import {useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Add = () => {
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
      await axios.post("http://localhost:3306/Users", user)
      navigate("/")
    }catch(err){
      console.log(err)
    }
  };
  console.log(user);
  return (
    <div className='form'>
      <h1>Sign Up</h1>
      <input type="text" placeholder='user name' onChange={handleChange} name="userName"/>
      <input type="text" placeholder='password' onChange={handleChange} name="password"/>
      <button className="confirmAdd" onClick={handleClick}>Confirm</button>
    </div>
  );
}

export default Add