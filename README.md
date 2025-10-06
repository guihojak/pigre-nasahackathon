# 🚀 PIGRE – Processador Inteligente de Gestão de Resíduos Espaciais

> **MVP – Hackathon NASA / Prototipagem**  
> O PIGRE é um sistema de **simulação e controle de reciclagem de resíduos em ambientes extremos (ex.: Marte)**.  
> Seu objetivo é **maximizar a economia logística (ESM – Equivalent System Mass)** convertendo resíduos em combustível, peças metálicas ou redução de volume, priorizando rotas com maior impacto positivo para a missão.

---

## 🎯 Objetivo do Projeto
- Demonstrar um **MVP visual e interativo** do PIGRE.  
- Simular cenários de processamento de resíduos com **impactos diretos nos KPIs da missão**.  
- Fornecer um **painel didático e intuitivo** para explicar aos jurados e stakeholders como o motor de decisão reduz custos logísticos em missões espaciais.  

---

## 🖥️ Demonstração (MVP)
- Interface construída em **React + TailwindCSS + Lucide Icons**.  
- Painel principal (**Control**) apresenta:
  - 📊 KPIs de energia, massa processada, combustível e peças.
  - 🛰️ Economia logística (ΔESM) em destaque.
  - 🔄 Simulação de processos (pirólise, fusão, compactação).
  - ⚡ Logs de eventos em tempo real.
  - 🍰 Gráficos visuais (pizza, barras empilhadas).
  - 🛠️ Ações rápidas para ajustes de priorização.
  - 📈 Painel comparativo **Antes → Depois** após cada simulação.
  - 📂 Exportação de dados para análise.

---

## 📊 Regras de Negócio (Resumo)
1. **Processos disponíveis**:
   - 🔥 **Pirólise** → resíduos plásticos → combustível líquido (CH₄/O₂).  
   - ⚙️ **Fusão** → metais → peças estruturais (para impressão 3D).  
   - 📦 **Compactação** → resíduos mistos → redução de volume.  

2. **Métrica chave**:  
   - **ΔESM (Equivalent System Mass)** → economia logística em *kg-equivalente*.  
   - Fórmula combina energia, massa, volume e fatores de equivalência.  

3. **Motor de decisão**:
   - Avalia impacto de cada lote processado.  
   - Prioriza rotas que maximizam ΔESM.  
   - Ajusta automaticamente prioridades em tempo real.  

---

## ⚙️ Tecnologias Utilizadas
- **React (TSX)** → front-end da aplicação.  
- **TailwindCSS** → estilização responsiva e moderna.  
- **Lucide-React** → ícones para KPIs e módulos.  
- **React Hooks (useState, useEffect, useMemo, useRef)** → controle do estado e simulação.  
- **Simulação interna** → cálculos energéticos e ΔESM sem dependências externas.  

---

