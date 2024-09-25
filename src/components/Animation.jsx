// Animation.js
import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { csvParseRows } from 'd3-dsv';
import indexBy from 'index-array-by';
import data from "../assets/data.geojson"; // Import the geojson file

const COUNTRY = 'Portugal';
const MAP_CENTER = { lat: 0, lng: 0, altitude: 4 };
const OPACITY = 1;

const cities = [
    { name: "Tokyo", lat: 35.682839, lng: 139.759455 },
    { name: "New York", lat: 40.712776, lng: -74.005974 },
    { name: "London", lat: 51.507351, lng: -0.127758 },
    { name: "Paris", lat: 48.856613, lng: 2.352222 },
    { name: "Sydney", lat: -33.868819, lng: 151.209295 },
    { name: "São Paulo", lat: -23.55052, lng: -46.633308 },
    { name: "Mumbai", lat: 19.07609, lng: 72.877426 },
    { name: "Beijing", lat: 39.904202, lng: 116.407394 },
    { name: "Moscow", lat: 55.755825, lng: 37.617298 },
    { name: "Cairo", lat: 30.04442, lng: 31.235712 },
    { name: "Mexico City", lat: 19.432608, lng: -99.133209 },
    { name: "Istanbul", lat: 41.008238, lng: 28.978359 },
    { name: "Bangkok", lat: 13.756331, lng: 100.501762 },
    { name: "Buenos Aires", lat: -34.603684, lng: -58.381559 },
    { name: "Jakarta", lat: -6.208763, lng: 106.845599 },
  ];

const airportParse = ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]) => ({
  airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source
});

const routeParse = ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]) => ({
  airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment
});

const Animation = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [latArray, setLatArray] = useState([]);
  const [lngArray, setLngArray] = useState([]);
  const [animate, setAnimate] = useState(false); // State for animation
  const N = 15;

  useEffect(() => {
    // Load the countries data
    fetch(data)
      .then((res) => res.json())
      .then((geoData) => {
        const fetchedCountries = geoData.features;

        // Update countries state
        setCountries(fetchedCountries);

        // Update latArray and lngArray from cities
        setLatArray(cities.slice(0, N).map((city) => city.lat));
        setLngArray(cities.slice(0, N).map((city) => city.lng));
      });
  }, []);

  const markerSvg = `<svg viewBox="-4 0 36 36">
          <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
          <circle fill="gold" cx="14" cy="14" r="7"></circle>
        </svg>`;

  // Generate marker data using the lat and lng arrays
  const gData = latArray.map((lat, index) => ({
    lat: lat,
    lng: lngArray[index],
    size: 50,
    color: ["lightblue"],
    name: cities[index].name,
  }));

  const handleShowInfor = (cityName) => {
    console.log(`City: ${cityName}`);
    // Toggle animation state
    setAnimate((prev) => !prev);
  };

  const arcsData = [...Array(15 - 1).keys()].map((i) => ({
    startLat: latArray[i],
    startLng: lngArray[i],
    endLat: latArray[i + 1],
    endLng: lngArray[i + 1],
    color: [
      ["yellow", "white", "green"][Math.round(Math.random() * 2)],
      ["yellow", "white", "green"][Math.round(Math.random() * 2)],
    ],
  }));

  useEffect(() => {
    // Load data
    Promise.all([
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').then(res => res.text())
        .then(d => csvParseRows(d, airportParse)),
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat').then(res => res.text())
        .then(d => csvParseRows(d, routeParse))
    ]).then(([airports, routes]) => {
      const filteredAirports = airports.filter(d => d.country === COUNTRY);
      const byIata = indexBy(filteredAirports, 'iata', false);

      const filteredRoutes = routes
        .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // Exclude unknown airports
        .filter(d => d.stops === '0') // Non-stop flights only
        .map(d => Object.assign(d, {
          srcAirport: byIata[d.srcIata],
          dstAirport: byIata[d.dstIata]
        }))
        .filter(d => d.srcAirport.country === COUNTRY && d.dstAirport.country === COUNTRY); // Domestic routes within country

      

      // Set initial view of the globe
      globeEl.current.pointOfView(MAP_CENTER, 9000);
    });
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      
    />
  );
};

export default Animation;
