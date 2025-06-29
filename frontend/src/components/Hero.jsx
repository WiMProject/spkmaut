import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Sistem Pendukung Keputusan MAUT",
      subtitle: "Multi-Attribute Utility Theory untuk Pemilihan Ketua Organisasi",
      gradient: "from-blue-600 via-purple-600 to-indigo-600",
      icon: "🎯"
    },
    {
      title: "Keputusan Objektif & Terukur",
      subtitle: "Evaluasi kandidat berdasarkan kriteria yang telah ditentukan",
      gradient: "from-green-500 via-teal-500 to-blue-500",
      icon: "📊"
    },
    {
      title: "Interface Modern & User-Friendly",
      subtitle: "Mudah digunakan dengan hasil yang akurat dan transparan",
      gradient: "from-purple-500 via-pink-500 to-red-500",
      icon: "✨"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center h-full px-16">
            <div className="text-white max-w-2xl animate-slideUp">
              <div className="text-8xl mb-6 animate-bounce-slow">{slide.icon}</div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">{slide.title}</h1>
              <p className="text-2xl text-white/90 leading-relaxed">{slide.subtitle}</p>
              <div className="mt-8">
                <div className="w-40 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="hidden lg:block ml-auto animate-pulse-slow">
              <div className="w-150 h-95 glass rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{slide.icon}</div>
                  <span className="text-white/80 text-lg font-medium">Visual Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-16 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
              index === currentSlide 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;