import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeneratePage from "./pages/GeneratePages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="*" element={<div className="p-10 text-center text-red-400 font-bold text-xl">404 - Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}
