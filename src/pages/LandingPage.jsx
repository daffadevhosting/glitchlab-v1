import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus, NotebookPen, Dna } from "lucide-react";

export default function LandingPage() {
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  // Set semua elemen ke opacity: 0 di awal
  gsap.set(".animated-section", { opacity: 0, y: 50 });

  ScrollTrigger.batch(".animated-section", {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    start: "top 85%",
    once: true, // animasi cuma jalan sekali
  });
}, []);

const iconMap = {
  NotebookPen,
  Dna,
  ImagePlus,
};

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-10 p-6 md:p-8">
        <nav className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">GlitchLab</h2>
          <Link
            to="/input"
            className="hidden md:inline-block bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-full hover:bg-white/20 transition-colors duration-300"
          >
            Mulai Mencipta
          </Link>
        </nav>
      </header>

      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-900">
        <div className="relative z-5 container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white hero-element">
            Ubah Teks Menjadi{" "}
            <span className="bg-gradient-to-r from-purple-500 to-indigo-400 text-transparent bg-clip-text">
              Karya Seni
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-6 text-slate-300 hero-element">
            Ciptakan visual yang memukau dari imajinasi Anda. Cukup tuliskan deskripsi, dan biarkan AI kami mewujudkannya dalam hitungan detik.
          </p>
          <div className="mt-10 hero-element">
            <Link
              to="/input"
              className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-10 rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
            >
              ✨ Ciptakan Gambar
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: 3 Langkah */}
      <section className="py-20 md:py-32 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animated-section">Sederhana. Cepat. Memukau.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-16 animated-section">
            Hanya dalam tiga langkah mudah, ide Anda menjadi nyata.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {/* Step Cards */}
            {[
              {
                title: "1. Deskripsikan",
                desc: "Tulis prompt atau deskripsi detail tentang gambar yang Anda inginkan.",
                icon: "NotebookPen",
              },
              {
                title: "2. Generate",
                desc: "AI kami akan menganalisis teks Anda dan menciptakan beberapa opsi gambar unik.",
                icon: "Dna",
              },
              {
                title: "3. Sempurnakan",
                desc: "Pilih, unduh, atau kembangkan lagi gambar favorit Anda dengan kualitas tinggi.",
                icon: "ImagePlus",
              },
            ].map((step, idx) => {
              const Icon = iconMap[step.icon]; // Ambil komponen ikon

              return (
                <div key={idx} className="bg-slate-800/50 p-8 rounded-2xl animated-section">
                  <div className="flex justify-center mb-4">
                    <Icon className="w-16 h-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Galeri */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 animated-section">Galeri Tanpa Batas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              "c3f04bc1", "b529aefa", "7b080111", "643d4c46",
              "ab8cfbb6", "258cafa1", "41915cbc", "c11ac1c8"
            ].map((id, idx) => (
              <div key={idx} className="overflow-hidden rounded-xl aspect-square animated-section">
                <img
                  src={`/public/glitchlab-glitch-${id}.png`}
                  alt="AI gallery item"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Akhir */}
      <section className="py-20 md:py-32 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto animated-section">
            Siap Mengubah Imajinasi Menjadi Realita?
          </h2>
          <p className="text-slate-400 mt-4 mb-10 max-w-xl mx-auto animated-section">
            Bergabunglah dengan ribuan kreator dan mulailah proyek visual Anda berikutnya hari ini.
          </p>
          <div className="animated-section">
            <Link
              to="/input"
              className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-10 rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Gratis Mencoba
            </Link>
          </div>
        </div>
      </section>

    <footer className="bg-slate-900 border-t border-slate-800 py-10">
        <div className="container mx-auto px-6 text-center text-slate-400">
            <p>&copy; 2025 GlitchLab. Dibuat dengan imajinasi.</p>
        </div>
    </footer>
    </>
  );
}
