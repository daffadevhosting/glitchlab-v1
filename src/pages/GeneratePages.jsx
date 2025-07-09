import React, { useState } from 'react';
import { ImagePlus, Info, NotebookPen, Dna } from "lucide-react";

const BACKEND_URL = "https://glitchlab.warpzone.workers.dev";

const GeneratePages = () => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setStatus('❗ Prompt tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setStatus('🔄 Membuat pesanan...');

    try {
      const response = await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Gagal menghubungi server.');
      }

      const { snap_token } = await response.json();
      setStatus('💳 Membuka jendela pembayaran...');

      window.snap.pay(snap_token, {
        onSuccess: function(result) {
          console.log('Success:', result);
          const redirectUrl = `https://glitch.pages.dev/generate?order_id=${result.order_id}`;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            // fallback jika tidak ada
            window.location.href = `/generate?order_id=${result.order_id}`;
          }
        },
        onPending: function(result) {
          console.log('Pending:', result);
          setStatus('Menunggu pembayaran...');
        },
        onClose: function() {
          alert('Kamu menutup jendela pembayaran sebelum menyelesaikan transaksi.');
        },
        onError: (result) => {
          setStatus('❌ Pembayaran gagal.');
          console.log('Error:', result);
          setIsLoading(false);
        },
        onClose: () => {
          setStatus('❎ Anda menutup jendela pembayaran.');
          setIsLoading(false);
        }
      });
    } catch (error) {
      setStatus(`⚠️ Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
<>
    <header class="absolute top-0 left-0 w-full z-10 p-6 md:p-8">
        <nav class="container mx-auto flex justify-between items-center">
            <a href="/" class="text-2xl font-bold">GlitchLab</a>
            <a href="/" class="hidden md:inline-block bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-full hover:bg-white/20 transition-colors duration-300">
                Kembali ke Beranda
            </a>
        </nav>
    </header>
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto mt-4 space-y-10">
        {/* CARD: FORM */}
        <div className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl flex justify-normal items-center gap-2 font-bold mb-3 text-white"><Dna className='h-10 w-10' /> Generate Gambar dengan AI</h1>
          <p className="text-slate-300 mb-5">Masukkan deskripsi gambar yang Anda inginkan (maks 300 karakter).</p>

          <textarea
            className="w-full h-32 resize-none p-4 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-4"
            placeholder="Contoh: seekor kucing astronot di bulan"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isLoading
                ? 'bg-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-900'
            }`}
          >
            {isLoading ? '⏳ Memproses...' : '💰 Buat Pesanan & Bayar (Rp 2500)'}
          </button>

          {status && (
            <div className="mt-4 text-sm text-blue-300 font-medium whitespace-pre-wrap">
              {status}
            </div>
          )}
        </div>

        {/* CARD: INFO */}
        <div className="bg-white/5 backdrop-blur-md shadow-lg border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex justify-normal items-center gap-2"><Info className='h-8 w-8' /> Informasi Penting</h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="font-semibold text-slate-100 mb-2">💡 FAQ</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Berapa biaya per gambar?</strong> Rp 2500 per proses generate.</li>
                <li><strong>Berapa lama prosesnya?</strong> 10-30 detik setelah pembayaran berhasil.</li>
                <li><strong>Apakah bisa refund?</strong> Tidak, karena ini layanan digital instan.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 mb-2">📜 Ketentuan Layanan</h3>
              <p className="text-sm leading-relaxed">
                Dengan menggunakan layanan ini, Anda menyetujui untuk tidak menggunakan gambar yang dihasilkan untuk konten ilegal, kekerasan, atau SARA. Prompt yang melanggar kebijakan akan ditolak.
              </p>
              <strong className='font-semibold text-amber-400 text-center'>“Prompt akan ditinjau jika melanggar”</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
</>
  );
};

export default GeneratePages;
