import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import data from "../assets/data.geojson"; // Import the geojson file

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

const PolyGlobe = () => {
  const [countries, setCountries] = useState([]);
  const [latArray, setLatArray] = useState([]);
  const [lngArray, setLngArray] = useState([]);
  const [animate, setAnimate] = useState(false); // State for animation
  const globeEl = useRef();
  const N = 15;

  useEffect(() => {
    let to;
    (function check() {
      if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 2;

        // Set altitude based on screen width
        const altitude = window.innerWidth <= 768 ? 4 : 3; // Adjust altitude based on screen width
        globeEl.current.pointOfView({ lat: 0, lng: 0, altitude });
      } else {
        to = setTimeout(check, 1000);
      }
    })();
    return () => {
      if (to) {
        clearTimeout(to);
      }
    };
  }, []);

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

  const handleShowInfor = (cityName, pointLat, pointLng) => {
    console.log(`City: ${cityName}`);
    if (globeEl.current) {
      const altitude = window.innerWidth <= 768 ? 4 : 3; // Set altitude based on screen width
  
      if (!animate) {
        globeEl.current.controls().autoRotate = false;
        globeEl.current.pointOfView({
          lat: pointLat,
          lng: pointLng,
          altitude: altitude, // Use the dynamic altitude here
        });
      } else {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 2;
      }
    }
  
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

  return (
    <div className={animate ? "globeAnimation" : ""}>
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe@2.18.0/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe@2.18.0/example/img/earth-topology.png"
        hexPolygonsData={countries}
        backgroundColor="black"
        hexPolygonResolution={3}
        hexPolygonMargin={0.1}
        hexPolygonUseDots={true}
        hexPolygonColor={() =>
          `#${Math.round(Math.random() * Math.pow(2, 24))
            .toString(16)
            .padStart(6, "0")}`
        }
        htmlElementsData={gData}
        arcsData={arcsData}
        arcColor={"color"}
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 500}
        htmlElement={(d) => {
          const el = document.createElement("div");
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;
          el.style.transform = `translate(-30%, -50%) translateZ(-${
            d.size / 2
          }px)`;

          const tooltip = document.createElement("div");
          tooltip.innerText = d.name;
          tooltip.style.position = "absolute";
          tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
          tooltip.style.color = "white";
          tooltip.style.borderRadius = "4px";
          tooltip.style.padding = "5px";
          tooltip.style.transform = "translate(-50%, -100%)";
          tooltip.style.display = "none";
          el.appendChild(tooltip);

          el.onmouseenter = () => {
            tooltip.style.display = "block";
          };
          el.onmouseleave = () => {
            tooltip.style.display = "none";
          };

          el.style["pointer-events"] = "auto";
          el.style.cursor = "pointer";
          el.onclick = () => handleShowInfor(d.name, d.lat, d.lng);
          return el;
        }}
      />
    </div>
  );
};

export default PolyGlobe;
