# 🚀 GlitchLab - AI Text-to-Image Generator with Pay-Per-Use

Ubah teks jadi karya seni menakjubkan hanya dengan satu klik.  
GlitchLab adalah aplikasi AI generatif berbasis Cloudflare Workers yang memungkinkan siapa pun menciptakan gambar hanya dengan mendeskripsikannya — dan cukup bayar **Rp 2.500 per generate**.

![preview](./public/download (1).png)

---

## ✨ Fitur Unggulan

- 🎨 **Text to Image Generation** dengan Stable Diffusion XL
- 💳 **Integrasi Midtrans Snap** untuk pembayaran sekali pakai (Pay per use)
- 🌐 **Tanpa Login? Bisa!** — Coba gratis 1x per bulan untuk anonim
- ⚡ **Frontend Super Cepat** dengan React + Vite + Tailwind + GSAP
- 🧠 Caching dengan **Cloudflare KV** (hemat biaya & respon kilat)
- 🖼️ **Watermark Otomatis** untuk user gratisan

---

## 💼 Use Case

- Thumbnail YouTube atau blog
- Prompt engineer showcase
- Desain cepat buat ide startup, UI, NFT, dll
- Monetisasi micro-service AI

---

## 🛠️ Teknologi

| Stack        | Detail                              |
|--------------|-------------------------------------|
| Backend      | Cloudflare Workers (Hono.js)        |
| AI Engine    | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |
| Frontend     | React + Vite + Tailwind CSS         |
| Animation    | GSAP ScrollTrigger                  |
| Payment      | Midtrans Snap (Sandbox)             |
| Storage      | Cloudflare KV Cache                 |

---

## 🧪 Cara Coba Lokal

```bash
git clone https://github.com/daffadevhosting/glitchlab-v1
cd glitchlab-v1
npm install
npm run dev
```
Jangan lupa siapkan:

- .dev.vars (Cloudflare)

- Midtrans sandbox key di .env atau Workers environment

- Worker URL dan Snap frontend script (snap.js) di-embed

## 💰 Monetisasi
GlitchLab dibangun untuk Pay-per-Use model:

- 🔓 Gratis 1x per user/bulan

- 💳 Snap Midtrans Rp 2.500 / generate

- 💵 Potensi revenue per 1000 generate = ±Rp 2.500.000

## 🎯 Next Plan (Roadmap)
- Login Anonim + Google (kuota gratis bulanan)

- Mode HD / Fast Rendering

- Histori Generate & Favorit

- Model Custom (Anime, 3D, Poster, dll)

- Pindah AI ke openAI

## 🧠 Credit & License
>Dibangun dengan semangat indie dan semangat belajar.
>AI Model by StabilityAI, Midtrans for payment, React & Cloudflare power the rest.

- MIT License — Silakan fork, bangun ulang, atau jadikan bisnis baru ✨
