import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const BACKEND_URL = 'https://glitchlab.warpzone.workers.dev';

const ImageResult = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [status, setStatus] = useState('Menunggu proses generate...');
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setStatus('❌ Order ID tidak ditemukan di URL.');
      setIsLoading(false);
      return;
    }

    const pollForImage = async (maxAttempts = 20, interval = 3000) => {
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const response = await fetch(`${BACKEND_URL}/generate-image?order_id=${orderId}`);

          if (response.ok) {
            const imageBlob = await response.blob();
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);
            setStatus('✅ Gambar berhasil dibuat!');
            setIsLoading(false);
            return;
          }

          if (response.status === 404) {
            console.log(`Attempt ${i + 1}: Gambar belum siap. Coba lagi ${interval / 1000}s...`);
            await new Promise(res => setTimeout(res, interval));
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        } catch (err) {
          console.error('Polling error:', err);
          setError('Gagal mengambil gambar. Silakan coba lagi nanti.');
          setIsLoading(false);
          return;
        }
      }

      setStatus('❌ Gagal Membuat Gambar');
      setError(`Order ID: ${orderId}`);
      setIsLoading(false);
    };

    pollForImage();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-6 bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold">{status}</h1>

        {isLoading && (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg border border-slate-700"
            />
            <p className="text-green-300 text-sm mt-4">Klik kanan & simpan gambar jika perlu.</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>}
      </div>
    </div>
  );
};

export default ImageResult;
