import React from 'react';
import { Button } from '@/components/ui/button';
import { CameraOff, Camera } from 'lucide-react';

interface ScannerControlsProps {
  isScanning: boolean;
  disabled: boolean;
  onStop: () => void;
  onStart: () => void;
}

// This component provides controls for starting and stopping the barcode scanner.
// It displays a button to start the scanner when it's not scanning,
const ScannerControls: React.FC<ScannerControlsProps> = ({
  isScanning,
  disabled,
  onStop,
  onStart,
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      {isScanning ? (
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
          onClick={onStop}
          disabled={disabled}
        >
          <CameraOff className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={onStart}
          className="gap-2"
          disabled={disabled}
        >
          <Camera className="h-4 w-4" />
          Start Scanner
        </Button>
      )}
    </div>
  );
};

export default ScannerControls;