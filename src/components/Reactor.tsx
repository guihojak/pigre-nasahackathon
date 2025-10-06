import React from 'react';
import { Cpu, Gauge, Thermometer, RotateCcw, Zap, TrendingUp, AlertTriangle, BatteryCharging, Archive, Leaf, Cloud, Droplet, Fuel, HardHat, Settings, Beaker, GitCommit, Factory } from "lucide-react";

// -------------------------------------------------------------------------
// --- SHADCN/UI & Custom Components Mockup (Must be included for context) ---
// -------------------------------------------------------------------------

// Componentes base ajustados para o tema 'console'
const Card = ({ children, className = '' }) => <div className={`rounded-xl border border-accent/20 p-4 backdrop-blur-sm shadow-console bg-slate-900/50 transition-shadow duration-300 hover:shadow-active ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`font-semibold leading-none tracking-tight text-lg font-mono uppercase ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={className}>{children}</div>;
const Badge = ({ children, className = '' }) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase ${className}`}>{children}</span>;
const Button = ({ children, className = '', variant = 'default', onClick = () => console.log('Action triggered') }) => {
  let baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  if (variant === 'outline') {
    baseClasses += " border border-accent/50 text-accent bg-transparent hover:bg-accent/20";
  } else if (variant === 'ghost') {
    baseClasses += " hover:bg-accent/10 text-muted-foreground";
  } else {
    baseClasses += " bg-primary hover:bg-primary/90 text-primary-foreground shadow-md";
  }
  return <button className={`${baseClasses} ${className}`} onClick={onClick}>{children}</button>;
};
const Progress = ({ value, className = '', colorClass = 'bg-success', label = '' }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-border/50 ${className}`}>
        <div 
            className={`h-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${value}%` }}
        ></div>
        {label && <span className="absolute top-0 right-0 text-[10px] font-mono text-foreground -mt-3">{label}</span>}
    </div>
);

// -------------------------------------------------------------------------
// --- Modularized Components (ADAPTED FOR REACTOR) ---
// -------------------------------------------------------------------------

// Cores
const colors = {
    critical: 'text-destructive',
    warning: 'text-warning',
    success: 'text-success',
    accent: 'text-accent',
    primary: 'text-primary'
};

// 1. Componente de Medição de Sistema Detalhado (Principal para esta tela)
const SystemGauge = ({ title, value, unit, max, statusText, statusColor, Icon, details }) => {
    const percentage = (value / max) * 100;
    
    return (
        <Card className="p-6 bg-background/50 h-full flex flex-col justify-between">
            <CardHeader className="flex-row items-center justify-between border-b border-accent/20 pb-3">
                <CardTitle className={`text-accent text-sm tracking-wider flex items-center gap-2 text-${statusColor}`}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {title}
                </CardTitle>
                <Badge className={`bg-${statusColor}/20 text-${statusColor} border-${statusColor}/30 shadow-inner`}>
                    {statusText}
                </Badge>
            </CardHeader>
            <CardContent className="mt-4 flex-grow">
                <div className="relative flex items-baseline justify-start mb-6">
                    <span className={`text-7xl font-mono font-extrabold text-${statusColor}`}>
                        {value}
                    </span>
                    <span className="text-xl font-mono ml-2 text-muted-foreground">{unit}</span>
                </div>
                
                <Progress 
                    value={percentage} 
                    colorClass={`bg-${statusColor}`} 
                    className="mb-4 h-3" 
                    label={`LIMITE: ${max} ${unit}`}
                />
                
                <div className="text-xs font-mono space-y-2 pt-2">
                    {details.map((d, index) => (
                        <div key={index} className="flex justify-between text-muted-foreground border-b border-border/10 pb-1">
                            <span>{d.label}:</span>
                            <span className={`text-${d.color} font-bold`}>{d.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <Button 
                variant="outline" 
                className={`w-full mt-4 border-${statusColor}/50 text-${statusColor} hover:bg-${statusColor}/10`}
            >
                <Settings className="h-3 w-3 mr-2" />
                AJUSTAR PARÂMETROS DE SEGURANÇA
            </Button>
        </Card>
    );
};

// 2. Componente de Log Específico (Filtro para Reactor)
const ReactorLog = ({ logs }) => (
    <Card className="bg-background/50 h-full lg:col-span-2">
        <CardHeader className="pb-3 border-b border-primary/50">
            <CardTitle className="text-primary text-sm flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-primary" />
                LOGS ESPECÍFICOS DO REATOR (PROCESSAMENTO DE RESÍDUOS)
            </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 max-h-[400px] overflow-y-auto custom-scrollbar p-0">
            <div className="space-y-3">
                {logs.map((log, index) => (
                    <div key={index} className={`flex items-start text-xs font-mono p-3 rounded-md transition-all duration-150 border 
                        ${log.level === 'CRITICAL' ? 'bg-destructive/20 text-destructive border-destructive/50' :
                          log.level === 'WARNING' ? 'bg-warning/10 text-warning border-warning/30' :
                          'bg-success/10 text-success border-success/30'
                        }`}>
                        <div className="mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-[10px] text-muted-foreground">{log.time}</span>
                        </div>
                        <p className="flex-grow">
                            <span className="font-bold mr-2 uppercase">[{log.type}]</span>
                            {log.message}
                        </p>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

// 3. Status de Operação e Produção (Modo Atual + Próxima Manutenção)
const OperationStatusCard = ({ mode, safety, maintenanceSol }) => {
    
    let modeColor = 'text-primary';
    let safetyColor = colors.success;

    if (mode === 'FUSÃO') modeColor = 'text-destructive';
    if (mode === 'COMPACTAÇÃO') modeColor = 'text-accent';

    if (safety === 'AVISO') safetyColor = colors.warning;
    if (safety === 'CRÍTICO') safetyColor = colors.critical;

    const outputBreakdown = [
        { label: 'ÓLEO RECUPERADO', value: '32 L', color: 'success' },
        { label: 'GÁS (CH₄/O₂)', value: '15 L', color: 'primary' },
        { label: 'SÓLIDO (CHAR/METAL)', value: '18 kg', color: 'accent' },
    ];

    return (
        <Card className="lg:col-span-2 bg-background/50 h-full">
            <CardHeader className="pb-3 border-b border-accent/50">
                <CardTitle className="text-accent text-sm flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    MODO OPERACIONAL E PRODUÇÃO (ÚLTIMO CICLO)
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Coluna 1: Status Atual */}
                <div className="space-y-4">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase">Modo Atual</h4>
                    <div className={`text-4xl font-extrabold font-mono ${modeColor} tracking-widest`}>
                        {mode}
                    </div>
                    <Badge className={`mt-2 bg-${safetyColor.replace('text-', '')}/20 ${safetyColor} border-${safetyColor.replace('text-', '')}/30`}>
                        STATUS DE SEGURANÇA: {safety}
                    </Badge>
                </div>

                {/* Coluna 2: Manutenção e Processamento */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-mono border-b border-border/10 pb-1">
                        <span className="text-muted-foreground">PRÓX. MANUTENÇÃO:</span>
                        <span className={maintenanceSol > 100 ? colors.success : colors.warning}>SOL {maintenanceSol}</span>
                    </div>
                    <div className="flex justify-between text-sm font-mono border-b border-border/10 pb-1">
                        <span className="text-muted-foreground">MASSA PROCESSADA:</span>
                        <span className={colors.accent}>50 KG</span>
                    </div>
                    <div className="flex justify-between text-sm font-mono border-b border-border/10 pb-1">
                        <span className="text-muted-foreground">EFICIÊNCIA GLOBAL:</span>
                        <span className={colors.success}>98.5%</span>
                    </div>
                </div>

                {/* Coluna 3: Breakdown de Output */}
                <div className="space-y-3">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase">Produção por Ciclo</h4>
                    {outputBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm font-mono border-b border-border/10 pb-1">
                            <span className="text-muted-foreground">{item.label}:</span>
                            <span className={`text-${item.color} font-bold`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <Button className="w-full mt-6" variant="default">
                <Beaker className="h-4 w-4 mr-2"/>
                INICIAR CICLO DE PIRÓLISE MANUAL
            </Button>
        </Card>
    );
};


// -------------------------------------------------------------------------
// --- Main Component: ReactorConsole ---
// -------------------------------------------------------------------------

const mockReactorLogs = [
    { time: '12:01', type: 'PRESSURE', level: 'WARNING', message: 'Variação de pressão (+2.5%) no loop primário. Compensação automática concluída.' },
    { time: '11:58', type: 'PYROLYSIS', level: 'SUCCESS', message: 'Pirólise de 50 kg de plásticos concluída. Saída: 32 L de óleo, 15 L de gás.' },
    { time: '10:45', type: 'TEMP', level: 'SUCCESS', message: 'Temperatura estabilizada em 450 K após ajuste de vazão do refrigerante.' },
    { time: '09:30', type: 'COMPACT', level: 'SUCCESS', message: 'Compactação de 20 kg de resíduos metálicos em 5 blocos estruturais.' },
    { time: '08:00', type: 'CORE', level: 'CRITICAL', message: 'Falha momentânea no sensor de eficiência #1. Dados redundantes confirmam 98.5%.' },
    { time: '07:30', type: 'FUSION', level: 'WARNING', message: 'Partículas residuais detectadas na câmara de fusão. Limpeza agendada (SOL 800).' },
];


export function Reactor() {
    return (
        <div className="min-h-screen bg-gradient-mission font-technical text-foreground pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título da Seção */}
                <h2 className="text-3xl font-mono text-primary uppercase tracking-widest mb-6 border-b-2 border-primary/50 pb-2">
                    // CONSOLE DE ENGENHARIA: REATOR PIGRE-MC
                </h2>

                {/* Linha 1: Indicadores Técnicos Principais (3 Colunas) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* 1. Temperatura do Reator (K) */}
                    <SystemGauge
                        title="TEMPERATURA DO REATOR"
                        value={450}
                        unit="K"
                        max={500}
                        statusText="NOMINAL"
                        statusColor="warning" // Warning, pois está 90% do máximo.
                        Icon={Thermometer}
                        details={[
                            { label: "Temperatura de Operação (Alvo)", value: "450 K", color: "warning" },
                            { label: "Vazão do Refrigerante", value: "98 L/min", color: "success" },
                            { label: "Delta T (Última Hora)", value: "+2.1 K", color: "warning" },
                        ]}
                    />

                    {/* 2. Pressão da Câmara (MPa) */}
                    <SystemGauge
                        title="PRESSÃO DA CÂMARA"
                        value={2.1}
                        unit="MPa"
                        max={3.0}
                        statusText="ESTÁVEL"
                        statusColor="success"
                        Icon={Gauge}
                        details={[
                            { label: "Pressão Primária (Alvo)", value: "2.0 MPa", color: "success" },
                            { label: "Vazamento (Loop Secundário)", value: "0.0%", color: "success" },
                            { label: "Delta P (Último Ciclo)", value: "+0.1 MPa", color: "success" },
                        ]}
                    />

                    {/* 3. Eficiência do Ciclo (%) */}
                    <SystemGauge
                        title="EFICIÊNCIA DE CONVERSÃO"
                        value={98.5}
                        unit="%"
                        max={100}
                        statusText="EXCELENTE"
                        statusColor="success"
                        Icon={RotateCcw}
                        details={[
                            { label: "Meta de Eficiência", value: "95.0%", color: "accent" },
                            { label: "Perda de Energia (Total)", value: "1.5%", color: "success" },
                            { label: "Tempo Médio do Ciclo", value: "45 min", color: "foreground" },
                        ]}
                    />
                </div>

                {/* Linha 2: Status Operacional e Produção + Ações */}
                <div className="mb-8">
                    <OperationStatusCard 
                        mode="PIRÓLISE" 
                        safety="NORMAL" 
                        maintenanceSol={950} 
                    />
                </div>

                {/* Linha 3: Logs Detalhados */}
                <div className="grid grid-cols-1 gap-6">
                    <ReactorLog logs={mockReactorLogs} />
                </div>

            </div>
        </div>
    );
}
