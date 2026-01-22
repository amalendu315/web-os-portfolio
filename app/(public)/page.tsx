'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, Folder, User, Shield, Cpu, X, Minus, Maximize2, Minimize2,
    Search, Grid, List, ChevronRight, Code, HardDrive, Power, Wifi, Battery,
    FileText, Activity, Lock, Briefcase, CheckCircle2, Server, ShieldCheck,
    Wrench, Mail, Send, Calculator, Volume2, Dna, BrainCircuit, Rocket,
    Settings, Monitor, Command, RefreshCw, ArrowUp, // <--- Add this
    Home,    // <--- Add this
} from 'lucide-react';

// --- TYPES ---

interface FileSystemItem {
    _id: string;
    name: string;
    type: 'folder' | 'file';
    parentId: string | null;
    icon?: string;
    content?: string;
    tags?: string[];
}

interface WindowInstance {
    id: number;
    appId: string;
    title: string;
    icon: React.ReactElement;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    props: Record<string, any>;
    size?: { width: number; height: number };
}

interface AppDefinition {
    title: string;
    icon: React.ReactElement;
    component: React.ComponentType<any>;
}

interface AppRegistry {
    [key: string]: AppDefinition;
}

// --- UTILITY COMPONENTS ---

const Clock: React.FC = () => {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return null;

    return (
        <div className="flex flex-col items-end leading-tight cursor-default">
            <span className="text-xs font-medium text-slate-200">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-slate-400">
                {time.toLocaleDateString()}
            </span>
        </div>
    );
};

const NetworkWidget: React.FC = () => {
    const [bars, setBars] = useState<number[]>([20, 40, 60, 30, 50, 70, 45, 60, 80, 50]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => [...prev.slice(1), Math.floor(Math.random() * 80) + 10]);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-6 right-6 w-48 bg-slate-900/50 backdrop-blur-sm border border-slate-700 p-3 rounded-lg z-0 pointer-events-none hidden md:block">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                    <Activity size={10} /> NET_TRAFFIC
                </span>
                <span className="text-[10px] text-slate-500">10ms</span>
            </div>
            <div className="flex items-end h-12 gap-1">
                {bars.map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-green-500/20 border-t border-green-500/50 transition-all duration-300"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- GEEKY BACKGROUNDS ---

const MatrixBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        const letters = '0101010101AMALENDU01010101CYBER010101SECURITY010101CODE';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#22c55e'; // Green-500
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', setSize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />;
};

const GridBackground: React.FC = () => (
    <div className="absolute inset-0 z-0 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-500 opacity-20 blur-[100px]"></div>
    </div>
);

// --- CORE APP COMPONENTS ---

// 1. BIOS BOOT
const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const bootText = [
            "BIOS DATE 01/21/2026 11:27:00 VER 4.0",
            "CPU: AMD RYZEN THREADRIPPER PRO",
            "RAM: 64GB DDR5 ECC CHECK... OK",
            "DETECTING PRIMARY MASTER ... AMALENDU_CORE_V4",
            "LOADING SECURITY MODULES ... DONE",
            "MOUNTING FILESYSTEM (MongoDB Atlas) ... OK",
            "STARTING WINDOW MANAGER ... OK",
            "ESTABLISHING SECURE CONNECTION ..."
        ];

        let delay = 0;
        bootText.forEach((line, index) => {
            delay += Math.random() * 200 + 50;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (index === bootText.length - 1) setTimeout(onComplete, 800);
            }, delay);
        });
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 text-sm md:text-base z-[100] flex flex-col justify-end pb-20 select-none cursor-wait">
            {lines.map((line, i) => <div key={i} className="mb-1 opacity-90">{line}</div>)}
            <div className="animate-pulse mt-2 flex items-center gap-2">
                <span className="w-2 h-4 bg-green-500 block"></span>
                <span className="text-green-500/50">SYSTEM BOOTING</span>
            </div>
        </div>
    );
};

// 2. LOGIN SCREEN
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[90] font-mono bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full"></div>
            <div className="w-24 h-24 bg-slate-800/80 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-600 shadow-inner relative z-10">
                <User size={40} className="text-slate-200" />
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-4 border-slate-900">
                    <Shield size={12} className="text-black fill-current" />
                </div>
            </div>
            <h2 className="text-2xl text-white mb-1 font-bold tracking-wider">AMALENDU PANDEY</h2>
            <p className="text-green-400/80 mb-8 text-xs tracking-widest uppercase">Cyber Security & Full Stack Engineer</p>
            <div className="space-y-4 relative z-10">
                <div className="relative group/input">
                    <Lock size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input
                        type="password"
                        placeholder="Enter Bio-Key"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none cursor-not-allowed opacity-70"
                        disabled
                    />
                </div>
                <button
                    onClick={onLogin}
                    className="w-full bg-green-600 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] text-black font-bold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                    <Power size={18} /> INITIALIZE GUEST SESSION
                </button>
            </div>
            <div className="mt-8 text-[10px] text-slate-600 flex justify-between uppercase tracking-wider font-semibold">
                <span>System: Secure</span>
                <span>Build: v4.0.0</span>
            </div>
        </div>
    </div>
);

// 3. WINDOW FRAME
interface WindowFrameProps {
    window: WindowInstance;
    activeId: number | null;
    onFocus: (id: number) => void;
    onClose: (id: number) => void;
    onMinimize: (id: number) => void;
    onMaximize: (id: number) => void;
    children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ window, activeId, onFocus, onClose, onMinimize, onMaximize, children }) => {
    const isFocused = window.id === activeId;
    const isMaximized = window.isMaximized;
    const variants = {
        initial: { scale: 0.95, opacity: 0, y: 20 },
        animate: isMaximized
            ? { scale: 1, opacity: 1, x: 0, y: 0, width: "100%", height: "100%", top: 0, left: 0, borderRadius: 0 }
            : { scale: 1, opacity: 1, width: window.size?.width || 700, height: window.size?.height || 500, borderRadius: "0.5rem" },
        exit: { scale: 0.95, opacity: 0 }
    };

    return (
        <motion.div
            drag={!isMaximized}
            dragMomentum={false}
            dragConstraints={{ left: 0, top: 0, right: typeof window !== 'undefined' ? window.size?.width! - 100 : 1000, bottom: typeof window !== 'undefined' ? window.size?.height! - 100 : 1000 }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`absolute flex flex-col bg-slate-900/90 backdrop-blur-xl border shadow-2xl overflow-hidden ${
                isFocused ? 'border-slate-500 ring-1 ring-slate-700/50 z-50' : 'border-slate-800 z-0'
            } ${!isMaximized ? 'top-20 left-10 md:left-[15%]' : ''}`}
            style={{ zIndex: window.zIndex }}
            onMouseDown={() => onFocus(window.id)}
        >
            <div
                onDoubleClick={() => onMaximize(window.id)}
                className="h-10 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between px-3 cursor-default select-none shrink-0"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded ${isFocused ? 'bg-slate-700' : 'bg-transparent'}`}>{window.icon}</div>
                    <span className="text-xs text-slate-200 font-mono tracking-wide font-medium">{window.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors"><Minus size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors">
                        {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(window.id); }} className="p-1.5 hover:bg-red-500 hover:text-white rounded text-slate-400 transition-colors"><X size={14} /></button>
                </div>
            </div>
            <div className="flex-1 overflow-auto relative text-slate-300">
                {children}
            </div>
        </motion.div>
    );
};

// 4. APP: SETTINGS (PERSONALIZATION)
const SettingsApp: React.FC<{ currentBg: string; onBgChange: (id: string) => void; isGodMode: boolean }> = ({ currentBg, onBgChange, isGodMode }) => {
    const backgrounds = [
        { id: 'default', name: 'Cyber Default', icon: <Activity size={20} className="text-blue-400" /> },
        { id: 'matrix', name: 'Matrix Rain', icon: <Code size={20} className="text-green-400" /> },
        { id: 'grid', name: 'Retro Grid', icon: <Grid size={20} className="text-purple-400" /> }
    ];

    return (
        <div className="h-full bg-slate-950 text-slate-200 p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings size={24} className="text-slate-400" /> System Settings
            </h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Monitor size={16} /> Wallpaper / Environment
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {backgrounds.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => onBgChange(bg.id)}
                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border transition-all ${
                                    currentBg === bg.id ? 'bg-slate-800 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                {bg.icon}
                                <span className="text-sm font-medium">{bg.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Cpu size={16} /> System Status
                    </h2>
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span>User Level:</span> <span className={isGodMode ? "text-yellow-400 font-bold" : "text-slate-400"}>{isGodMode ? "GOD MODE" : "GUEST"}</span></div>
                        <div className="flex justify-between"><span>OS Version:</span> <span className="text-slate-400">AP-OS v4.1 (Dynamic)</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. APP: COMMAND PALETTE
const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void; apps: AppRegistry; onOpenApp: (key: string) => void }> = ({ isOpen, onClose, apps, onOpenApp }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredApps = Object.keys(apps).filter(key =>
        apps[key].title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                    <Search size={20} className="text-slate-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search apps..."
                        className="flex-1 bg-transparent border-none outline-none text-lg text-white"
                        onKeyDown={e => {
                            if (e.key === 'Enter' && filteredApps.length > 0) {
                                onOpenApp(filteredApps[0]);
                                onClose();
                            }
                            if (e.key === 'Escape') onClose();
                        }}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredApps.length === 0 ? <div className="p-4 text-center text-slate-500 text-sm">No results found</div> : filteredApps.map((key, i) => (
                        <button key={key} onClick={() => { onOpenApp(key); onClose(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-left ${i === 0 ? 'bg-slate-800/50' : ''}`}>
                            <div className="text-slate-400">{apps[key].icon}</div>
                            <div className="flex-1 text-sm font-medium text-slate-200">{apps[key].title}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 6. APP: TEXT EDITOR
const TextEditorApp: React.FC<{ file: FileSystemItem | null }> = ({ file }) => (
    <div className="h-full flex flex-col bg-slate-950 text-slate-300 font-mono text-sm">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs text-slate-500 flex justify-between">
            <span>{file ? file.name : 'Untitled'}</span>
            <span>UTF-8</span>
        </div>
        <div className="flex-1 p-4 overflow-auto">
            <pre className="outline-none w-full h-full font-mono leading-relaxed">
                {file ? <code className="language-typescript">{file.content}</code> : <span className="text-slate-600">// Select a file from Explorer</span>}
            </pre>
        </div>
    </div>
);

// 7. APP: TERMINAL
const TerminalApp: React.FC = () => {
    const [history, setHistory] = useState<{ type: string; content: string }[]>([
        { type: 'output', content: 'AP-OS Security Kernel v4.1 initialized.' },
        { type: 'output', content: 'Connected to MongoDB Cluster.' }
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            setHistory(prev => [...prev, { type: 'input', content: input }]);
            setInput('');

            let response = '';
            switch (cmd) {
                case 'help': response = 'Available: whoami, clear, date, reboot'; break;
                case 'whoami': response = 'guest@portfolio-os'; break;
                case 'clear': setHistory([]); return;
                case 'date': response = new Date().toString(); break;
                case 'reboot': window.location.reload(); return;
                default: response = `Command not found: ${cmd}`;
            }
            setHistory(prev => [...prev, { type: 'output', content: response }]);
        }
    };

    return (
        <div className="p-4 font-mono text-sm bg-black/90 h-full text-green-500 selection:bg-green-500/30 overflow-y-auto">
            {history.map((line, i) => (
                <div key={i} className={`mb-1 ${line.type === 'input' ? 'text-white mt-3' : 'text-green-500/80'}`}>
                    {line.type === 'input' ? '> ' : ''}{line.content}
                </div>
            ))}
            <div className="flex mt-2">
                <span className="text-green-500 mr-2">{'>'}</span>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} className="bg-transparent border-none outline-none flex-1 text-white caret-green-500" autoFocus />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

// 8. APP: EXPLORER (DYNAMIC)
const ExplorerApp: React.FC<{ onOpenFile: (file: FileSystemItem) => void; fileSystem: FileSystemItem[] }> = ({ onOpenFile, fileSystem }) => {
    // Navigation State
    const [currentPath, setCurrentPath] = useState('root');
    const [history, setHistory] = useState<string[]>(['root']);
    const [historyIndex, setHistoryIndex] = useState(0);

    // --- NAVIGATION LOGIC ---

    const navigateTo = (pathId: string) => {
        if (pathId === currentPath) return;

        // Update History
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(pathId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setCurrentPath(pathId);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentPath(history[newIndex]);
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentPath(history[newIndex]);
        }
    };

    const handleUp = () => {
        if (currentPath === 'root') return;
        const currentFolder = fileSystem.find(f => f._id === currentPath);
        if (currentFolder && currentFolder.parentId) {
            navigateTo(currentFolder.parentId);
        } else {
            // Fallback for virtual folders or broken links
            navigateTo('root');
        }
    };

    // --- DATA LOGIC ---

    // 1. Identify Current Folder
    const currentFolder = fileSystem.find(f => f._id === currentPath);

    // 2. Filter Files (Smart Match: ID or Name)
    const currentFiles = fileSystem.filter(f => {
        if (f.parentId === currentPath) return true; // Match ID
        if (currentFolder && f.parentId === currentFolder.name) return true; // Match Name (Manual Folder Fix)
        return false;
    });

    // 3. Generate Breadcrumbs (Trace parents back to root)
    const getBreadcrumbs = () => {
        const crumbs = [];
        let tempId = currentPath;

        while(tempId && tempId !== 'root') {
            const folder = fileSystem.find(f => f._id === tempId);
            if (folder) {
                crumbs.unshift({ id: folder._id, name: folder.name });
                tempId = folder.parentId || 'root';
            } else {
                break;
            }
        }
        crumbs.unshift({ id: 'root', name: 'Home' });
        return crumbs;
    };
    const breadcrumbs = getBreadcrumbs();

    const handleFileAction = (file: FileSystemItem) => {
        if (file.type === 'folder') navigateTo(file._id);
        if (file.type === 'file') onOpenFile(file);
    };

    // --- UI RENDER ---

    return (
        <div className="flex h-full flex-col bg-slate-900 text-slate-200 font-sans">
            {/* TOOLBAR */}
            <div className="flex items-center gap-2 p-2 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md">
                {/* Navigation Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleBack}
                        disabled={historyIndex === 0}
                        className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Back"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={historyIndex === history.length - 1}
                        className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Forward"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={handleUp}
                        disabled={currentPath === 'root'}
                        className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ml-1"
                        title="Up One Level"
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>

                {/* Address Bar (Breadcrumbs) */}
                <div className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs flex items-center overflow-hidden">
                    <Home size={12} className="text-slate-500 mr-2 shrink-0" />
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.id}>
                                <button
                                    onClick={() => navigateTo(crumb.id)}
                                    className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                                >
                                    {crumb.name}
                                </button>
                                {index < breadcrumbs.length - 1 && <span className="text-slate-600">/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Search / Refresh */}
                <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 p-4 bg-slate-900/50 overflow-y-auto" onClick={() => { /* Click empty space to deselect */ }}>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-4 content-start">
                    {/* Empty State */}
                    {currentFiles.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center text-slate-500 mt-20 gap-3 select-none">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700 border-dashed">
                                <Folder size={32} className="opacity-20" />
                            </div>
                            <span className="text-sm font-medium">This folder is empty</span>
                        </div>
                    )}

                    {/* Files Grid */}
                    {currentFiles.map(file => (
                        <div
                            key={file._id}
                            onDoubleClick={() => handleFileAction(file)}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all cursor-pointer group active:scale-95"
                        >
                            <div className={`transition-transform duration-200 group-hover:-translate-y-1 ${file.type === 'folder' ? 'text-yellow-500 drop-shadow-md' : 'text-blue-400'}`}>
                                {file.type === 'folder' ? <Folder fill="currentColor" size={48} /> : <FileText size={42} />}
                            </div>
                            <span className="text-xs text-center w-full font-medium text-slate-300 group-hover:text-white truncate px-1 rounded">
                                {file.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* STATUS BAR */}
            <div className="bg-slate-900 border-t border-slate-800 px-3 py-1 text-[10px] text-slate-500 flex justify-between select-none">
                <span>{currentFiles.length} item(s)</span>
                <span>{currentFolder ? 'Read/Write' : 'System Root'}</span>
            </div>
        </div>
    );
};

// 9. APP: QUEST LOG (DYNAMIC)
const QuestLogApp: React.FC<{ quests: any[] }> = ({ quests }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    return (
        <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto">
            <div className="p-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold font-sans text-green-400 tracking-tight">Quest Log</h1>
                <p className="text-slate-500 mt-2 mb-8 border-l-2 border-green-500/50 pl-3">Active Missions & Achievements</p>
                <div className="w-full space-y-4">
                    {quests.length === 0 && <p className="text-slate-500">No active quests found in database.</p>}
                    {quests.map((quest, index) => {
                        const isOpen = openItem === `item-${index}`;
                        return (
                            <div key={quest._id || index} className="border border-slate-800 bg-slate-900/40 rounded-lg overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-lg">
                                <button onClick={() => setOpenItem(isOpen ? null : `item-${index}`)} className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors text-left">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${quest.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}><Server className="h-5 w-5" /></div>
                                        <div><span className="font-bold text-slate-200 block text-lg">{quest.title}</span><span className={`text-[10px] uppercase tracking-wider font-bold ${quest.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{quest.status}</span></div>
                                    </div>
                                    <ChevronRight size={20} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-90 text-green-400' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="px-6 pb-6 pt-0">
                                                <div className="h-px w-full bg-slate-800/50 mb-4"></div>
                                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{quest.description}</p>
                                                <ul className="space-y-3">
                                                    {quest.tasks && quest.tasks.map((task: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300 group"><CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500/50 group-hover:text-green-400 transition-colors flex-shrink-0" /><span>{task}</span></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// 10. APP: WORK EXPERIENCE (DYNAMIC)
const WorkExperienceApp: React.FC<{ experience: any[] }> = ({ experience }) => (
    <div className="p-6 bg-slate-950 text-slate-300 h-full font-sans overflow-y-auto">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-blue-400 mb-8 flex items-center gap-2"><Briefcase size={20} /> Career Timeline</h2>
            <div className="border-l-2 border-slate-800 pl-8 space-y-12 ml-4">
                {experience.length === 0 && <p className="text-slate-500">No experience records found.</p>}
                {experience.map((item, i) => (
                    <div key={item._id || i} className="relative group">
                        <div className={`absolute -left-[39px] top-1 bg-${item.color}-500 h-5 w-5 rounded-full border-4 border-slate-950 group-hover:scale-110 transition-transform`}></div>
                        <div className={`bg-slate-900/50 p-5 rounded-lg border border-slate-800 hover:border-${item.color}-500/30 transition-all hover:bg-slate-800/50`}>
                            <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold text-slate-100">{item.title}</h3><span className={`text-xs font-mono text-${item.color}-400 border border-${item.color}-500/20 px-2 py-1 rounded`}>{item.date}</span></div>
                            <p className="text-sm text-slate-500 mb-3 font-mono">{item.sub}</p><p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// 11. APP: ABOUT ME (DYNAMIC)
const AboutApp: React.FC<{ profile: any }> = ({ profile }) => (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto">
        <div className="flex flex-col items-center p-8 max-w-3xl mx-auto">
            <div className="h-24 w-24 rounded-full border-2 border-green-500 bg-slate-900 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <User size={48} className="text-slate-200" />
            </div>
            <h1 className="text-3xl font-bold font-sans text-white mb-2">{profile.name || 'User'}</h1>
            <p className="text-center text-sm text-green-400 font-mono mb-6 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                {profile.profile || 'Loading...'}
            </p>
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center mb-8 w-full">
                <p className="text-sm text-slate-400 leading-relaxed">{profile.bio || 'System initializing...'}</p>
            </div>
            <div className="w-full space-y-6">
                <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-800">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-green-400 mb-4 border-b border-slate-800 pb-2"><Dna size={20}/> Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.keySkills && profile.keySkills.map((skill: string) => (
                            <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-green-400 hover:border-green-500/50 transition-colors cursor-default">{skill}</span>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-800">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2"><BrainCircuit size={20}/> Personality</h2>
                    <p className="text-sm text-slate-400">{profile.personality}</p>
                </div>
                <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-800">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-purple-400 mb-2"><Rocket size={20}/> Experience</h2>
                    <p className="text-sm text-slate-400">{profile.experience}</p>
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN SYSTEM CONTROLLER ---

export default function WebOS() {
    const [bootState, setBootState] = useState<'boot' | 'login' | 'desktop'>('boot');
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [bgStyle, setBgStyle] = useState('default');
    const [paletteOpen, setPaletteOpen] = useState(false);

    // DYNAMIC DATA STATES
    const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
    const [quests, setQuests] = useState<any[]>([]);
    const [experience, setExperience] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>({});

    // FETCH DATA
    useEffect(() => {
        if (bootState === 'desktop') {
            const fetchData = async () => {
                try {
                    const [filesRes, questsRes, expRes, profRes] = await Promise.all([
                        fetch('/api/admin?type=files'),
                        fetch('/api/admin?type=quests'),
                        fetch('/api/admin?type=experience'),
                        fetch('/api/admin?type=profile')
                    ]);

                    const files = await filesRes.json();
                    if(files.length === 0) {
                        // FALLBACK FOR EMPTY DB TO PREVENT CRASH
                        setFileSystem([
                            { _id: 'root', name: 'Root', type: 'folder', parentId: null },
                            { _id: 'readme', name: 'README.txt', type: 'file', parentId: 'root', content: 'Database is empty. Please login to /admin to add content.' }
                        ]);
                    } else {
                        setFileSystem(files);
                    }

                    setQuests(await questsRes.json());
                    setExperience(await expRes.json());
                    setProfile(await profRes.json());
                } catch (err) {
                    console.error("System Failure: ", err);
                }
            };
            fetchData();
        }
    }, [bootState]);

    const APPS: AppRegistry = {
        terminal: { title: 'Terminal', icon: <Terminal size={16} className="text-green-400" />, component: TerminalApp },
        explorer: { title: 'Explorer', icon: <HardDrive size={16} className="text-yellow-400" />, component: ExplorerApp },
        editor: { title: 'Code Editor', icon: <Code size={16} className="text-blue-400" />, component: TextEditorApp },
        quest: { title: 'Quest Log', icon: <List size={16} className="text-purple-400" />, component: QuestLogApp },
        experience: { title: 'Work_History', icon: <Briefcase size={16} className="text-orange-400" />, component: WorkExperienceApp },
        settings: { title: 'Settings', icon: <Settings size={16} className="text-slate-300" />, component: SettingsApp },
        about: { title: 'About Me', icon: <User size={16} className="text-pink-400" />, component: AboutApp }
    };

    const openWindow = (appId: string, props: any = {}) => {
        setStartMenuOpen(false);
        const id = Date.now();
        const maxZ = Math.max(...windows.map(w => w.zIndex), 19);
        const newWindow: WindowInstance = {
            id, appId, title: props.file ? props.file.name : APPS[appId].title,
            icon: APPS[appId].icon,
            isOpen: true, isMinimized: false, isMaximized: false,
            zIndex: maxZ + 1,
            // Pass dynamic data down to apps
            props: {
                ...props,
                currentBg: bgStyle, onBgChange: setBgStyle,
                fileSystem, quests, experience, profile
            },
            size: undefined
        };
        setWindows([...windows, newWindow]);
        setActiveWindowId(id);
    };

    const closeWindow = (id: number) => { setWindows(prev => prev.filter(w => w.id !== id)); if (activeWindowId === id) setActiveWindowId(null); };
    const focusWindow = (id: number) => {
        setActiveWindowId(id);
        setWindows(prev => {
            const maxZ = Math.max(...prev.map(w => w.zIndex), 19);
            return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
        });
    };

    const toggleMaximize = (id: number) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); };
    const toggleMinimize = (id: number) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)); setActiveWindowId(null); };

    // Keyboard listener for Command Palette (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (bootState === 'boot') return <BootSequence onComplete={() => setBootState('login')} />;
    if (bootState === 'login') return <LoginScreen onLogin={() => setBootState('desktop')} />;

    return (
        <div className="fixed inset-0 bg-slate-950 overflow-hidden font-sans select-none text-slate-200">
            {bgStyle === 'default' && (
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <NetworkWidget />
                </div>
            )}
            {bgStyle === 'matrix' && <MatrixBackground />}
            {bgStyle === 'grid' && <GridBackground />}

            <div className="absolute top-0 left-0 p-4 z-10 flex flex-col gap-4 flex-wrap max-h-[90vh]">
                {Object.keys(APPS).map(key => (
                    <div key={key} onDoubleClick={() => openWindow(key)} className="w-20 flex flex-col items-center gap-1 group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="w-12 h-12 bg-slate-800/80 rounded-xl flex items-center justify-center shadow-lg border border-slate-700/50 group-hover:border-green-500/50 transition-all">
                            {React.cloneElement(APPS[key].icon as React.ReactElement)}
                        </div>
                        <span className="text-[11px] font-medium drop-shadow bg-black/40 px-2 rounded-full text-center leading-tight">{APPS[key].title}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {windows.map(win => {
                    const Component = APPS[win.appId].component;
                    if (win.isMinimized) return null;
                    return (
                        <WindowFrame key={win.id} window={win} activeId={activeWindowId} onFocus={focusWindow} onClose={closeWindow} onMaximize={toggleMaximize} onMinimize={toggleMinimize}>
                            {/* Pass fetch-related props if needed, mostly handled by state injection above */}
                            <Component {...win.props} onOpenFile={(file: FileSystemItem) => openWindow('editor', { file })} onClose={() => closeWindow(win.id)} />
                        </WindowFrame>
                    );
                })}
            </AnimatePresence>

            <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} apps={APPS} onOpenApp={(key) => openWindow(key)} />

            <div className="absolute bottom-0 w-full h-12 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 z-[100] flex items-center px-4 justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStartMenuOpen(!startMenuOpen)} className={`p-2 rounded-md hover:bg-slate-800 transition-colors ${startMenuOpen ? 'bg-slate-800 text-green-400' : 'text-slate-300'}`}><Cpu size={20} /></button>
                    {startMenuOpen && (
                        <div className="absolute bottom-14 left-0 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
                            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700"><div className="font-bold text-white">{profile.name || 'User'}</div><div className="text-xs text-green-400">System Administrator</div></div>
                            <div className="p-2 space-y-1">
                                {Object.keys(APPS).map(key => (
                                    <button key={key} onClick={() => openWindow(key)} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-800 rounded flex items-center gap-3 transition-colors">
                                        {React.isValidElement(APPS[key].icon) ? APPS[key].icon : null} {APPS[key].title}
                                    </button>
                                ))}
                                <div className="h-px bg-slate-800 my-2"></div>
                                <button onClick={() => setBootState('login')} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded flex items-center gap-3"><Power size={14} /> Log Out</button>
                            </div>
                        </div>
                    )}
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div className="flex gap-2">
                        {windows.map(win => (
                            <button key={win.id} onClick={() => win.isMinimized ? toggleMinimize(win.id) : focusWindow(win.id)} className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded border transition-all max-w-[140px] ${activeWindowId === win.id && !win.isMinimized ? 'bg-slate-800 border-slate-600 text-green-400' : 'border-transparent text-slate-400 hover:bg-slate-800/50'}`}>
                                {React.isValidElement(win.icon) ? win.icon : null} <span className="truncate">{win.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50 text-[10px] text-slate-400 font-mono"><Command size={10} /> <span>CTRL+K</span></div>
                    <Clock />
                </div>
            </div>
        </div>
    );
}