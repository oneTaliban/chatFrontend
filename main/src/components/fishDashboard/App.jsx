// App.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './components/Background/MatrixRain';
import CyberHeader from './components/Layout/CyberHeader';
import TerminalCard from './components/Dashboard/TerminalCard';
import SystemMonitor from './components/Monitor/SystemMonitor';
import GeoMap from './components/Maps/GeoMap';
import DataTable from './components/Tables/DataTable';
import TerminalConsole from './components/Terminal/TerminalConsole';
import AgentManager from './components/Agents/AgentManager';
import FileExplorer from './components/Files/FileExplorer';
import TaskManager from './components/Tasks/TaskManager';
import LogViewer from './components/Logs/LogViewer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'tasks', label: 'Tasks', icon: '⚙️' },
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'logs', label: 'Logs', icon: '📝' },
    { id: 'terminal', label: 'Terminal', icon: '💻' },
    { id: 'maps', label: 'Geolocation', icon: '📍' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      <MatrixRain />
      <CyberHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-cyber font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-hacker-green text-terminal-bg'
                  : 'bg-terminal-header border border-terminal-border hover:border-hacker-green'
              }`}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SystemMonitor />
                </div>
                <div>
                  <GeoMap />
                </div>
              </div>
              <DataTable />
            </>
          )}

          {activeTab === 'agents' && <AgentManager />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'files' && <FileExplorer />}
          {activeTab === 'logs' && <LogViewer />}
          {activeTab === 'terminal' && <TerminalConsole />}
          {activeTab === 'maps' && <GeoMap />}
        </div>
      </main>
    </div>
  );
}

export default App;