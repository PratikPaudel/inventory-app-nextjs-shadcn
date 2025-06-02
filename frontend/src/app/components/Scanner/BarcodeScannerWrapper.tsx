'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import BarcodeScanner from './BarcodeScanner';
import EditProductModal from '@/app/inventory/EditProductModal';
import CreateProductModal from '@/app/inventory/CreateProductModal';
import { EquipmentData } from './types';

interface ScanError {
  title: string;
  description: string;
}
// This component is a wrapper for the barcode scanner functionality.
// It handles the state of the scanner, including showing modals for editing and creating equipment,
const BarcodeScannerWrapper = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [equipmentData, setEquipmentData] = useState<EquipmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScannedAssetTag, setLastScannedAssetTag] = useState<string | null>(null);
  const [assetTagForCreateModal, setAssetTagForCreateModal] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<ScanError | null>(null);

  // Wrap showErrorToast in useCallback
  const showErrorToast = useCallback((title: string, description: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  }, [toast]);

  // Wrap resetState in useCallback
  const resetState = useCallback((showToast = false) => {
    setShowEditModal(false);
    setEquipmentData(null);
    setTimeout(() => setLastScannedAssetTag(null), 500);
    if (showToast) {
      toast({
        title: "Success",
        description: "Equipment updated successfully",
      });
    }
  }, [toast]);

  const handleModalClose = useCallback(() => resetState(), [resetState]);
  
  const handleUpdateSuccess = useCallback(async () => {
    resetState(true);
    return Promise.resolve();
  }, [resetState]);

  // Wrap handleScan in useCallback
  const handleScan = useCallback(async (assetTag: string) => {
    if (!navigator.onLine) {
      showErrorToast("Network Error", "Please check your internet connection");
      return;
    }

    if (isLoading || assetTag === lastScannedAssetTag) return;

    setLastScannedAssetTag(assetTag);
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("Backend URL is not defined. Please check your environment variables.");
        return;
      }

      if (!assetTag?.trim()) {
        setError({
          title: "Invalid Scan",
          description: "The barcode could not be read properly. Please try scanning again.",
        });
        return;
      }

      const lookupResponse = await fetch(
        `${backendUrl}/api/inventory/lookup/${encodeURIComponent(assetTag.trim())}`,
        { credentials: 'include' }
      );

      if (!lookupResponse.ok) {
        if (lookupResponse.status === 404 || lookupResponse.status === 500) {
          setError({
            title: "Asset Not Found",
            description: `This asset tag ${assetTag} is not registered in the system or there was an error scanning the barcode.`,
          });
          setAssetTagForCreateModal(assetTag); // Set the asset tag for the CreateProductModal
          return;
        }
        throw new Error(`Lookup failed with status: ${lookupResponse.status}`);
      }

      const lookupData = await lookupResponse.json();

      if (!lookupData?.assignment_id) {
        showErrorToast("Error", "No assignment found for this asset");
        return;
      }

      const detailsResponse = await fetch(
        `${backendUrl}/api/inventory/${lookupData.assignment_id}`,
        { credentials: 'include' }
      );

      if (!detailsResponse.ok) {
        throw new Error(`Details fetch failed with status: ${detailsResponse.status}`);
      }

      const equipmentDetails = await detailsResponse.json();

      if (!equipmentDetails) {
        showErrorToast("Error", "Failed to load equipment details");
        return;
      }

      setEquipmentData(equipmentDetails);
      setShowEditModal(true);

    } catch (error) {
      console.error('Scan error:', error);
      showErrorToast("Error", "An unexpected error occurred. Please try again");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, lastScannedAssetTag, showErrorToast, setError, setIsLoading, setLastScannedAssetTag, setEquipmentData, setShowEditModal]);

  // Simplified debouncedHandleScan since we're not using lodash debounce
  const debouncedHandleScan = useCallback((assetTag: string) => {
    handleScan(assetTag);
  }, [handleScan]);

  // effect to handle route changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // This will handle browser/tab closing
      if (document.querySelector('#interactive video')) {
        const videoElements = document.getElementsByTagName('video');
        Array.from(videoElements).forEach((video) => {
          const stream = video.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Clean up when component unmounts
    };
  }, []);

  return (
    <div className="relative min-h-[600px] w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Barcode Scanner</h2>
          <p className="text-sm text-muted-foreground">
            Scan equipment barcodes to view and edit details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => router.push('/inventory')}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)} // Open CreateProductModal directly
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Asset
          </Button>
        </div>
      </div>
      
      {/* Error Dialog */}
      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{error?.title}</DialogTitle>
            <DialogDescription>{error?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => {
                setError(null);
                router.push('/inventory');
              }}
              className="w-full"
            >
              Back to Inventory
            </Button>
            <Button
              onClick={() => {
                setError(null);
                setShowCreateModal(true); // Open the CreateProductModal
              }}
              className="w-full"
            >
              Create New Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Scanner Container */}
      <div className="relative bg-background rounded-lg">
        <BarcodeScanner
          onScan={debouncedHandleScan} // Pass the debounced function
          disabled={isLoading || showEditModal} // Disable scanner when loading or editing
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-md shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm font-medium">Loading equipment details...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      <Dialog 
        open={showEditModal} 
        onOpenChange={(open) => {
          if (!open) handleModalClose();
        }}
      >
        <DialogContent className="max-w-2xl" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          {equipmentData && (
            <EditProductModal
              equipment={equipmentData}
              onClose={handleModalClose}
              onUpdate={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Product Modal */}
<Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
  <CreateProductModal
    onClose={() => {
      setShowCreateModal(false);
      setAssetTagForCreateModal(null); 
    }}
    onCreate={async () => {
      setShowCreateModal(false);
      setAssetTagForCreateModal(null); 
      return Promise.resolve(); 
    }}
    initialAssetTag={assetTagForCreateModal || undefined}
  />
</Dialog>
    </div>
  );
};

export default BarcodeScannerWrapper;