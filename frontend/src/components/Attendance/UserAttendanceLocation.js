import React from 'react';
import { GoogleMap, useLoadScript, InfoWindowF, MarkerF } from '@react-google-maps/api';

// import logoImage from "../../assets/Image/logo.png";
import { CustomDescription } from '../Common/Common';

// const libraries = ['places'];
const mapContainerStyle = {
    width: '450px',
    height: '300px',
};

const UserAttendanceLocation = (props) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAFB7lnFaGvbIL0m3jLYL6oK2p6lDajNbk',
        // libraries,
    });
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const center = {
        lat: parseFloat(props.latitude), // default latitude
        lng: parseFloat(props.longitude), // default longitude
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    return (
        <div>
            {isLoaded &&
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={center}
                    onLoad={onMapLoad}
                >

                    <MarkerF
                        // key={index}
                        position={{
                            lat: parseFloat(center.lat),
                            lng: parseFloat(center.lng),
                        }}
                        icon={{
                            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                            // url: "/favicon.png",
                            scaledSize: {
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                            },
                        }}
                    >
                        <InfoWindowF
                            position={{
                                lat: parseFloat(center.lat),
                                lng: parseFloat(center.lng),
                            }}
                        >
                            <div>
                                <CustomDescription
                                    Description={props.username}
                                    style={{
                                        color: "#000",
                                        fontWeight: "500",
                                        marginBottom: "5px",
                                    }}
                                />
                                {/* <CustomDescription Description={row.latest_datetime} /> */}
                            </div>
                        </InfoWindowF>
                    </MarkerF>
                </GoogleMap>
            }
        </div>
    );
};

export default UserAttendanceLocation;