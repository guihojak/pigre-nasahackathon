import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, TrendingUp, Gauge, RotateCcw, Flame, Wrench, Download, FileText, Stamp, Zap } from "lucide-react";

// --- SHADCN/UI & Custom Components Mockup (Assumed structure for single file) ---

// Assuming Card, Badge, and Button are standard components or inline styled with Tailwind
const Card = ({ children, className }) => <div className={`rounded-xl border p-4 backdrop-blur-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`flex flex-col space-y-1.5 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={className}>{children}</div>;
const Badge = ({ children, className }) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;
const Button = ({ children, className, variant = 'default' }) => {
  let baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  if (variant === 'outline') {
    baseClasses += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else {
    baseClasses += " text-primary-foreground";
  }
  return <button className={`${baseClasses} ${className}`}>{children}</button>;
};

// --- Main Component ---

export function MissionReport() {
  const missionStats = {
    wasteProcessed: 11847,
    energySaved: 23.5,
    fuelProduced: 2340,
    partsCreated: 1456,
    co2Converted: 890,
    efficiency: 94.0,
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate mission duration in Sol/Days for dynamic display
  const missionStart = new Date('2022-03-01');
  const missionEnd = new Date();
  const diffTime = Math.abs(missionEnd.getTime() - missionStart.getTime());
  // Average Sol duration is 24 hours 39 minutes 35.244 seconds (approx 1.0275 Earth days)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffSols = Math.round(diffDays / 1.0275);
  const missionDurationDisplay = `${diffSols} SOLS (${diffDays} EARTH DAYS)`;

  return (
    <div className="min-h-screen bg-gradient-mission font-technical text-foreground p-4 sm:p-6">
      
      {/* Official Header - Top Data Strip 
          AJUSTADO: top-0 mudou para top-[3.5rem] (h-14) para começar logo abaixo da NavBar.
          Aumentei o z-index para z-40 (NavBar é z-50) para garantir que ele sobreponha o conteúdo, mas não a NavBar.
      */}
      <div className="sticky top-[3.5rem] z-40 border-b-2 border-accent/50 bg-gradient-technical p-4 sm:p-6 shadow-console backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              {/* Mission Icon/Logo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-technical border-2 border-success/70 rounded-full flex items-center justify-center shadow-active flex-shrink-0">
                <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-success animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-success uppercase">
                  MISSION STATUS REPORT
                </h1>
                <p className="text-xs sm:text-sm font-mono text-accent/80 mt-0.5">
                  PLANETARY IN-SITU GREEN RESOURCE EXTRACTION (PIGRE)
                </p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-mono text-muted-foreground">CLASSIFICATION LEVEL</div>
              <Badge className="bg-success/20 text-success border-success/30 font-mono text-sm shadow-md mt-1">
                MISSION SUCCESS
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono border-t border-border/50 pt-2">
            <div>
              <div className="text-muted-foreground mb-1">MISSION DESIGNATION</div>
              <div className="text-foreground font-bold text-sm">MARS-ALPHA-PIGRE-001</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">MISSION DURATION</div>
              <div className="text-foreground font-bold text-sm">{missionDurationDisplay}</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-muted-foreground mb-1">DATA VALIDATION</div>
              <div className="text-success font-bold text-sm">LEVEL 4/A APPROVED</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">COMPLETION DATE</div>
              <div className="text-foreground font-bold text-sm">{currentDate.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Mission Status Overview - EXECUTIVE SUMMARY */}
        <div className="mb-10">
          <div className="text-lg font-mono text-accent uppercase tracking-wider border-b border-accent/50 pb-2 mb-6">
            // EXECUTIVE SUMMARY 
          </div>
          
          <Card className="bg-gradient-technical border-success/50 shadow-console p-6 sm:p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 mb-4">
                  <Shield className="h-8 w-8 text-success" />
                  <span className="text-3xl font-mono font-extrabold text-success uppercase tracking-widest">
                    PIGRE OBJECTIVES MET
                  </span>
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <p className="text-sm font-mono text-foreground max-w-3xl mx-auto leading-relaxed border-t border-b border-border/50 py-3 mt-4">
                  PIGRE SYSTEM SUCCESSFULLY PROCESSED **${missionStats.wasteProcessed.toLocaleString()} KG** OF GENERATED WASTE OVER THE MISSION PERIOD,
                  EXCEEDING ALL BASELINE EFFICIENCY TARGETS AND ESTABLISHING NEW PROTOCOLS
                  FOR SUSTAINABLE CLOSED-LOOP MARS OPERATIONS.
                </p>
              </div>

              {/* High-Level Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="EFFICIENCY RATING" 
                  value={`${missionStats.efficiency.toFixed(1)}%`} 
                  subtitle="TARGET: 85.0%"
                  icon={<Gauge className="h-6 w-6 text-success" />}
                  color="text-success"
                />
                <StatCard 
                  title="ENERGY REGENERATED" 
                  value={`${missionStats.energySaved.toFixed(1)}%`} 
                  subtitle="SAVINGS VS. BASELINE"
                  icon={<Zap className="h-6 w-6 text-warning" />}
                  color="text-warning"
                />
                <StatCard 
                  title="FUEL PRODUCED" 
                  value={`${(missionStats.fuelProduced / 1000).toFixed(2)}K L`} 
                  subtitle="METHANE/OXYGEN"
                  icon={<Flame className="h-6 w-6 text-accent" />}
                  color="text-accent"
                />
                <StatCard 
                  title="MATERIALS RECOVERED" 
                  value={`${(missionStats.partsCreated / 1000).toFixed(2)}T`} 
                  subtitle="RECYCLATE MASS"
                  icon={<Wrench className="h-6 w-6 text-primary" />}
                  color="text-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications & Module Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DetailCard 
            title="PERFORMANCE METRICS" 
            icon={<TrendingUp className="h-4 w-4 text-success" />}
          >
            <DetailItem label="WASTE PROCESSED (TOTAL)" value={`${missionStats.wasteProcessed.toLocaleString()} KG`} color="text-success" />
            <DetailItem label="BASELINE EFFICIENCY TARGET" value="85.0%" color="text-muted-foreground" />
            <DetailItem label="ACHIEVED EFFICIENCY" value={`94.0% (+9.0% Deviation)`} color="text-success" highlight />
            <DetailItem label="ENERGY CONSUMPTION/KG" value="2.1 kWh (-16% Delta)" color="text-success" />
            <DetailItem label="SYSTEM UPTIME" value="98.2% (12,000+ Hours)" color="text-success" />
          </DetailCard>

          <DetailCard 
            title="MODULE PERFORMANCE" 
            icon={<RotateCcw className="h-4 w-4 text-accent" />}
          >
            <ModuleItem name="MODULAR REACTOR" badgeText="98.2% UPTIME" badgeColor="bg-success/20 text-success border-success/30" />
            <ModuleItem name="ENERGY BANK SYSTEM" badgeText="96.7% EFFICIENCY" badgeColor="bg-warning/20 text-warning border-warning/30" />
            <ModuleItem name="ROBOT SWARM (5 UNITS)" badgeText="100% OPERATIONAL" badgeColor="bg-primary/20 text-primary border-primary/30" />
            <ModuleItem name="ISRU INTEGRATION" badgeText="92.1% CONVERSION" badgeColor="bg-accent/20 text-accent border-accent/30" />
            <ModuleItem name="MAINTENANCE EVENTS" badgeText="12 SCHEDULED (0 UNPLANNED)" badgeColor="bg-muted-foreground/20 text-foreground border-border/30" />
          </DetailCard>
        </div>

        {/* Official Certification */}
        <div className="mb-10">
          <Card className="bg-gradient-technical border-primary/50 shadow-console p-6 sm:p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="text-base font-mono text-primary uppercase tracking-wider border-b border-primary/50 pb-2 mb-4">
                  MISSION CERTIFICATION & SIGN-OFF
                </div>
                <p className="text-sm font-mono text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  THIS REPORT CERTIFIES THAT THE PIGRE SYSTEM HAS SUCCESSFULLY COMPLETED
                  ALL PRIMARY AND SECONDARY OBJECTIVES FOR MARS ALPHA MISSION. ALL DATA
                  LOGS HAVE BEEN VERIFIED, TIMESTAMPED, AND APPROVED FOR EARTH TRANSMISSION
                  BY MARS ALPHA BASE CONTROL.
                </p>
              </div>

              {/* Signatures/Approvals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SignOffCard title="MISSION DIRECTOR" name="DR. SARAH CHEN" iconColor="text-success" />
                <SignOffCard title="SYSTEMS ENGINEER" name="ALEX RODRIGUEZ" iconColor="text-primary" />
                <SignOffCard title="FLIGHT DIRECTOR" name="M. NAKAMURA" iconColor="text-accent" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-success hover:bg-success/80 text-background font-mono shadow-md transition-all hover:scale-[1.02] border-2 border-success/30">
                  <Download className="h-4 w-4 mr-2" />
                  DOWNLOAD OFFICIAL REPORT
                </Button>
                <Button 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent/10 font-mono transition-all hover:scale-[1.02] bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  TECHNICAL APPENDIX (LOGS)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components for Cleanliness ---

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className="text-center p-4 border border-border/50 rounded-lg bg-gradient-technical shadow-md transition-transform hover:scale-[1.01] duration-300">
    <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
    <div className={`text-2xl sm:text-3xl font-mono font-bold mb-1 ${color}`}>{value}</div>
    <div className="text-xs font-mono text-muted-foreground">{title}</div>
    <div className="text-[10px] font-mono text-muted-foreground mt-1 text-primary/70">{subtitle}</div>
  </div>
);

const DetailCard = ({ title, icon, children }) => (
  <Card className="bg-gradient-technical border-border shadow-console h-full">
    <CardHeader className="pb-3 border-b border-border/50 mb-4">
      <CardTitle className="text-sm font-mono text-foreground uppercase tracking-wider flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="">
      <div className="space-y-2 font-mono text-xs">
        {children}
      </div>
    </CardContent>
  </Card>
);

const DetailItem = ({ label, value, color, highlight = false }) => (
  <div className={`flex justify-between items-center py-2 ${!highlight ? 'border-b border-border/30' : 'border-b-2 border-success/50 font-bold'}`}>
    <span className="text-muted-foreground">{label}</span>
    <span className={`${color}`}>{value}</span>
  </div>
);

const ModuleItem = ({ name, badgeText, badgeColor }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/30">
    <span className="text-muted-foreground">{name}</span>
    <Badge className={`${badgeColor} font-mono text-[10px] uppercase shadow-inner`}>
      {badgeText}
    </Badge>
  </div>
);

const SignOffCard = ({ title, name, iconColor }) => (
  <div className="text-center p-4 border border-border/50 rounded-lg bg-gradient-technical transition-all hover:border-success">
    <Stamp className={`h-6 w-6 mx-auto mb-2 ${iconColor} animate-pulse`} />
    <div className={`text-xs font-mono ${iconColor} uppercase tracking-wider`}>{title}</div>
    <div className="text-sm font-mono text-foreground font-semibold mt-1">{name}</div>
  </div>
);
