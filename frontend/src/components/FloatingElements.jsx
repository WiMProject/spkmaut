const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce-slow"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-bounce-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 right-32 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default FloatingElements;