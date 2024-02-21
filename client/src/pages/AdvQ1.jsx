import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const AdvQ1 = () => {
const [crimes,setCrimes] = useState([])
const [coords,setCoords] = useState({
    lat:0,
    lng:0
  });

const handleChange = (e) => {
    setCoords((prev)=>({...prev,[e.target.name]: e.target.value}));
}

const handleClick = async e => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3306/callStoredProcedure", coords)
      setCrimes(res.data[0])
      console.log(crimes)
    }catch(err){
      console.log(err)
    }
  };

console.log(coords)

return (
    <div>
        <h1>Stored Procedure Results</h1>
        <div>
            <button className="backToCrimes"><Link to="/Crimes">Back to crimes</Link></button>
        </div>
        <div>
            <input type="number" placeholder='latitude' onChange={handleChange} name="lat"/>
        </div>
        <div>
            <input type="number" placeholder='longitude' onChange={handleChange} name="lng"/>
        </div>
        <button className="confirm" onClick={handleClick}>Confirm</button>
        <table>
            <thead>
                <tr>
                    <th>Crime ID</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Crime Type</th>
                    <th>Result Type</th>
                </tr>
            </thead>
            {crimes.map(crime => (
                <tbody>
                    <tr>
                        <td>{crime.crimeID}</td>
                        <td>{crime.latitude}</td>
                        <td>{crime.longitude}</td>
                        <td>{crime.crime_type}</td>
                        <td>{crime.result_type}</td>
                    </tr>
                </tbody>
            ))}
        </table>
    </div>
  )
}

export default AdvQ1