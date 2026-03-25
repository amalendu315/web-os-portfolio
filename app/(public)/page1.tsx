"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldAlert, Database, Globe, Lock, Cpu, 
  Layers, Briefcase, ChevronRight, Activity, Zap, FileCode2,
  Monitor, Command, Crosshair, Fingerprint, Wifi
} from "lucide-react";

// --- GLOBAL STYLES & FONT INJECTION ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');

  :root {
    --bg-void: #030303;
    --cyan: #00E5FF;
    --red: #FF2A2A;
    --green: #00FF41;
  }

  body {
    background-color: var(--bg-void);
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  .font-mono {
    font-family: 'Fira Code', monospace;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-void); }
  ::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--cyan); }

  .glass-panel {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 229, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .scanline {
    width: 100%;
    height: 100px;
    z-index: 50;
    position: fixed;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(0, 229, 255, 0.05) 50%, rgba(255,255,255,0));
    animation: scan 8s linear infinite;
  }

  @keyframes scan {
    0% { top: -100px; }
    100% { top: 100vh; }
  }

  /* Glitch Text Effect */
  .glitch {
    position: relative;
  }
  .glitch::before, .glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-void);
  }
  .glitch::before {
    left: 2px;
    text-shadow: -1px 0 var(--red);
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
  }
  .glitch::after {
    left: -2px;
    text-shadow: -1px 0 var(--cyan);
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim 2.5s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim {
    0% { clip: rect(13px, 9999px, 86px, 0); }
    5% { clip: rect(78px, 9999px, 88px, 0); }
    10% { clip: rect(48px, 9999px, 49px, 0); }
    15% { clip: rect(98px, 9999px, 3px, 0); }
    20% { clip: rect(31px, 9999px, 59px, 0); }
    25% { clip: rect(15px, 9999px, 33px, 0); }
    30% { clip: rect(84px, 9999px, 7px, 0); }
    35% { clip: rect(29px, 9999px, 80px, 0); }
    40% { clip: rect(61px, 9999px, 52px, 0); }
    45% { clip: rect(2px, 9999px, 42px, 0); }
    50% { clip: rect(77px, 9999px, 14px, 0); }
    55% { clip: rect(43px, 9999px, 31px, 0); }
    60% { clip: rect(96px, 9999px, 83px, 0); }
    65% { clip: rect(54px, 9999px, 20px, 0); }
    70% { clip: rect(17px, 9999px, 66px, 0); }
    75% { clip: rect(89px, 9999px, 75px, 0); }
    80% { clip: rect(38px, 9999px, 11px, 0); }
    85% { clip: rect(65px, 9999px, 94px, 0); }
    90% { clip: rect(22px, 9999px, 47px, 0); }
    95% { clip: rect(71px, 9999px, 81px, 0); }
    100% { clip: rect(5px, 9999px, 25px, 0); }
  }
`;

// --- COMPONENTS ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorXSpring = useSpring(-100, { stiffness: 500, damping: 28 });
  const cursorYSpring = useSpring(-100, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorXSpring.set(e.clientX);
      cursorYSpring.set(e.clientY);
    };
    const handleMouseOver = (e) => {
      setIsHovering(!!e.target.closest('a, button, input, .interactive'));
    };
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorXSpring, cursorYSpring]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00E5FF] rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_#00E5FF]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4, scale: isHovering ? 0 : 1 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-[#00E5FF]/50 rounded-full pointer-events-none z-[9998] mix-blend-screen flex items-center justify-center"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
        animate={{ 
          scale: isHovering ? 1.2 : 1,
          borderColor: isHovering ? "#FF2A2A" : "rgba(0, 229, 255, 0.3)",
          backgroundColor: isHovering ? "rgba(255, 42, 42, 0.05)" : "transparent",
          rotate: isHovering ? 45 : 0
        }}
      >
        {isHovering && <Crosshair size={14} className="text-[#FF2A2A] opacity-50" />}
      </motion.div>
    </>
  );
};

const ScrambleText = ({ text, className, startDelay = 0 }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";
  
  useEffect(() => {
    let iteration = 0;
    let interval = null;
    let timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText((prev) =>
          text.split("").map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    }, startDelay);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [text, startDelay]);

  return <span className={className}>{displayText}</span>;
};

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(yPct * -15);
    setRotateY(xPct * 15);
  };

  return (
    <motion.div
      ref={ref} animate={{ rotateX, rotateY }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove} onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      className={`glass-panel rounded-xl p-6 relative overflow-hidden group interactive ${className}`}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

// --- NEW COMPONENTS ---

const BootSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "INITIALIZING KERNEL 5.15.0-76-generic...",
    "MOUNTING VFS: ROOT FILE SYSTEM VERIFIED.",
    "LOADING NEURAL INTERFACE DRIVERS... [OK]",
    "ESTABLISHING SECURE CONNECTION TO SILIGURI_NODE...",
    "BYPASSING FIREWALL... [SUCCESS]",
    "DECRYPTING DOSSIER: AMALENDU_PANDEY.enc",
    "VERIFYING INTEGRITY HASHSUMS... MATCHED.",
    "BOOT SEQUENCE COMPLETE. HANDING OVER CONTROL."
  ];

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 200);

    return () => { clearInterval(logInterval); clearInterval(progInterval); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#030303] z-[99999] flex flex-col justify-center p-8 md:p-24 font-mono text-sm md:text-lg">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-2">
        <Fingerprint className="text-[#00E5FF] mb-8 animate-pulse" size={48} />
        {logs.map((log, i) => (
          <div key={i} className="text-[#00FF41] opacity-80">{`> ${log}`}</div>
        ))}
        
        <div className="mt-8 border border-white/20 h-4 w-full bg-black relative rounded overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#00E5FF]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-[#00E5FF] text-xs mt-2">SYS_LOAD: {Math.min(progress, 100)}%</div>
      </div>
    </div>
  );
};

const InteractiveShell = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "sys", text: "AMALENDU_OS SHELL v2.1.0" },
    { type: "sys", text: "Type 'help' to see available commands." }
  ]);
  const inputRef = useRef(null);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let response = "";

      switch(cmd) {
        case "help": response = "Available commands: whoami, skills, clear, sudo rm -rf /"; break;
        case "whoami": response = "AMALENDU PANDEY - Full Stack / Cyber Analyst. Status: Highly Motivated."; break;
        case "skills": response = "React, Next.js, .NET Blazor, Node.js, MSSQL, Cyber Intel."; break;
        case "clear": setHistory([]); setInput(""); return;
        case "sudo rm -rf /": response = "ACCESS DENIED. Incident reported to administrator."; break;
        case "": response = ""; break;
        default: response = `Command not found: ${cmd}`; break;
      }

      setHistory(prev => [...prev, { type: "user", text: `root@amalendu:~$ ${input}` }]);
      if (response) setHistory(prev => [...prev, { type: "sys", text: response }]);
      setInput("");
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border-[#00FF41]/30 mt-8 font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div className="bg-[#00FF41]/10 px-4 py-2 border-b border-[#00FF41]/30 flex items-center gap-2">
        <Command size={14} className="text-[#00FF41]" />
        <span className="text-[#00FF41]">system_terminal</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto flex flex-col gap-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === "sys" ? "text-gray-400" : "text-white"}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-[#00E5FF]">
          <span className="mr-2">root@amalendu:~$</span>
          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent outline-none flex-grow interactive text-white"
            autoComplete="off" spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

const SystemHUD = () => {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(`${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-50 pointer-events-none">
      <div className="glass-panel p-4 rounded text-xs font-mono w-48 bg-black/80 backdrop-blur-md">
        <div className="text-[#00E5FF] mb-2 flex justify-between"><span>SYS_TIME</span><span>{time}</span></div>
        <div className="text-[#00FF41] mb-2 flex justify-between"><span>NET_STAT</span><span>SECURE</span></div>
        <div className="text-[#FF2A2A] mb-4 flex justify-between"><span>THREAT</span><span>LOW</span></div>
        
        <div className="text-gray-500 mb-1">DATA LINK INTEGRITY</div>
        <div className="h-1 bg-white/10 rounded overflow-hidden">
          <motion.div className="h-full bg-[#00E5FF]" style={{ width: yRange }} />
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end opacity-50">
        <Wifi size={20} className="text-[#00E5FF]" />
        <Database size={20} className="text-[#00E5FF]" />
        <Activity size={20} className="text-[#00E5FF]" />
      </div>
    </div>
  );
};

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-[#030303]/90 backdrop-blur-md border-b border-[#00E5FF]/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}
    >
      <div className="container mx-auto px-6 max-w-5xl flex justify-between items-center">
        <div 
          onClick={() => scrollTo('hero')}
          className="interactive text-[#00E5FF] font-bold font-mono tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
        >
          <Terminal size={18} /> AMALENDU_OS
        </div>
        
        <div className="hidden md:flex gap-8 font-mono text-sm text-gray-400">
          <button onClick={() => scrollTo('capabilities')} className="interactive hover:text-[#00E5FF] transition-colors">// CAPABILITIES</button>
          <button onClick={() => scrollTo('audit-logs')} className="interactive hover:text-[#FF2A2A] transition-colors">// AUDIT_LOGS</button>
          <button onClick={() => scrollTo('classified-ops')} className="interactive hover:text-[#00FF41] transition-colors">// CLASSIFIED_OPS</button>
        </div>

        <button onClick={() => window.location.href='mailto:amalendupandey56@gmail.com'} className="interactive px-4 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] font-mono text-xs hover:bg-[#00E5FF] hover:text-black transition-all duration-300">
          [ INITIATE_CONTACT ]
        </button>
      </div>
    </motion.nav>
  );
};

// --- MAIN PAGE LAYOUT ---

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  if (isBooting) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <BootSequence onComplete={() => setIsBooting(false)} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-300 selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <CustomCursor />
      <NavBar />
      <SystemHUD />
      <div className="scanline" />

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      <main className="relative z-10 container mx-auto px-6 py-24 max-w-5xl flex flex-col gap-40">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-screen flex flex-col justify-center relative scroll-mt-32">
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-3 text-[#00E5FF] font-mono text-sm border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-4 py-2 rounded-full w-max">
              <Activity size={16} className="animate-pulse" />
              <span>CONNECTION SECURE // IP_MASKED</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase glitch" data-text="AMALENDU PANDEY">
              AMALENDU PANDEY
            </h1>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-xl md:text-2xl font-mono border-l-4 border-[#FF2A2A] pl-6 py-2 bg-gradient-to-r from-[#FF2A2A]/10 to-transparent w-max">
              <span className="text-[#FF2A2A]">Sr. Associate Developer</span>
              <span className="hidden md:inline text-gray-600">//</span>
              <span className="text-[#00E5FF]">Cyber Crime Analyst</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl">
              <div className="bg-black/40 p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-[#00E5FF]/50 transition-colors">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#00E5FF] to-[#00FF41]" />
                <h3 className="text-[#00E5FF] font-mono text-xs mb-4">SYSTEM_INFO</h3>
                <p className="font-mono text-sm mb-2"><span className="text-gray-500">Location:</span> Siliguri, WB, India</p>
                <p className="font-mono text-sm mb-2"><span className="text-gray-500">Geo_Lock:</span> <span className="text-[#00FF41]">734003</span></p>
                <p className="font-mono text-sm"><span className="text-gray-500">Comms:</span> amalendupandey56@gmail.com</p>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-[#00FF41]/50 transition-colors">
                 <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#00FF41] to-[#FF2A2A]" />
                 <h3 className="text-[#00FF41] font-mono text-xs mb-4">DOSSIER_SUMMARY</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Dual-threat operative. Specialized in Next.js & .NET architectures. Engineered financial automation engines eliminating vulnerabilities. High proficiency in full-stack dev coupled with cyber-intelligence logic.
                 </p>
              </div>
            </div>

            <InteractiveShell />

          </motion.div>
        </section>

        {/* SKILLS MATRIX */}
        <section id="capabilities" className="relative scroll-mt-32">
          <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
            <Cpu className="text-[#00E5FF]" size={32} />
            <h2 className="text-4xl font-bold font-mono tracking-widest uppercase glitch" data-text="Core Capabilities">Core Capabilities</h2>
            <div className="flex-grow h-[1px] bg-gradient-to-r from-[#00E5FF]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Frontend_Nodes", icon: <Layers className="text-[#00E5FF]" />, skills: ["ReactJS", "Next.js", ".NET Blazor", "UI/UX"] },
              { title: "Backend_Protocols", icon: <Terminal className="text-[#00FF41]" />, skills: ["Node.js", "Express", "TypeScript", ".NET Core", "C#"] },
              { title: "Database_Infra", icon: <Database className="text-[#FF2A2A]" />, skills: ["MSSQL", "MongoDB", "TypeORM", "Docker", "AWS"] },
              { title: "Ops_Security", icon: <ShieldAlert className="text-[#00E5FF]" />, skills: ["Cyber Crime Analysis", "Tech SEO", "Reconciliation API"] }
            ].map((node, i) => (
              <TiltCard key={i} className="group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-20 transition-all scale-150 group-hover:scale-110 duration-500">
                  {node.icon}
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-black/50 rounded-lg border border-white/10 group-hover:border-[#00E5FF]/50 transition-colors">
                    {node.icon}
                  </div>
                  <h3 className="font-mono text-sm font-bold text-white">{node.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {node.skills.map((skill, j) => (
                    <div key={j} className="relative group/skill cursor-default">
                      <span className="inline-block px-3 py-1 text-xs font-mono bg-white/5 text-gray-300 border border-white/10 rounded-md hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-all duration-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </TiltCard>
          ))}
          </div>
        </section>

        {/* AUDIT LOGS / EXPERIENCE */}
        <section id="audit-logs" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
            <Activity className="text-[#FF2A2A]" size={32} />
            <h2 className="text-4xl font-bold font-mono tracking-widest uppercase glitch" data-text="Audit Logs_">Audit Logs_</h2>
            <div className="flex-grow h-[1px] bg-gradient-to-r from-[#FF2A2A]/30 to-transparent" />
          </div>

          <div className="relative pl-8 md:pl-0">
            <div className="absolute left-[15px] md:left-1/2 md:-ml-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00E5FF] via-[#FF2A2A] to-transparent opacity-30 shadow-[0_0_8px_#00E5FF]" />

            {[
              {
                role: "Senior Associate Developer",
                company: "AIRiQ 365",
                time: "11/2024 - Present",
                location: "Siliguri, India",
                access: "ACCESS_LEVEL: SENIOR",
                status: "STATUS: 200 OK",
                points: [
                  "Deployed Next.js financial automation, migrating sales vouchers to Tally to eliminate manual data-entry vulnerabilities.",
                  "Architected a Next.js Payment Reconciliation System parsing airline reports to track Purchase, Refund, Repayment data.",
                  "Engineered enterprise platforms via .NET Blazor: Digitized Loan Management & Hotel Property Management Suites.",
                  "Executed Node.js & C# background automation for high-frequency airline fare and hotel inventory aggregation."
                ]
              },
              {
                role: "Full Stack Developer",
                company: "Vebholic Pvt. Ltd.",
                time: "06/2022 - 02/2023",
                location: "Remote",
                access: "ACCESS_LEVEL: FULL STACK",
                status: "STATUS: 200 OK",
                points: [
                  "Developed 2 live enterprise nodes: Ecommerce and Education Management platforms.",
                  "Utilized Typescript, React.js, Node.js, Express, MongoDB, Docker.",
                  "Optimized system load times via structural codebase refactoring."
                ]
              }
            ].map((exp, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`relative flex flex-col md:flex-row gap-8 mb-24 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute left-[-21px] md:left-1/2 md:-ml-[6px] top-6 w-3 h-3 rounded-full bg-[#030303] border-2 border-[#00E5FF] shadow-[0_0_15px_#00E5FF] z-10 animate-pulse" />

                <div className={`md:w-1/2 flex flex-col ${i % 2 === 0 ? 'md:items-start' : 'md:items-end'} justify-start pt-4`}>
                  <div className="inline-flex flex-col gap-1 bg-[#030303] p-3 rounded-lg border border-[#00E5FF]/20 shadow-[0_0_20px_rgba(0,229,255,0.05)]">
                    <span className="text-[#00E5FF] font-mono text-xs tracking-wider">{exp.access}</span>
                    <span className="text-[#00FF41] font-mono text-xs tracking-wider">[{exp.status}]</span>
                    <span className="text-gray-500 font-mono text-xs">{exp.time}</span>
                  </div>
                </div>

                <TiltCard className="md:w-1/2 border-l-2 border-l-[#FF2A2A] md:border-l-[1px] md:border-l-white/10 hover:border-[#FF2A2A] transition-colors duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                  <h4 className="text-[#00E5FF] font-mono text-sm mb-6 flex items-center gap-2">
                    <Briefcase size={14} /> {exp.company} // {exp.location}
                  </h4>
                  <ul className="space-y-4">
                    {exp.points.map((point, j) => (
                      <li key={j} className="text-gray-400 text-sm flex items-start gap-3 leading-relaxed">
                        <ChevronRight size={16} className="text-[#FF2A2A] shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
          ))}
          </div>
        </section>

        {/* CLASSIFIED OPERATIONS / PROJECTS */}
        <section id="classified-ops" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
            <Lock className="text-[#00FF41]" size={32} />
            <h2 className="text-4xl font-bold font-mono tracking-widest uppercase glitch" data-text="Classified Ops">Classified Ops</h2>
            <div className="flex-grow h-[1px] bg-gradient-to-r from-[#00FF41]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Financial Reconciliation Engine", tech: "Next.js", desc: "Dynamic parsing tool eliminating ledger verification errors via automated categorization.", code: "OP_RECON" },
              { title: "Enterprise Loan & Property Suite", tech: ".NET Blazor, MSSQL", desc: "Dual-purpose digitized platform for employee lifecycle and hotel operations.", code: "OP_BLAZOR" },
              { title: "Live Fare & Inventory Aggregator", tech: "Node.js, C# WinService", desc: "High-frequency autonomous background services fetching live API pricing data.", code: "OP_AGGREGATE" },
              { title: "Scooty Rental E-Commerce", tech: "Next.js, Node.js, MSSQL", desc: "End-to-end rental portal with secure payments, optimized via technical SEO & Google Ads.", code: "OP_RENTAL" },
              { title: "Restaurant Ordering System", tech: "Next.js, Node.js, MSSQL", desc: "Responsive custom admin panel and digital footprint booster.", code: "OP_ORDER" },
              { title: "Tally Sales Integration Helper", tech: "Next.js", desc: "Custom automated migration pipeline for daily sales data.", code: "OP_TALLY" }
            ].map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard className="flex flex-col justify-between h-full group border-t-2 border-t-[#00FF41]/50">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="font-mono text-xs text-gray-500">[{project.code}]</div>
                      <span className="text-[10px] font-mono text-[#FF2A2A] border border-[#FF2A2A]/30 px-2 py-1 rounded bg-[#FF2A2A]/5 flex items-center gap-1">
                        <Lock size={10} /> RESTRICTED
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{project.desc}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <p className="text-[#00FF41] font-mono text-xs mb-4 flex items-center gap-2">
                      <Code size={12} /> {project.tech}
                    </p>
                    <button className="interactive w-full py-3 bg-black/50 border border-[#00E5FF]/30 text-[#00E5FF] font-mono text-sm hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                      <Lock size={14} className="group-hover:hidden" />
                      <Zap size={14} className="hidden group-hover:block" />
                      DECRYPT_FILE
                    </button>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EDUCATION & SYSTEM FOOTER */}
        <section className="mb-12">
          <div className="glass-panel p-8 md:p-12 rounded-xl border-l-4 border-l-[#00E5FF] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl" />
             <div className="flex items-center gap-3 mb-8 text-[#00E5FF] font-mono border-b border-white/10 pb-4">
                <Terminal size={24} />
                <span className="text-xl">~/system/training_records.sh</span>
             </div>
             
             <div className="font-mono text-sm md:text-base space-y-6 text-gray-300">
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 hover:bg-white/5 p-4 rounded transition-colors">
                  <span className="text-[#00FF41] shrink-0 w-32">{`> B.Tech (CSE)`}</span>
                  <div>
                    <div className="text-white font-bold">Univ. of Engineering and Management, Jaipur</div>
                    <div className="text-gray-500 text-sm mt-1">STATUS: COMPLETED (07/2018 - 06/2022)</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 hover:bg-white/5 p-4 rounded transition-colors">
                  <span className="text-[#00FF41] shrink-0 w-32">{`> High School `}</span>
                  <div>
                    <div className="text-white font-bold">Siliguri Deshbandhu Hindi High School</div>
                    <div className="text-gray-500 text-sm mt-1">INTEGRITY: 67% (03/2017 - 03/2018)</div>
                  </div>
                </div>
             </div>
          </div>
        </section>
        
        <footer className="py-8 text-center border-t border-white/5 mt-10">
            <div className="font-mono text-xs text-gray-600 flex flex-col items-center gap-2">
              <span className="text-[#00FF41] animate-pulse">● LIVE CONNECTION</span>
              <span>© {new Date().getFullYear()} AMALENDU_OS. ALL PROTOCOLS SECURED.</span>
            </div>
        </footer>

      </main>
    </div>
  );
}

// Dummy icon for Projects to avoid import issues if not in lucide
const Code = ({size, className}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
