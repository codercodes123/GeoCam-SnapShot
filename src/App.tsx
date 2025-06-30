// App.tsx (React + Tailwind CSS + Clean Single-View UI)
import React, { useState, useEffect, useRef } from 'react';

interface Photo {
  data: string;
}

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => setStream(stream))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
        const timestamp = new Date().toLocaleString();
        navigator.geolocation.getCurrentPosition(position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          ctx.font = '20px Poppins';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`Timestamp: ${timestamp}`, 10, 10);
          ctx.fillText(`Latitude: ${latitude}, Longitude: ${longitude}`, 10, 40);
          const data = canvasRef.current!.toDataURL();
          setPhoto({ data });
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">📸 GeoCam Snapshot App</h1>

      <div className="rounded-lg shadow-2xl overflow-hidden border-4 border-white">
        <video
          ref={videoRef}
          autoPlay
          className="rounded-lg w-[640px] h-[480px] object-cover"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="hidden"
        />
      </div>

      <button
        onClick={handleCapture}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
      >
        📷 Capture Snapshot
      </button>

      {photo && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold mb-4">🖼️ Captured Snapshot</h2>
          <img
            src={photo.data}
            alt="Captured scene"
            className="rounded-lg shadow-xl border-4 border-white max-w-full"
          />
        </div>
      )}
    </div>
  );
}

export default App;
