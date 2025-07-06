import Hero from "../components/Hero";
import MAUTInfo from "../components/MAUTInfo";

function HomePage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <Hero />
      <MAUTInfo />
    </div>
  );
}

export default HomePage;