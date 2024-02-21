import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const AdvQ2 = () => {
const [victims,setVictims] = useState([])

useEffect(()=>{
    const fetchAllVictims = async()=>{
        try{
            const res = await axios.get("http://localhost:3306/Crimes/AdvQ2")
            setVictims(res.data);
            console.log(res)
            console.log(res.data[0])
        }catch(err){
            console.log(err)
        }
    }
    fetchAllVictims();
}, []);

return (
    <div>
        <h1>Advanced Query 2 Results</h1>
        <div>
            <button className="backToCrimes"><Link to="/Crimes">Back to crimes</Link></button>
        </div>
        <div>
            <h3>Victim Sex | Crime Type | Count </h3>
        </div>
        <div className="victims">
            {victims.map(victim=>(
                <div className="victims" key={victim.victimID}>
                    <ul class="victim-list">
                        <li>{victim.victim_sex}</li>
                        <li>{victim.crime_type}</li>
                        <li>{victim.count}</li>
                    </ul>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AdvQ2