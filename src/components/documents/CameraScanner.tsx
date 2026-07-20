import { useEffect, useRef, useState, useCallback } from "react";
import jscanify from "jscanify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Camera, X, Check, ImagePlus, RotateCcw, Loader2 } from "lucide-react";

interface CameraScannerProps {
  onPagesCaptured: (pages: string[]) => void; // data URLs (JPEG)
  onClose: () => void;
}

// Load OpenCV.js from CDN once
let opencvPromise: Promise<void> | null = null;
function loadOpenCv(): Promise<void> {
  if (opencvPromise) return opencvPromise;
  opencvPromise = new Promise((resolve, reject) => {
    if ((window as any).cv && (window as any).cv.Mat) return resolve();
    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.10.0/opencv.js";
    script.async = true;
    script.onload = () => {
      const check = () => {
        if ((window as any).cv && (window as any).cv.Mat) resolve();
        else setTimeout(check, 100);
      };
      check();
    };
    script.onerror = () => reject(new Error("Impossible de charger OpenCV"));
    document.head.appendChild(script);
  });
  return opencvPromise;
}

export function CameraScanner({ onPagesCaptured, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const scannerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();
  const [ready, setReady] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        try {
          await loadOpenCv();
          scannerRef.current = new (jscanify as any)();
        } catch (e) {
          console.warn("OpenCV indisponible, capture sans détection", e);
        }
        if (!cancelled) {
          setReady(true);
          tick();
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Caméra indisponible",
          description: "Autorise la caméra dans le navigateur ou utilise l'onglet Fichier.",
          variant: "destructive",
        });
        onClose();
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tick = () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    if (video.videoWidth) {
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
      const ctx = overlay.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        if (scannerRef.current) {
          try {
            const highlighted = scannerRef.current.highlightPaper(video);
            ctx.drawImage(highlighted, 0, 0, overlay.width, overlay.height);
            return; // don't schedule until raf callback below
          } catch {
            /* ignore transient errors while frames are not ready */
          }
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  // Restart loop after each highlightPaper
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      if (!capturing) tick();
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, capturing]);

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    setCapturing(true);
    try {
      const targetW = video.videoWidth;
      const targetH = video.videoHeight;
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;

      let resultCanvas: HTMLCanvasElement | null = null;
      if (scannerRef.current) {
        try {
          resultCanvas = scannerRef.current.extractPaper(video, targetW, targetH);
        } catch (e) {
          console.warn("extractPaper failed, fallback to raw frame", e);
        }
      }
      if (resultCanvas) {
        ctx.drawImage(resultCanvas, 0, 0, targetW, targetH);
      } else {
        ctx.drawImage(video, 0, 0, targetW, targetH);
      }
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPages((p) => [...p, dataUrl]);
      toast({ title: "Page capturée", description: `${pages.length + 1} page(s) enregistrée(s).` });
    } finally {
      setCapturing(false);
    }
  };

  const finish = () => {
    if (!pages.length) return;
    stopCamera();
    onPagesCaptured(pages);
  };

  const removeLast = () => setPages((p) => p.slice(0, -1));

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Camera className="text-primary" size={20} />
          <span className="font-semibold">Scanner un document</span>
          {pages.length > 0 && (
            <span className="text-sm text-muted-foreground">— {pages.length} page(s)</span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => { stopCamera(); onClose(); }}>
          <X size={18} />
        </Button>
      </div>

      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-contain" playsInline muted />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80">
            <Loader2 className="animate-spin mr-2" /> Initialisation caméra...
          </div>
        )}
      </div>

      {pages.length > 0 && (
        <div className="border-t p-3 overflow-x-auto">
          <div className="flex gap-2">
            {pages.map((p, i) => (
              <Card key={i} className="relative flex-shrink-0 w-20 h-24 overflow-hidden">
                <img src={p} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">
                  {i + 1}
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-around gap-2 p-3 border-t">
        <Button variant="outline" size="sm" onClick={removeLast} disabled={!pages.length}>
          <RotateCcw size={16} className="mr-1" /> Reprendre
        </Button>
        <Button
          size="lg"
          onClick={capture}
          disabled={!ready || capturing}
          className="rounded-full h-14 w-14 p-0"
        >
          {capturing ? <Loader2 className="animate-spin" /> : <ImagePlus size={22} />}
        </Button>
        <Button variant="default" size="sm" onClick={finish} disabled={!pages.length}>
          <Check size={16} className="mr-1" /> Terminer
        </Button>
      </div>
    </div>
  );
}
