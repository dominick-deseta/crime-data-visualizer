import React from 'react';
import {useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Update = () => {
  const [user,setUser] = useState({
    userName:"",
    password:""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.pathname.split("/")[2];
  const handleChange = (e) => {
    setUser((prev)=>({...prev,[e.target.name]: e.target.value}));
  };
  const handleClick = async e => {
    e.preventDefault()
    try {
      await axios.put("http://localhost:3306/Users/"+userName, user)
      navigate("/")
    }catch(err){
      console.log(err)
    }
  };
  console.log(user);

  return (
    <div className='form'>
      <h1>Updating user</h1>
      <h2>{user.userName}</h2>
      <h2>{userName}</h2>
      <input type="text" placeholder='user name' onChange={handleChange} name="userName"/>
      <input type="text" placeholder='password' onChange={handleChange} name="password"/>
      <button className="confirmUpdate" onClick={handleClick}>Confirm</button>
    </div>
  );
}

export default Update