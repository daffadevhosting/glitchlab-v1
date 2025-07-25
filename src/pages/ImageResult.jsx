import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, ImageDown, Dna } from "lucide-react";

const BACKEND_URL = 'https://glitchlab.warpzone.workers.dev';

export default function ImageResult() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [status, setStatus] = useState('🕒 Memproses gambar...');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      if (!orderId) {
        setError('❌ Order ID tidak ditemukan di URL.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/generate-image?order_id=${orderId}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Gagal: ${text}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setStatus('✅ Gambar berhasil dibuat!');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [orderId]);

  const handleDownload = async () => {
    if (!imageUrl) return;

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `glitchlab-${orderId}.png`;
    a.click();

    // Hapus dari server
    try {
      await fetch(`${BACKEND_URL}/delete-image?order_id=${orderId}`, {
        method: 'DELETE',
      });
      console.log('✅ Gambar dihapus dari server.');
    } catch (err) {
      console.warn('⚠️ Gagal menghapus gambar dari server.');
    }
  };

  return (
<>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-900 shadow-xl rounded-2xl p-6 border border-gray-700 text-center">
        <h1 className="text-3xl flex justify-center gap-2 items-center font-bold mb-2"><ImageDown className='w-8 h-8' /> Hasil Gambar AI</h1>
        <p className="text-gray-400 mb-4">{status}</p>

        {isLoading && (
          <div className="animate-pulse text-sm text-gray-400">Sedang diproses...</div>
        )}

        {error && (
          <div className="text-red-400 text-sm mb-4">{error}</div>
        )}

        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt="AI Generated"
              className="rounded-lg w-full object-cover mb-4 border border-gray-700"
            />
<div className='flex justify-center'>
            <button
              onClick={handleDownload}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 flex gap-2 items-center transition px-4 py-2 rounded-lg font-medium"
            >
              <Download /> Download Gambar
            </button>
</div>
          </>
        )}
      </div>
    </div>
    <footer className="bg-slate-900 border-t border-slate-800 py-10">
        <div className="container mx-auto px-6 text-center text-slate-400">
            <p>&copy; 2025 GlitchLab. Dibuat dengan imajinasi.</p>
        </div>
    </footer>
</>
  );
}
