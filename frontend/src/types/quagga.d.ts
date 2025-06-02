declare module '@ericblade/quagga2' {
  export interface QuaggaConfig {
    inputStream: {
      name?: string;
      type?: string;
      target?: HTMLElement | null;
      constraints?: {
        width?: number;
        height?: number;
        facingMode?: string;
      };
      area?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
      };
    };
    decoder?: {
      readers?: string[];
      debug?: {
        drawBoundingBox?: boolean;
        showFrequency?: boolean;
        drawScanline?: boolean;
        showPattern?: boolean;
        showCanvas?: boolean;
      };
    };
    locate?: boolean;
    numOfWorkers?: number;
  }

  export interface QuaggaResult {
    codeResult: {
      code: string;
      format: string;
    };
  }

  export interface Quagga {
    init(config: QuaggaConfig, callback?: (err?: Error) => void): void;
    start(): void;
    stop(): void;
    onDetected(callback: (result: QuaggaResult) => void): void;
    offDetected(callback: (result: QuaggaResult) => void): void;
    decodeSingle(config: QuaggaConfig, callback: (result: QuaggaResult) => void): void;
  }

  const Quagga: Quagga;
  export default Quagga;
}