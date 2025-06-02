import React from 'react';
import { ScannerVideoProps } from './types';

// This component is responsible for rendering the video element for the barcode scanner.
const ScannerVideo: React.FC<ScannerVideoProps> = ({ videoRef, style }) => {
  return (
    <div 
      ref={videoRef} 
      id="interactive"
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={style}
    >
      {/* Video element will be injected here by Quagga */}
    </div>
  );
};

export default ScannerVideo;