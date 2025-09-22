import React from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ selectedLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAFB7lnFaGvbIL0m3jLYL6oK2p6lDajNbk",
  });
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, {});

  if (loadError) return `Error loading map: ${loadError.message}`;
  if (!isLoaded) return "Loading...";
  console.log(selectedLocation);
  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "400px",
      }}
      center={selectedLocation}
      zoom={17}
      onLoad={onMapLoad}
    >
      <MarkerF position={selectedLocation} />
    </GoogleMap>
  );
};

export default MapComponent;
