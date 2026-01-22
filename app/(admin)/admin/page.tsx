'use client';

import React, { useState, useEffect } from 'react';
import {
    Lock, Briefcase, User, Save, Trash2,
    Plus, Folder, CheckCircle2, RefreshCw,
    Terminal, FileCode, LayoutDashboard,
    Cpu, ShieldCheck, Activity, Search,
    Code, FileText, Server
} from 'lucide-react';

export default function AdminConsole() {
    const [auth, setAuth] = useState(false);
    const [key, setKey] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Data States
    const [files, setFiles] = useState<any[]>([]);
    const [quests, setQuests] = useState<any[]>([]);
    const [experience, setExperience] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>({});

    // Forms
    const [newFile, setNewFile] = useState({ name: '', type: 'file', parentId: 'root', content: '' });
    // Project Wizard State
    const [projectWizard, setProjectWizard] = useState({ name: '', desc: '', stack: '', type: 'typescript' });

    const [newQuest, setNewQuest] = useState({ title: '', description: '', status: 'In Progress', tasks: '' });
    const [newExp, setNewExp] = useState({ title: '', date: '', sub: '', desc: '', color: 'blue' });

    // --- AUTHENTICATION ---
    const handleLogin = () => {
        if (key === 'admin123') {
            setAuth(true);
            fetchAll();
        } else {
            alert('ACCESS DENIED: INVALID SECURITY TOKEN');
        }
    };

    // --- DATA FETCHING ---
    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([
            fetch('/api/admin?type=files').then(r => r.json()).then(setFiles),
            fetch('/api/admin?type=quests').then(r => r.json()).then(setQuests),
            fetch('/api/admin?type=experience').then(r => r.json()).then(setExperience),
            fetch('/api/admin?type=profile').then(r => r.json()).then(setProfile),
        ]);
        setLoading(false);
    };

    // --- CRUD OPERATIONS ---
    const createItem = async (type: string, data: any) => {
        setLoading(true);
        let payload = { ...data };

        // Data processing
        if (type === 'quests' && typeof data.tasks === 'string') {
            payload.tasks = data.tasks.split('\n').filter((t: string) => t.trim() !== '');
        }

        await fetch(`/api/admin?type=${type}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        await fetchAll();

        // Reset forms
        if(type === 'files') setNewFile({ name: '', type: 'file', parentId: 'root', content: '' });
        if(type === 'quests') setNewQuest({ title: '', description: '', status: 'In Progress', tasks: '' });
        if(type === 'experience') setNewExp({ title: '', date: '', sub: '', desc: '', color: 'blue' });
        // Reset Project Wizard
        if(type === 'files') setProjectWizard({ name: '', desc: '', stack: '', type: 'typescript' });
    };

    const deleteItem = async (type: string, id: string) => {
        if(!confirm('CONFIRM DELETION? This action is irreversible.')) return;
        await fetch(`/api/admin?type=${type}&id=${id}`, { method: 'DELETE' });
        fetchAll();
    };

    const updateProfile = async () => {
        let payload = { ...profile };
        if (typeof profile.keySkills === 'string') {
            payload.keySkills = profile.keySkills.split(',').map((s: string) => s.trim());
        }
        await createItem('profile', payload);
        alert('PROFILE UPDATED SUCCESSFULLY');
    };

    // --- PROJECT WIZARD LOGIC ---
    const generateProject = () => {
        const { name, desc, stack, type } = projectWizard;
        if(!name) return alert("Project Name is required");

        // Auto-generate filename
        const fileName = name.toLowerCase().replace(/\s+/g, '_') + (type === 'typescript' ? '.ts' : '.py');

        // Auto-generate boilerplate content
        let content = '';
        if (type === 'typescript') {
            content = `/**
 * PROJECT: ${name}
 * STACK: ${stack}
 * --------------------------------
 * ${desc}
 */

import { Core } from '@system/core';

class ${name.replace(/\s+/g, '')}Controller {
  constructor() {
    console.log('Initializing ${name}...');
  }

  async execute() {
    // Implementation pending
    return { status: 'active', metrics: 'optimised' };
  }
}

export default new ${name.replace(/\s+/g, '')}Controller();`;
        } else {
            content = `# PROJECT: ${name}
# STACK: ${stack}
# --------------------------------
# ${desc}

import sys
import os

def main():
    print(f"Booting ${name} protocol...")
    # System logic here
    pass

if __name__ == "__main__":
    main()`;
        }

        // Send to creation
        createItem('files', {
            name: fileName,
            type: 'file',
            parentId: 'projects', // Defaults to 'projects' folder
            content: content
        });
    };

    if (!auth) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 p-10 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,255,100,0.1)] relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-slate-950 rounded-full border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <ShieldCheck className="text-green-500" size={40} />
                        </div>
                    </div>
                    <h1 className="text-center text-white text-2xl font-bold mb-2 tracking-widest">SYSTEM LINK</h1>
                    <p className="text-center text-green-500/70 text-xs mb-8 font-mono">ENCRYPTED GATEWAY v4.1</p>

                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                            <input
                                type="password"
                                value={key}
                                onChange={e => setKey(e.target.value)}
                                placeholder="ENTER ACCESS TOKEN"
                                className="w-full bg-black/50 border border-slate-700 text-center text-green-400 p-3 rounded-lg focus:border-green-500 outline-none transition-all font-mono placeholder:text-slate-700"
                            />
                        </div>
                        <button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                            ESTABLISH CONNECTION
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = {
        files: files.length,
        projects: files.filter(f => f.parentId === 'projects').length,
        quests: quests.length,
        skills: profile.keySkills?.length || 0
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20">
                <div className="p-6 border-b border-slate-800 bg-slate-900">
                    <h1 className="text-lg font-bold text-green-400 flex items-center gap-2 tracking-wider">
                        <Terminal size={20} /> ADMIN_CORE
                    </h1>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">AUTHORIZED: {profile.name?.split(' ')[0] || 'ROOT'}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'files', label: 'File System', icon: Folder },
                        { id: 'quests', label: 'Quest Log', icon: CheckCircle2 },
                        { id: 'experience', label: 'Experience', icon: Briefcase },
                        { id: 'profile', label: 'Profile Data', icon: User },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <button onClick={fetchAll} className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded hover:bg-slate-700">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> SYNC DATABASE
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10"></div>

                <div className="max-w-6xl mx-auto p-8">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Files', val: stats.files, icon: FileCode, color: 'blue' },
                                    { label: 'Active Projects', val: stats.projects, icon: Code, color: 'green' },
                                    { label: 'Quests', val: stats.quests, icon: CheckCircle2, color: 'purple' },
                                    { label: 'Skills', val: stats.skills, icon: Cpu, color: 'orange' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur-sm hover:border-slate-700 transition-all">
                                        <div className={`text-${stat.color}-400 mb-2`}><stat.icon size={24} /></div>
                                        <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><Activity size={18} /> Recent Activity</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-3 rounded border border-slate-800/50">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            System initialized successfully
                                            <span className="ml-auto text-xs text-slate-600">Now</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-3 rounded border border-slate-800/50">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            Database connected (MongoDB Atlas)
                                            <span className="ml-auto text-xs text-slate-600">1m ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center text-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                                        <User size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                                    <p className="text-sm text-green-400">{profile.profile}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FILES TAB */}
                    {activeTab === 'files' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* PROJECT WIZARD */}
                            <div className="bg-slate-900/80 p-6 rounded-xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Code size={100} /></div>
                                <h2 className="text-xl font-bold mb-2 text-green-400 flex items-center gap-2"><Plus size={20} /> Project Wizard</h2>
                                <p className="text-slate-500 text-sm mb-6 max-w-lg">
                                    Rapidly deploy new project files. This tool automatically generates code boilerplate and places the file in the
                                    <span className="font-mono text-xs bg-slate-800 px-1 py-0.5 rounded ml-1 text-slate-300">~/projects</span> directory.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="text-xs text-slate-500 uppercase block mb-1">Project Name</label>
                                        <input
                                            placeholder="e.g. NeuralNet_v1"
                                            value={projectWizard.name}
                                            onChange={e => setProjectWizard({...projectWizard, name: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-xs text-slate-500 uppercase block mb-1">Tech Stack</label>
                                        <input
                                            placeholder="e.g. React, ThreeJS"
                                            value={projectWizard.stack}
                                            onChange={e => setProjectWizard({...projectWizard, stack: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-xs text-slate-500 uppercase block mb-1">Type</label>
                                        <select
                                            value={projectWizard.type}
                                            onChange={e => setProjectWizard({...projectWizard, type: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                                        >
                                            <option value="typescript">TypeScript (.ts)</option>
                                            <option value="python">Python (.py)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <button
                                            onClick={generateProject}
                                            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Code size={18} /> GENERATE
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs text-slate-500 uppercase block mb-1">Brief Description</label>
                                    <input
                                        placeholder="What does this project do?"
                                        value={projectWizard.desc}
                                        onChange={e => setProjectWizard({...projectWizard, desc: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* MANUAL FILE CREATION */}
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2"><Folder size={18}/> Manual File System Control</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input placeholder="Filename (e.g. notes.txt)" value={newFile.name} onChange={e => setNewFile({...newFile, name: e.target.value})} className="bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                                    <select value={newFile.type} onChange={e => setNewFile({...newFile, type: e.target.value})} className="bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm">
                                        <option value="file">File</option>
                                        <option value="folder">Folder</option>
                                    </select>
                                    <input placeholder="Parent ID (e.g. root)" value={newFile.parentId} onChange={e => setNewFile({...newFile, parentId: e.target.value})} className="bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                                </div>
                                {newFile.type === 'file' && (
                                    <textarea placeholder="File Content..." value={newFile.content} onChange={e => setNewFile({...newFile, content: e.target.value})} className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-xs mb-4 focus:border-blue-500 outline-none" />
                                )}
                                <button onClick={() => createItem('files', newFile)} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 px-4 py-2 rounded flex items-center gap-2 transition-all text-sm"><Plus size={16} /> Create Node</button>
                            </div>

                            {/* FILE TABLE */}
                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-slate-950 text-slate-500 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Location (Parent)</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {files.map(f => (
                                        <tr key={f._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${f.type === 'folder' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>{f.type}</span></td>
                                            <td className="p-4 font-mono text-slate-200 flex items-center gap-2">
                                                {f.type === 'folder' ? <Folder size={14} className="text-yellow-500"/> : <FileText size={14} className="text-blue-500"/>}
                                                {f.name}
                                            </td>
                                            <td className="p-4 font-mono text-xs text-slate-500">{f.parentId}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => deleteItem('files', f._id)} className="text-slate-600 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* QUESTS TAB */}
                    {activeTab === 'quests' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-900 p-6 rounded-xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                                <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2"><CheckCircle2 size={20}/> Add New Quest</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase block mb-1">Quest Title</label>
                                            <input placeholder="e.g. Master Kubernetes" value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase block mb-1">Status</label>
                                            <select value={newQuest.status} onChange={e => setNewQuest({...newQuest, status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none">
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1">Description</label>
                                        <textarea placeholder="Describe the achievement..." value={newQuest.description} onChange={e => setNewQuest({...newQuest, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1">Tasks (One per line)</label>
                                        <textarea placeholder="- Task 1..." value={newQuest.tasks} onChange={e => setNewQuest({...newQuest, tasks: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-24 focus:border-purple-500 outline-none font-mono text-sm" />
                                    </div>
                                    <button onClick={() => createItem('quests', newQuest)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Initialize Quest</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {quests.map(q => (
                                    <div key={q._id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex justify-between items-start hover:border-slate-700 transition-all">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">{q.title}</h3>
                                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${q.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{q.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 max-w-2xl">{q.description}</p>
                                        </div>
                                        <button onClick={() => deleteItem('quests', q._id)} className="text-slate-600 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EXPERIENCE TAB */}
                    {activeTab === 'experience' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-900 p-6 rounded-xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]">
                                <h2 className="text-xl font-bold mb-6 text-orange-400 flex items-center gap-2"><Briefcase size={20}/> Add Experience</h2>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Job Title" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                                    <input placeholder="Date Range" value={newExp.date} onChange={e => setNewExp({...newExp, date: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                                    <input placeholder="Company / Subtitle" value={newExp.sub} onChange={e => setNewExp({...newExp, sub: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                                    <select value={newExp.color} onChange={e => setNewExp({...newExp, color: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none">
                                        <option value="blue">Blue Theme</option>
                                        <option value="purple">Purple Theme</option>
                                        <option value="green">Green Theme</option>
                                        <option value="red">Red Theme</option>
                                    </select>
                                </div>
                                <textarea placeholder="Description..." value={newExp.desc} onChange={e => setNewExp({...newExp, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white mb-4 h-24 focus:border-orange-500 outline-none" />
                                <button onClick={() => createItem('experience', newExp)} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Plus size={18} /> Add Record</button>
                            </div>
                            <div className="space-y-3">
                                {experience.map(e => (
                                    <div key={e._id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex justify-between items-center hover:bg-slate-900 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full bg-${e.color}-500 shadow-[0_0_10px_currentColor]`}></div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-white font-bold text-lg`}>{e.title}</span>
                                                    <span className="text-slate-500 text-xs font-mono">{e.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-400">{e.sub}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteItem('experience', e._id)} className="text-slate-600 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="bg-slate-900 p-8 rounded-xl border border-pink-500/20 max-w-3xl mx-auto shadow-[0_0_30px_rgba(236,72,153,0.05)] animate-in fade-in zoom-in-95 duration-500">
                            <h2 className="text-2xl font-bold mb-8 text-pink-400 flex items-center gap-3 border-b border-slate-800 pb-4">
                                <User size={28} />
                                User Configuration
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Full Name</label>
                                        <input value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Role / Tagline</label>
                                        <input value={profile.profile || ''} onChange={e => setProfile({...profile, profile: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 outline-none transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Bio / About Me</label>
                                    <textarea rows={6} value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 outline-none transition-colors leading-relaxed" />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Key Skills (Comma separated)</label>
                                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-2 focus-within:border-pink-500 transition-colors">
                                        <input value={Array.isArray(profile.keySkills) ? profile.keySkills.join(', ') : profile.keySkills || ''} onChange={e => setProfile({...profile, keySkills: e.target.value})} className="w-full bg-transparent border-none outline-none text-white p-2" />
                                        <div className="flex flex-wrap gap-2 px-2 pb-2">
                                            {Array.isArray(profile.keySkills) && profile.keySkills.map((s: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-slate-800 text-pink-300 px-2 py-1 rounded border border-slate-700">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Personality Type</label>
                                        <input value={profile.personality || ''} onChange={e => setProfile({...profile, personality: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase block mb-1 ml-1">Years Experience</label>
                                        <input value={profile.experience || ''} onChange={e => setProfile({...profile, experience: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 outline-none transition-colors" />
                                    </div>
                                </div>

                                <button onClick={updateProfile} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-pink-500/20 transition-all">
                                    <Save size={20} /> SAVE CONFIGURATION
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}