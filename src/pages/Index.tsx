import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import SpaceDashboard from "@/components/SpaceDashboard";
import { MissionReport } from "@/components/MissionReport";
import { Reactor } from "@/components/Reactor";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <SpaceDashboard />;
      case "reports":
        return <MissionReport />;
      case "reactor":
        return <Reactor />;
      case "energy":
      case "robots":
      case "isru":
        return (
          <div className="min-h-screen bg-background p-6">
            <div className="text-center mt-20">
              <h2 className="text-3xl font-bold bg-gradient-space bg-clip-text text-transparent mb-4">
                Módulo {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-muted-foreground text-lg">
                Interface em desenvolvimento - Disponível na próxima versão
              </p>
            </div>
          </div>
        );
      default:
        return <SpaceDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      {renderSection()}
    </div>
  );
};

export default Index;
