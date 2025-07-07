import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isFreeUser, setIsFreeUser] = useState(true); // bisa dikaitkan ke auth nanti

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImageUrl(null);

    try {
      const payRes = await fetch("https://glitchlab.warpzone.workers.dev/generator/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await payRes.json();
      if (!data.snap_token || !data.order_id) throw new Error(data.error || "Gagal ambil token pembayaran.");

      const orderId = data.order_id; // simpan ID transaksi

      toast("Membuka jendela pembayaran...", { icon: "💳" });
      localStorage.setItem("last_prompt", prompt); 

      window.snap.pay(data.snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil, generate dimulai...");
          generateImage(prompt, orderId);
        },
        onPending: () => {
          toast("Pembayaran Anda tertunda", { icon: "⏳" });
          setIsLoading(false);
        },
        onError: () => {
          toast.error("Pembayaran gagal.");
          setIsLoading(false);
        },
        onClose: () => {
          if (!isLoading) toast("Jendela pembayaran ditutup", { icon: "⚠️" });
        }
      });

    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat proses pembayaran.");
      setIsLoading(false);
    }
  };

const generateImage = async (prompt, order_id) => {
  try {
    const finalPrompt = prompt?.trim() || localStorage.getItem("last_prompt");

    if (!finalPrompt) throw new Error("Prompt tidak tersedia. Silakan ulangi.");

    const res = await fetch(`https://glitchlab.warpzone.workers.dev/generate-image?order_id=${order_id}&prompt=${encodeURIComponent(finalPrompt)}`);

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Gagal memproses gambar.");
    }

    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    if (isFreeUser) {
      // Tambah watermark
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.textAlign = "right";
        ctx.fillText("© GlitchLab Free", canvas.width - 20, canvas.height - 20);
        setImageUrl(canvas.toDataURL("image/png"));
        setIsLoading(false);
        toast.success("Gambar berhasil dibuat (gratis)");
      };
      img.src = objectURL;
    } else {
      setImageUrl(objectURL);
      toast.success("Gambar berhasil dibuat!");
      setIsLoading(false);
    }

    localStorage.removeItem("last_prompt");

  } catch (err) {
    toast.error(err.message || "Gagal generate gambar.");
    setIsLoading(false);
  }
};

  return (
    <>
    <header className="absolute top-0 left-0 w-full z-10 p-6 md:p-8">
        <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">GlitchLab</Link>
            <Link to="/" className="hidden md:inline-block bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-full hover:bg-white/20 transition-colors duration-300">
                Kembali ke Beranda
            </Link>
        </nav>
    </header>

    <main className="container mx-auto px-6 pt-28 pb-16">
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* FORM */}
        <div className="flex flex-col space-y-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black">
              Mulai <span className="bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">Menciptakan</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Masukkan deskripsi gambar, lakukan pembayaran, dan biarkan AI bekerja.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-300 mb-2">
                  Deskripsi Gambar (Prompt)
                </label>
                <textarea
                  id="prompt-input"
                  rows={3}
                  required
                  className="w-full border-slate-600 rounded-lg px-4 py-3 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Contoh: Seekor astronot kucing mengendarai motor di bulan, gaya sinematik..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-bold px-6 py-4 rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span>Memproses...</span>
                    <svg className="w-5 h-5 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </>
                ) : (
                  <span>Bayar Rp 2.500 & Generate</span>
                )}
              </button>
            </form>
          </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Informasi Penting</h2>
                    <div className="space-y-6 text-slate-400">
                        <div>
                            <h3 className="font-semibold text-slate-200 mb-1">💡 FAQ</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Berapa biaya per gambar?</strong> Rp 2.500 perak untuk satu kali proses generate.</li>
                                <li><strong>Berapa lama prosesnya?</strong> Setelah pembayaran berhasil, gambar akan diproses dalam 10-30 detik.</li>
                                <li><strong>Apakah bisa refund?</strong> Tidak, karena layanan bersifat digital dan instan setelah pembayaran.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-200 mb-1">📜 Ketentuan Layanan</h3>
                            <p className="text-sm">
                                Dengan menggunakan layanan ini, Anda setuju untuk tidak menggunakan gambar untuk konten ilegal, kekerasan, atau SARA. Kami berhak menolak prompt yang melanggar kebijakan.
                            </p>
                        </div>
                    </div>
                </div>
        </div>

        {/* PREVIEW */}
        <div className="lg:sticky lg:top-28 h-full">
          <h2 className="text-2xl font-bold mb-4">Hasil Gambar Anda</h2>
          <div className="relative w-full aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
            {!imageUrl ? (
              <div className="text-center text-slate-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 font-semibold">Gambar Anda akan muncul di sini</p>
              </div>
            ) : (
              <img src={imageUrl} alt="Hasil Gambar AI" className="w-full h-full object-cover" />
            )}
          </div>

          {imageUrl && (
            <Link
              to={imageUrl}
              download="glitchlab_result.png"
              className="block mt-4 bg-green-600 text-white text-base font-bold px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 text-center"
            >
              Unduh Gambar
            </Link>
          )}
        </div>
      </div>
    </main>

    <footer className="bg-slate-900 border-t border-slate-800 py-10">
        <div className="container mx-auto px-6 text-center text-slate-400">
            <p>&copy; 2025 GlitchLab. Dibuat dengan imajinasi.</p>
        </div>
    </footer>
    </>
  );
}
