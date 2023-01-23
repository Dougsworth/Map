import React, { useState } from "react";
import { MapContainer, TileLayer, Canvas, Popup } from "react-leaflet";
import { latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import jamaicaData from "../data/jamaica.json";
import markers from "../data/markers.json";
import { CircleMarker } from "react-leaflet";

import Map from "./Map"; // Import the Map component

const options = {
  center: [18.102, -77.8339],
  zoom: 6.2,
  maxBounds: latLngBounds([18.5243, -78.3939], [17.6992, -76.1731]),
};

const JamaicaMap = () => {
  const [selectedParish, setSelectedParish] = useState(null);

  const handleClick = (e) => {
    setSelectedParish(e.target);
  };

  const handleMouseOut = (e) => {
    e.target.setStyle(e.target.options.style);
    setSelectedParish(null);
  };

  const handleRedraw = (info) => {
    // Get the canvas context
    const ctx = info.canvas.getContext("2d");

    // Clear the canvas before drawing new markers
    ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);

    // Loop through the markers array and draw each marker
    markers.forEach((marker) => {
      ctx.beginPath();
      ctx.arc(marker.lat, marker.lng, marker.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = marker.color;
      ctx.fill();
    });
  };

  return (
    <div className="mapbox">
      <section className="my-map map-content">
        <MapContainer
          className="map-container"
          {...options}
          zoomControl={false}
          touchZoom={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            minZoom={8}
            opacity={0}
          />
          <Canvas
            redraw={handleRedraw}
            className="Jamaica-parishes"
            data={jamaicaData}
            style={{ color: "black", fillColor: "white", weight: 1 }}
            highlightStyle={{ color: "black ", fillColor: "black", weight: 1 }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`Parish: ${feature.properties.PARISH}`, {
                className: "my-popup",
              });
              layer.on({
                mouseover: (e) => {
                  e.target.setStyle(e.target.options.highlightStyle);
                  e.target
                    .bindPopup(`Parish: ${feature.properties.PARISH}`)
                    .openPopup();
                },
                mouseout: handleMouseOut,
                click: handleClick,
              });
            }}
          />

          {/* comment this out and the import to stop generating markers */}
          {markers.map((marker, i) => (
            <CircleMarker
              key={i}
              center={[marker.lat, marker.lng]}
              color={marker.color}
              radius={0.5}
            />
          ))}
        </MapContainer>
        <Map />
      </section>
    </div>
  );
};

export default JamaicaMap;
