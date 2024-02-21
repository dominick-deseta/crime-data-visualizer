import React from 'react'
import GoogleMapReact from 'google-map-react'
import { Icon } from '@iconify/react'
import './map.css'

// https://github.com/ovieokeh/contact-page-with-google-maps/blob/add-map/src/components/map/Map.jsx

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon="mdi-light:home" className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

const Map = ({ location, zoomLevel }) => (
  <div className="map">
    <h2 className="map-h2">CRIME MAP</h2>

    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyD9x7TrtE1691DYDwBzGj6jQwjW95PTtOE' }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />
      </GoogleMapReact>
    </div>
  </div>
)

export default Map