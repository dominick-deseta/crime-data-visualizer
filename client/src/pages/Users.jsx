import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

var change=false
const Users = () => {
const [users,setUsers] = useState([])
const [searchUser,setSearchUser] = useState({
    userName:"",
    password:""
  });
console.log(searchUser.userName);
console.log(change);
useEffect(()=>{
    const fetchAllUsers = async()=>{
        try{
            const res = await axios.get("http://localhost:3306/Users")
            setUsers(res.data);
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }
    fetchAllUsers();
    var loggedInAs = document.getElementById("loggedInAs")
    loggedInAs.innerHTML = "Logged in as <span class=\"curUser\">"+Cookies.get('username')+"</span>"
}, []);

const handleDelete = async (userName)=>{
    try{
        await axios.delete("http://localhost:3306/Users/"+userName)
        window.location.reload()
    }catch(err){
        console.log(err)
    }
}

const handleChange = (e) => {
    setSearchUser((prev)=>({...prev,[e.target.name]: e.target.value}));
    change = true;
}

if (change) {
    const fetchAllUsers = async()=>{
        try{
            const l = "http://localhost:3306/Users/"+searchUser.userName
            console.log(l)
            const res = await axios.get(l)
            setUsers(res.data);
            console.log(res)
        }catch(err){
            console.log(err)
        }
    };
    fetchAllUsers();
    change=false;
}

return (
    <div>
        <h1>User List</h1>
        <span id="loggedInAs">Logged in as ...</span>
        <div>
            <button className="logOut"><Link to="/">Log Out</Link></button>
            <button className="toCrimes"><Link to="/Crimes">View Crimes</Link></button>
        </div>
        <div>
            <input type="text" placeholder='search username' onChange={handleChange} name="userName"/>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Password</th>
                </tr>
            </thead>
            {users.map(user => (
                <tbody>
                    <tr>
                        <td>{user.userName}</td>
                        <td>{user.password}</td>
                        <td><button className="delete" onClick={()=>handleDelete(user.userName)}>Delete</button></td>
                        <td><button className="update"><Link to={`/update/${user.userName}`}>Update</Link></button></td>
                    </tr>
                </tbody>
            ))}
        </table>
    </div>
  )
}

export default Users