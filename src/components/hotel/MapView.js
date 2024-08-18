import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const MapView = ({ location, title }) => {
  const [coords, setCoords] = useState({ lat: 37.506320759000715, lng: 127.05368251210247 });
  const [map, setMap] = useState(null);

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


  const handleZoomIn = () => {
    if (map) {
      map.setLevel(map.getLevel() - 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setLevel(map.getLevel() + 1);
    }
  };

  let mapContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  const mapStyle = {
    width: '100%',
    height: '500px',
    maxWidth: '1400px', // 최대 너비 1400px 설정
    filter: 'sepia(10%) hue-rotate(0deg) saturate(60%) brightness(100%) contrast(100%)',
  };

  return (
    <div style={mapContainerStyle}>
      <Map
        center={coords}
        level={3}
        style={mapStyle}
        draggable={false}
        onCreate={setMap}
      >
        <MapMarker position={coords}>
          <div
            style={{
              color: '#9971ff',
              fontSize: '18px',
              fontWeight: '700',
              border: '2px solid #9971ff',
              borderRadius: '5px',
              padding: '5px 10px',
              background: '#ffffff',
            }}
          >
            {title}
          </div>
        </MapMarker>
      </Map>
      <div style={{ position: 'absolute', top: '10px', right: '550px', zIndex: 10 }}>
        <button onClick={handleZoomIn} style={buttonStyle}>➕</button>
        <button onClick={handleZoomOut} style={buttonStyle}>➖</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#FFF',
  color: '#ffffff',
  border: 'none',
  padding: '10px',
  margin: '5px',
  fontSize: '25px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default MapView;
