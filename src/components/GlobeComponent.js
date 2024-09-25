import Globe from "react-globe.gl";

const GlobeComponent = () => {
  const markerSvg = `<svg viewBox="-4 0 36 36">
          <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
          <circle fill="gold" cx="14" cy="14" r="7"></circle>
        </svg>`;

  // Generate random latitude and longitude arrays
  const N = 15;
  const latArray = Array.from({ length: N }, () => (Math.random() - 0.5) * 180);
  const lngArray = Array.from({ length: N }, () => (Math.random() - 0.5) * 360);

  // Generate marker data using the lat and lng arrays
  const gData = latArray.map((lat, index) => ({
    lat: lat,
    lng: lngArray[index],
    size: 70,
    color: ["lightblue"],
  }));

  const arcsData = [...Array(N - 1).keys()].map((i) => ({
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
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
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

            el.style["pointer-events"] = "auto";
            el.style.cursor = "pointer";
            el.onclick = () => console.info(d);
            return el;
          }}
        />
    </div>
  );
};

export default GlobeComponent;
