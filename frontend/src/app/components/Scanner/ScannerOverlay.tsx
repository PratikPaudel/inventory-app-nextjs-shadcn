import React from 'react';

// This component provides a visual overlay for the barcode scanner.
const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-8 border-2 border-primary/30 rounded-lg">
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
        <div className="absolute inset-x-0 h-0.5 bg-primary/50 animate-scan" />
      </div>
    </div>
  );
};

export default ScannerOverlay;