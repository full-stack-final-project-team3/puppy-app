import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const MapView = ({ location, title }) => {
  const [coords, setCoords] = useState({ lat: 37.506320759000715, lng: 127.05368251210247 });

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=07fdc4c9ae86d6977dcd3e71da06ab41&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(location, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            setCoords({ lat, lng });
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
          }
        });
      } else {
        console.error('Kakao maps library is not loaded');
      }
    };

    script.onerror = () => {
      console.error('Kakao Maps script failed to load');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [location]);

  return (
    <div>
      <Map
        center={coords}
        style={{
          width: '600px',
          height: '500px',
          borderRadius: '20px',
        }}
      >
        <MapMarker
          style={{ border: 'transparent' }}
          position={coords}
        >
          <div
            style={{
              color: '#9971ff',
              fontSize: '19px',
              fontWeight: '700',
              border: '4px solid #9971ff',
              borderRadius: '10px',
              padding: '2.5px',
            }}
          >
            {title}
          </div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default MapView;
