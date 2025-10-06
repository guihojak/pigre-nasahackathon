import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Cpu, 
  Gauge, 
  RotateCcw, 
  Globe, 
  BarChart3,
  Settings,
  AlertTriangle,
  Wifi,
  Signal
} from "lucide-react";

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavBar({ activeSection, onSectionChange }: NavBarProps) {
  const [systemStatus] = useState({
    reactorOnline: true,
    energyLevels: 78,
    robotsActive: 5,
    isruConnected: true,
    signalStrength: 85,
  });

  const navItems = [
    { id: "dashboard", label: "CONTROL", icon: Home },
    { id: "reactor", label: "REACTOR", icon: Cpu },
    { id: "energy", label: "POWER", icon: Gauge },
    { id: "isru", label: "ISRU", icon: Globe },
    { id: "reports", label: "REPORTS", icon: BarChart3 },
  ];

  return (
    // Usa o fundo do console e a sombra customizada.
    // bg-slate-900/95 para dar um leve efeito de vidro fosco (backdrop-blur-sm)
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-accent/20 shadow-console font-technical sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Mission Patch and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {/* O Patch agora usa o acento ciano e o pulso verde, mais técnico */}
              <div className="w-10 h-10 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center shadow-active">
                <Cpu className="h-5 w-5 text-accent animate-pulse-slow" /> 
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-accent uppercase tracking-widest leading-none">PIGRE-MC</h1>
              <p className="text-xs font-mono text-success tracking-tight leading-none">ALPHA COMMAND • SOL 892</p>
            </div>
          </div>

          {/* Navigation Controls (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  // Botões mais planos e com foco na cor de acento (accent)
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    flex items-center space-x-2 transition-all duration-200 font-mono text-xs uppercase tracking-widest p-2 h-auto
                    ${isActive 
                      // Estado Ativo: Borda de acento e fundo sutil
                      ? "bg-accent/10 text-accent shadow-accent border-b-2 border-accent hover:bg-accent/20" 
                      // Estado Inativo: Texto muted e levemente opaco
                      : "text-muted-foreground hover:bg-accent/10 hover:text-accent border-b-2 border-transparent"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {/* Settings Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:bg-accent/10 hover:text-accent ml-4"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* System Status Panel (Desktop) */}
          <div className="hidden sm:flex items-center space-x-4 border-l border-accent/20 pl-4">
            
            {/* Connection Status (PULSE/Online) */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-success uppercase">LINK</span>
              <Wifi className="h-4 w-4 text-success" />
              <div className="w-2 h-2 rounded-full bg-success shadow-active animate-console-blink"></div>
            </div>

            {/* Signal Strength */}
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono text-muted-foreground">SIG:</span>
              <span className={`text-xs font-mono font-bold ${
                systemStatus.signalStrength > 70 ? "text-success" : 
                systemStatus.signalStrength > 40 ? "text-warning" : "text-destructive"
              }`}>
                {systemStatus.signalStrength}%
              </span>
            </div>

            {/* Power Status */}
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono text-muted-foreground">PWR:</span>
              <span className={`text-xs font-mono font-bold ${
                systemStatus.energyLevels > 50 ? "text-success" : "text-warning"
              }`}>
                {systemStatus.energyLevels}%
              </span>
              <Gauge className={`h-4 w-4 ${
                systemStatus.energyLevels > 50 ? "text-success" : "text-warning"
              }`} />
            </div>

            {/* Alert Indicator (Critical State) */}
            {!systemStatus.reactorOnline && (
              <AlertTriangle className="h-5 w-5 text-critical animate-console-blink shadow-critical" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-accent/20">
        {/* Mobile Nav Links */}
        <div className="grid grid-cols-3 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full justify-center flex-col h-14 font-mono text-xs uppercase tracking-tight
                  ${isActive 
                    ? "bg-accent/10 text-accent border border-accent/50 shadow-console" 
                    : "text-muted-foreground/80 hover:bg-accent/10 hover:text-accent"
                  }
                `}
              >
                <Icon className="h-4 w-4 mb-1" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        {/* Mobile Status Bar */}
        <div className="px-4 py-2 flex items-center justify-between text-xs font-mono border-t border-accent/20 bg-slate-900/50">
          <p className="text-accent tracking-widest font-bold">PIGRE STATUS</p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">PWR:</span>
              <span className={`font-bold ${
                systemStatus.energyLevels > 50 ? "text-success" : "text-warning"
              }`}>{systemStatus.energyLevels}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">SIG:</span>
              <span className={`font-bold ${
                systemStatus.signalStrength > 70 ? "text-success" : "text-warning"
              }`}>{systemStatus.signalStrength}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-success animate-console-blink"></div>
              <span className="text-success">ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
