import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, useLoadScript, Markers} from '@react-google-maps/api'
import Cookies from 'js-cookie'
import Select from 'react-select'
import crimeTypeOptions from '../components/crimeTypeOptions.js'; 
import raceOptions from '../components/raceOptions.js'; 

var lat = 0
var lng = 0

const Report = () => {

  useEffect(() => {
  const interval = setInterval(() => {
    // console.log(details)
    var loggedInAs = document.getElementById("loggedInAs")
    loggedInAs.innerHTML = "Logged in as <span class=\"curUser\">"+Cookies.get('username')+"</span>"
  }, 1000);

  return () => clearInterval(interval);
  }, [])

  const sexOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'X', label: 'Other' },
  ];

  const [details, setDetails] = useState({
    crimeType: "",
    crimeDescription: "",
    victimSex: "",
    victimRace: "",
    victimAge: "",
    time: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "time") {
      value = value.replace(":", "");
    }
    console.log("handling change! " + value)
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSelect = (e, actionMeta) => {
    const name = actionMeta.name;
    let value = e.value;
    console.log("handling change! " + value)
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit =  async e=> {
    e.preventDefault()
    try {
      console.log(details)
      const newDetails = {
        crimeType: details.crimeType,
        crimeLat: lat,
        crimeLng: lng,
        crimeDescription: details.crimeDescription,
        victimSex: details.victimSex,
        victimRace: details.victimRace,
        victimAge: details.victimAge,
        time: details.time,
        username: Cookies.get('username')
      }
      const res = await axios.post("http://localhost:3306/AddCrime", newDetails)
      console.log(res)
    }catch(err){
      console.log(err)
    }
    
  }
  
  const {isLoaded} = useLoadScript({googleMapsApiKey: "AIzaSyC0lAXu1gaIJAw-Q5Gibi3JTaRzFs-wc7I"});
  if(!isLoaded) {return <div>Loading....</div>}


  return (
  <div>
    <h1>Report a crime!</h1>
    <span id="loggedInAs">Logged in as ...</span>
    <form onSubmit={handleSubmit}>
      <h5>Crime Type: </h5> 
      <Select
        options={crimeTypeOptions}
        name="crimeType"
        onChange={handleSelect}
      />
      <h5 id="lat">Latitude: ?</h5> 
      <h5 id="long">Longitude: ?</h5> 
      <h5>Crime Description: </h5> <textarea name="crimeDescription" onChange={handleChange}></textarea>
      <h5>Victim Sex: </h5>
      <Select
        options={sexOptions}
        name="victimSex"
        onChange={handleSelect}
      />
      <h5>Time: </h5> <input type="time" name="time" onChange={handleChange}/>
      <h5>Victim Race: </h5>
      <Select
        options={raceOptions}
        name="victimRace"
        onChange={handleSelect}
      />
      <h5>Victim Age: </h5> <input type="number"  name="victimAge"onChange={handleChange}/>
      <button type="submit">Submit Form</button>
    </form>
    <div className="map_container">
      <Map/>
    </div>
  </div>
  )
}

export default Report

function Map() {
 return <GoogleMap onClick={ev => {
    lat = ev.latLng.lat()
    lng = ev.latLng.lng()
    document.getElementById('lat').innerHTML = "Latitude: <span class=\"blue\">" + lat + "</span>";
    document.getElementById('long').innerHTML = "Longitude: <span class=\"blue\">" + lng + "</span>";
 }} zoom={15} center={{lat: 40.1020, lng:-88.2272}} mapContainerClassName='map'></GoogleMap>
}