import BarcodeScannerWrapper from '@/app/components/Scanner/BarcodeScannerWrapper'

// This component is the main page for scanning equipment.
export default function ScanPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
  <h1 className="text-2xl font-bold mb-4">Scan Equipment</h1>
  <BarcodeScannerWrapper />
</div>
  );
}