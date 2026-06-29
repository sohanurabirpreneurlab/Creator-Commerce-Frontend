import { LandingPage } from "@/components/landing/landing-page";
import { Navbar } from "@/components/layout/navbar";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <LandingPage />
      </main>
    </div>
  );
}

export default App;
