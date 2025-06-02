'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import type { QuaggaResult } from '@ericblade/quagga2';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ScannerVideo from './ScannerVideo';
import ScannerControls from './ScannerControls';
import ScannerOverlay from './ScannerOverlay';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  height?: number | string;
  disabled?: boolean;
}

// This component uses Quagga2 to scan barcodes using the device's camera.
// It initializes the camera, handles scanning, and provides controls for starting/stopping the scanner.
const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  height = '300px',
  disabled = false,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const stopQuagga = useCallback(() => {
    try {
      Quagga.stop();
      const videoElements = document.getElementsByTagName('video');
      Array.from(videoElements).forEach((video) => {
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      });
    } catch (error) {
      console.warn('Error stopping Quagga2:', error);
    }
    setIsScanning(false);
  }, []);

  const initQuagga = useCallback(() => {
    if (!videoRef.current) {
      console.error('Video ref is not attached to the DOM');
      return;
    }

    // This timeout is to ensure that the video element is fully rendered before Quagga tries to access it
    
    setTimeout(() => {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoRef.current,
            constraints: {
              width: 960,
              height: 540,
              facingMode: 'environment',
            },
            area: {
              top: '10%',
              right: '10%',
              left: '10%',
              bottom: '10%',
            },
          },
          decoder: {
            readers: ['code_39_reader'],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true,
              showCanvas: true,
            }
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency || 4,
        },
        (err?: Error) => {
          setIsInitializing(false);
          if (err) {
            console.error('Quagga2 initialization failed:', err);
            if (err.name === 'NotAllowedError') {
              setError('Camera access is required for scanning. Please allow camera permissions and refresh the page.');
            } else if (err.name === 'NotReadableError') {
              // console.log('Retrying camera initialization...');
              setTimeout(() => {
                setIsScanning(false);
                setTimeout(() => setIsScanning(true), 100);
              }, 1000);
            } else {
              setError('An error occurred while initializing the scanner. Please try again.');
            }
            return;
          }
          // console.log('Quagga2 initialized successfully');
          Quagga.start();
        }
      );
    }, 1000);

    Quagga.onDetected((result: QuaggaResult) => {
      if (result.codeResult) {
        onScan(result.codeResult.code);
        stopQuagga(); // Stop Quagga after a successful scan
      }
    }, );
  }, [onScan, stopQuagga]); 

  useEffect(() => {
    if (isScanning && !disabled && !isInitializing) {
      initQuagga();
    } else if (!isScanning) {
      stopQuagga();
    }
  }, [isScanning, disabled, isInitializing, initQuagga, stopQuagga]);

  useEffect(() => {
    // Check if the camera is available and permissions are granted
    const checkCameraPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setIsInitializing(false);
      } catch (error) {
        console.error('Camera access denied or error:', error);
        setError('Camera access is required for scanning. Please allow camera permissions and refresh the page.');
        setIsInitializing(false);
      }
    };

    checkCameraPermissions();
  }, []);

  useEffect(() => {
    return () => {
      // console.log('Scanner component unmounting - cleaning up camera');
      stopQuagga();
    };
  }, [stopQuagga]);

  useEffect(() => {
    // Handle visibility change to stop scanning when the tab is not active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopQuagga();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopQuagga]);

  if (isInitializing) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div 
          className="relative bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm flex items-center justify-center" 
          style={{ height }}
        >
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"/>
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm" style={{ height }}>
        {isScanning && !disabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <ScannerVideo videoRef={videoRef} style={{ aspectRatio: '16/9' }} />
            <ScannerOverlay />
            <ScannerControls
              isScanning={isScanning}
              disabled={disabled || isLoading}
              onStop={() => setIsScanning(false)}
              onStart={() => {
                setIsScanning(true);
                initQuagga(); // Explicitly reinitialize Quagga
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <CameraOff className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2 mb-4">
              <h3 className="font-semibold text-lg">
                {disabled ? "Scanner Disabled" : "Scanner Stopped"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {disabled 
                  ? "Please wait while we process the current scan" 
                  : "Click the button below to start scanning barcodes"}
              </p>
            </div>
            {!disabled && (
              <Button
                variant="default"
                onClick={() => {
                  setIsScanning(true);
                  initQuagga(); // Explicitly reinitialize Quagga
                }}
                className="gap-2"
                disabled={isLoading}
                aria-label="Start Scanner"
              >
                <Camera className="h-4 w-4" />
                Start Scanner
              </Button>
            )}
          </div>
        )}
      </div>
      {error && !disabled && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()} // Reload the page to retry
              className="h-8 w-8"
              aria-label="Retry"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BarcodeScanner;