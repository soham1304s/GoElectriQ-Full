import React from 'react';
import MapMockup from './MapMockup.jsx';

const GoogleMapComponent = ({ 
  pickupCoords, 
  dropCoords, 
  isDark = false,
  className = "" 
}) => {
  // Since we are not using the real Google Maps API for now,
  // we render a premium static mockup that maintains the "Wow" factor.
  
  return (
    <div className={`w-full h-full rounded-2xl overflow-hidden ${className}`}>
      <MapMockup 
        pickupLocation={pickupCoords?.address} 
        dropLocation={dropCoords?.address}
      />
    </div>
  );
};

export default GoogleMapComponent;
