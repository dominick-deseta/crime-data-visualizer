import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import Select from 'react-select'
import {useRef} from 'react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindow, Circle} from '@react-google-maps/api'
import crimeTypeOptions from '../components/crimeTypeOptions.js'; 
import raceOptions from '../components/raceOptions.js'; 

var lat = 0
var lng = 0

const sexOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'X', label: 'Other' },
];

const Crimes = () => {
const [crimes,setCrimes] = useState([])

useEffect(()=>{
    const fetchAllCrimes = async()=>{
        try{
            const coords = {
                lat : 40.1020,
                lng : -88.2272
            }
            const res = await axios.post("http://localhost:3306/callStoredProcedure", coords)
            setCrimes(res.data[0]);
            console.log(res.data[0])
        }catch(err){
            console.log(err)
        }
    }
    fetchAllCrimes();
    const interval = setInterval(() => {
        const infoWindows = document.querySelectorAll('.gm-style-iw');
        infoWindows.forEach((infoWindow) => {
            const hasForm = infoWindow.querySelector('form');
            if (!hasForm && infoWindow.innerText.trim() === '') {
                const infoWindowContainer = infoWindow.parentElement.parentElement;
                infoWindowContainer.style.display = 'none';
            }
        });
        var loggedInAs = document.getElementById("loggedInAs")
        if (loggedInAs && loggedInAs.innerHTML) {
          loggedInAs.innerHTML = "Logged in as <span class=\"curUser\">"+Cookies.get('username')+"</span>"
        }
        // console.log(Array.isArray(crimes))
        // console.log('Number of InfoWindows in the DOM:', infoWindows.length);
      }, 100);
    
      return () => clearInterval(interval);
}, []);

const {isLoaded} = useLoadScript({googleMapsApiKey: "AIzaSyC0lAXu1gaIJAw-Q5Gibi3JTaRzFs-wc7I"});
if(!isLoaded) {return <div>Loading....</div>}

return (
    <div>
        <h1>Reported Crimes</h1>
        <span id="loggedInAs">Logged in as ...</span>
        <div>
          <button className="toUsers"><Link to="/Users">View Users</Link></button>
        </div>
        <h5 id="long">Longitude: ?</h5> 
        <h5 id="lat">Latitude: ?</h5> 
        <div className="map_and_crimes">
            <div className="crime_table">
                <table className="crime_table_header">
                <thead>
                    <tr>
                        <th>Crime Type</th>
                        <th>Victim</th>
                        <th>Time</th>
                        <th>User Report</th>
                        <th>Distance</th>
                        <th>Result Type</th>
                    </tr>
                </thead>
                </table>
                <div className="crime_table_body_wrapper">
                <table>
                    <tbody>
                    {crimes && crimes.map(crime => (
                        <tr key={crime.crimeID}>
                        <td>{crimeTypeOptions.find(option => option.value === String(crime.crime_type))?.label || ""}</td>
                        <td>
                          <div>
                            <h5>{raceOptions.find(option => option.value === String(crime.victim_race))?.label || ""}</h5>
                            <h5>{sexOptions.find(option => option.value === String(crime.victim_sex))?.label || ""}</h5>
                            <h5>{crime.victim_age}</h5>
                          </div>
                        </td>
                        <td>{formatTime(crime.time)}</td>
                        <td>{crime.user_report === 1 ? "Yes" : "No"}</td>
                        <td>{angularDistanceToMeters(crime.distance).toFixed(2)}m</td>
                        <td>{crime.result_type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            <div className="map_container">
                <Map crimes={crimes} setCrimes={setCrimes}/>
            </div>
        </div>
    </div>
  )
}

export default Crimes

// !! Function is AI generated !!
function angularDistanceToMeters(angularDistance) {
  // Earth's mean radius in meters (using the authalic radius)
  const earthMeanRadius = 6371007;

  // Convert angular distance to radians
  const angularDistanceRadians = (Math.PI / 180) * angularDistance;

  // Calculate the linear distance in meters
  const linearDistance = earthMeanRadius * angularDistanceRadians;

  return linearDistance;
}

// !! Function is AI generated !!
function formatTime(time) {
  const hours = Math.floor(time / 100); // Extract hours from time
  const minutes = time % 100; // Extract minutes from time

  // Create a new Date object with the current date and the extracted hours and minutes
  const timeObj = new Date();
  timeObj.setHours(hours);
  timeObj.setMinutes(minutes);

  // Format the time as AM/PM
  const formattedTime = timeObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return formattedTime;
}

function Map({crimes, setCrimes}) {
const [selectedCrime, setSelectedCrime] = useState(null);
const [postCrime, setPostCrime] = useState(null);
const mapRef = useRef(null);
const [mapCenter, setMapCenter] = useState({ lat: 40.1020, lng: -88.2272 });
const [isMounted, setIsMounted] = useState(false);
const [circleInstance, setCircleInstance] = useState(null);

useEffect(() => {
  setIsMounted(true)
});

const center = { lat: 40.1020, lng: -88.2272 }
const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: angularDistanceToMeters(1),
  zIndex: 100
}

if (!Array.isArray(crimes)) {
    console.log("crimes is not an array")
    console.log(crimes.crimes)
    return <div>Loading...</div>;
}

const handleSubmit =  async e=> {
    try {
      const res = await axios.post("http://localhost:3306/AddCrime", postCrime)
      console.log(res)
      window.location.reload()
    }catch(err){
      console.log(err)
    }
}
const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "time") {
        value = value.replace(":", "");
    }
    console.log("handling change! " + value)
    setPostCrime((prev) => {
        return { ...prev, [name]: value };
    });
};
const handleSelect = (e, actionMeta) => {
    const name = actionMeta.name;
    let value = e.value;
    console.log("handling select! " + value)
    setPostCrime((prev) => {
      return { ...prev, [name]: value };
    });
};
const handleDelete = async (crimeID)=>{
    try{
        await axios.delete("http://localhost:3306/deleteCrime/"+crimeID)
        window.location.reload()
    }catch(err){
        console.log(err)
    }
}
const getCrimeLabel = (crimeType) => {
    const crimeOption = crimeTypeOptions.find(option => option.value === String(crimeType));
    return crimeOption?.label || "";
};
const handleDragEnd = () => {
  console.log("handling dragEnd")
  if (mapRef.current && mapRef.current.state && mapRef.current.state.map){
    console.log(mapRef.current.state.map.getCenter().toJSON());
    const newCenter = mapRef.current.state.map.getCenter().toJSON();
    setMapCenter(newCenter);
  axios
    .post("http://localhost:3306/callStoredProcedure", newCenter)
    .then((res) => {
      console.log(crimes.length)
      if (res.data[0]) {
        console.log("changing crimes...")
        setCrimes(res.data[0]);
        console.log(crimes);
      } else {
        console.log(res)
      }
    });
  }
};


 return <GoogleMap ref={mapRef} zoom={15} center={mapCenter} mapContainerClassName='map' onClick={ev => {
    lat = ev.latLng.lat()
    lng = ev.latLng.lng()
    document.getElementById('lat').innerHTML = "Latitude: <span class=\"blue\">" + lat + "</span>";
    document.getElementById('long').innerHTML = "Longitude: <span class=\"blue\">" + lng + "</span>";
    console.log(Cookies.get('username'))
  
    setPostCrime({
        crimeType: "",
        crimeLat: lat,
        crimeLng: lng,
        crimeDescription: "",
        victimSex: "",
        victimRace: "",
        victimAge: "",
        time: "",
        username: Cookies.get('username')
    })
    }} onDragEnd={handleDragEnd} onZoomChanged={handleDragEnd}>
    {isMounted && (
      <Circle
        className="circle"
        center={mapCenter}
        options={options}
        onLoad={(circle) => {
          if (circleInstance) {
            circleInstance.setMap(null);
          }
          setCircleInstance(circle);
        }}
        onUnmount={() => {
          if (circleInstance) {
            circleInstance.setMap(null);
          }
          setCircleInstance(null);
        }}
      />
    )}
    <MarkerF
      position={mapCenter}
      options={{
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/10/10522.png', // Or an online URL
          scaledSize: new window.google.maps.Size(50, 50),
        },
      }}
    />
    {crimes && crimes.map((crime, index) => (
        <MarkerF
          key={index}
          position={{ lat: crime.latitude, lng: crime.longitude }}
          onClick={() => {
            setSelectedCrime(crime);
          }}
          options={{
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', 
              scaledSize: new window.google.maps.Size(50, 50), 
              labelOrigin: new window.google.maps.Point(25, 16)
            },
            label: {
                text: getCrimeLabel(crime.crime_type),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                className: 'map-label'
            }
          }}
        />
      ))}
    {postCrime && (
        <InfoWindow
          position={{ lat: postCrime.crimeLat, lng: postCrime.crimeLng }}
          onCloseClick={() => {
            setPostCrime(null);
          }}
        >
            <form onSubmit={handleSubmit}>
                <h5>Crime Type: </h5> 
                <Select
                    options={crimeTypeOptions}
                    name="crimeType"
                    onChange={handleSelect}
                />
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
                <h5>Victim Age: </h5>
                <input type="number"  name="victimAge"onChange={handleChange}/>
                <div><button type="submit">Submit</button></div>
            </form>
        </InfoWindow>
      )}
    {selectedCrime && (
        <InfoWindow
          position={{ lat: selectedCrime.latitude, lng: selectedCrime.longitude }}
          onCloseClick={() => {
            setSelectedCrime(null);
          }}
        >
          <div>
            <h4>{selectedCrime.crime_type}</h4>
            <p>
              Crime ID: {selectedCrime.crimeID} <br />
              Location ID: {selectedCrime.locationID} <br />
              Time: {selectedCrime.time} <br />
              User Reported: {selectedCrime.user_report} <br />
              Victim ID: {selectedCrime.victimID} <br />
              Description: {selectedCrime.description}
            </p>
            <button className="delete" onClick={()=>handleDelete(selectedCrime.crimeID)}>Delete</button>
          </div>
        </InfoWindow>
      )}
 </GoogleMap>
 }
 