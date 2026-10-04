import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Camera, X, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Eye, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_RATION_CARDS } from '../constants';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (cardNumber: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDemoCard, setSelectedDemoCard] = useState<string | null>(null);
  const [cameraPermissionState, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera stream on unmount or close
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanStatus('idle');
      setSelectedDemoCard(null);
      setUseCamera(false);
    }
  }, [isOpen]);

  // Hook up video ref when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, useCamera]);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      stopCamera();
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      setUseCamera(true);
      setCameraPermissionState('granted');
      startScanningProcess();
    } catch (err: any) {
      console.warn("Camera access failed (no physical camera device was detected in this platform/sandbox):", err.message || err);
      setCameraPermissionState('denied');
      setUseCamera(false);
      setErrorMessage(
        err.name === 'NotAllowedError' 
          ? "Camera permission was denied. Please allow camera access in your browser or use the interactive QR Simulator below."
          : `Physical camera not found (${err.message || 'Requested device not found'}). No worries! We have optimized this preview to support interactive digital QR card simulation below.`
      );
      // Fallback to simulation mode automatically
      startScanningProcess();
    }
  };

  const startScanningProcess = () => {
    setScanStatus('scanning');
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

    // Simulate standard scanning focus time
    scanTimerRef.current = setTimeout(() => {
      // If user selected a demo card, authenticate with it
      if (selectedDemoCard) {
        setScanStatus('success');
        // trigger the authentication sequence
        setTimeout(() => {
          onScanSuccess(selectedDemoCard);
          onClose();
        }, 1500);
      } else {
        // Automatically default to the head customer card for convenience if none chosen
        const defaultCard = MOCK_RATION_CARDS[0].cardNumber;
        setSelectedDemoCard(defaultCard);
        setScanStatus('success');
        setTimeout(() => {
          onScanSuccess(defaultCard);
          onClose();
        }, 1500);
      }
    }, 3500);
  };

  const triggerMockScan = (cardNumber: string) => {
    setSelectedDemoCard(cardNumber);
    setScanStatus('scanning');
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    
    scanTimerRef.current = setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => {
        onScanSuccess(cardNumber);
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Physical Ration Scanner</h3>
                <p className="text-xs text-gray-400 font-medium font-mono">Digital Authenticator v3.2</p>
              </div>
            </div>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scanner Viewfinder Area */}
          <div className="p-8 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] bg-emerald-950 rounded-3xl overflow-hidden flex items-center justify-center border-4 border-emerald-900 shadow-inner">
              
              {/* Camera Live Feed */}
              {useCamera && stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Holographic Simulator Grid */
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-emerald-950 to-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(16,185,129,0.05)_1px,_transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] animate-pulse" />
                  
                  {scanStatus === 'idle' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4 z-10"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Camera className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-emerald-400/90 tracking-wide">
                        Camera streaming or visual simulation ready
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Viewfinder Reticle Framing */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-64 h-64 border-2 border-emerald-400/30 rounded-3xl flex items-center justify-center">
                  
                  {/* Top-Left Corner */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  {/* Top-Right Corner */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  {/* Bottom-Left Corner */}
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  {/* Bottom-Right Corner */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                  {/* Horizontal Scan Laser Line */}
                  {scanStatus === 'scanning' && (
                    <motion.div
                      animate={{ 
                        top: ['10%', '90%', '10%'],
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute left-4 right-4 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] z-20"
                    />
                  )}

                  {/* QR Card Center Graphic */}
                  <QrCode className={cn(
                    "w-24 h-24 transition-all duration-500",
                    scanStatus === 'scanning' ? "text-emerald-400/20 animate-pulse scale-95" :
                    scanStatus === 'success' ? "text-emerald-400 scale-110 rotate-12" : "text-emerald-500/40"
                  )} />

                  {/* Scanning Status HUD overlay */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-black shadow-md border",
                      scanStatus === 'scanning' ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30 animate-pulse" :
                      scanStatus === 'success' ? "bg-emerald-900/90 text-emerald-300 border-emerald-400" :
                      "bg-black/40 text-gray-400 border-gray-800"
                    )}>
                      {scanStatus === 'scanning' ? 'LOCKING TARGET...' :
                       scanStatus === 'success' ? 'VALID RATION DECODED' : 'READY TO STREAM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Overlay Screen */}
              {scanStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-6 text-center z-30"
                >
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                    <CheckCircle2 className="w-10 h-10 text-white animate-bounce" />
                  </div>
                  <h4 className="text-xl font-black text-white tracking-tight">Authentication Approved</h4>
                  <p className="text-xs text-emerald-400 font-mono mt-1">Ration Card: {selectedDemoCard}</p>
                  
                  {/* Digital Signature Ring animation */}
                  <div className="w-24 h-24 border-4 border-dashed border-emerald-500/30 rounded-full absolute animate-spin duration-1000" />
                </motion.div>
              )}
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="mt-6 w-full bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Action buttons controls */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
              {!useCamera ? (
                <button
                  onClick={startCamera}
                  className="flex-1 py-4 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-950/10 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Use Web Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="xl:flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restart Camera
                </button>
              )}

              {scanStatus === 'idle' && (
                <button
                  onClick={() => triggerMockScan(selectedDemoCard || MOCK_RATION_CARDS[0].cardNumber)}
                  className="flex-1 py-4 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Simulate QR Scan
                </button>
              )}
            </div>
          </div>

          {/* Quick Demo Scan Barcode/QR targets */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 rounded-b-[2.5rem] text-left">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Demo QR Targets (Test cards in range)</h4>
            </div>
            <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">
              Place one of these valid Tamil Nadu digital cards in front of the scanner or tap to immediately trigger the simulated authentication loop:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_RATION_CARDS.map(card => (
                <button
                  key={card.cardNumber}
                  onClick={() => {
                    setSelectedDemoCard(card.cardNumber);
                    triggerMockScan(card.cardNumber);
                  }}
                  className={cn(
                    "p-4 bg-white border rounded-2xl text-left transition-all hover:border-emerald-500 active:scale-95 flex items-center gap-3 shadow-sm",
                    selectedDemoCard === card.cardNumber ? "border-emerald-600 bg-emerald-50" : "border-gray-100"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-800 text-xs truncate">{card.headOfFamily}</p>
                    <p className="text-[10px] font-mono font-bold text-gray-400 tracking-wider">No: {card.cardNumber}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
