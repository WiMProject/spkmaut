const ProgressBar = ({ value, max = 100, color = "blue" }) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    red: "bg-red-500"
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full ${colorClasses[color]} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;