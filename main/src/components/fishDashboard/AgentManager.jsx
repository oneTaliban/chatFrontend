// components/Agents/AgentManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Wifi,
  WifiOff,
  Shield,
  AlertTriangle,
  Play,
  StopCircle,
  Download,
  Upload,
  Terminal,
  MoreVertical,
  RefreshCw,
  Users,
  Clock
} from 'lucide-react';

const AgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate initial agents
    const mockAgents = [
      {
        id: 'AGENT-001',
        name: 'Windows-CLIENT',
        status: 'active',
        ip: '192.168.1.100',
        os: 'Windows 10',
        lastSeen: new Date(Date.now() - 30000),
        uptime: '3d 5h',
        tasks: 2,
        cpu: 45,
        memory: 68
      },
      {
        id: 'AGENT-002',
        name: 'Linux-SERVER',
        status: 'active',
        ip: '10.0.0.45',
        os: 'Ubuntu 20.04',
        lastSeen: new Date(Date.now() - 120000),
        uptime: '15d 2h',
        tasks: 0,
        cpu: 12,
        memory: 34
      },
      {
        id: 'AGENT-003',
        name: 'MacOS-USER',
        status: 'inactive',
        ip: '172.16.0.22',
        os: 'macOS 13',
        lastSeen: new Date(Date.now() - 3600000),
        uptime: '2h 30m',
        tasks: 1,
        cpu: 0,
        memory: 0
      },
      {
        id: 'AGENT-004',
        name: 'Android-MOBILE',
        status: 'connecting',
        ip: '192.168.100.1',
        os: 'Android 12',
        lastSeen: new Date(Date.now() - 5000),
        uptime: '30m',
        tasks: 0,
        cpu: 28,
        memory: 45
      }
    ];
    setAgents(mockAgents);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastSeen: new Date(),
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100)
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCommand = (agentId, command) => {
    // Handle agent commands
    console.log(`Sending command ${command} to agent ${agentId}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-hacker-green';
      case 'inactive': return 'text-gray-400';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-hacker-red';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Wifi className="w-4 h-4" />;
      case 'inactive': return <WifiOff className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-hacker-green" />
          <div>
            <h3 className="text-lg font-cyber font-bold text-white">AGENT MANAGEMENT</h3>
            <div className="text-xs font-mono text-gray-400">
              {agents.filter(a => a.status === 'active').length} active • {agents.length} total
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border font-mono text-sm flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
          
          <button className="px-4 py-2 rounded-lg bg-hacker-green/20 text-hacker-green font-mono text-sm">
            + Deploy Agent
          </button>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedAgent(agent)}
              className={`terminal-window cursor-pointer ${
                selectedAgent?.id === agent.id ? 'border-hacker-green' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(agent.status).replace('text-', 'bg-')}/20 border ${getStatusColor(agent.status).replace('text-', 'border-')}/30`}>
                      {getStatusIcon(agent.status)}
                    </div>
                    <div>
                      <div className="font-cyber font-bold text-white">{agent.name}</div>
                      <div className="text-xs font-mono text-gray-400">{agent.id}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs font-mono px-2 py-1 rounded ${getStatusColor(agent.status).replace('text-', 'bg-')}/20 ${getStatusColor(agent.status)}`}>
                      {agent.status.toUpperCase()}
                    </div>
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      {agent.ip}
                    </div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Operating System</div>
                    <div className="text-sm font-mono text-white">{agent.os}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Last Seen</div>
                    <div className="text-sm font-mono text-white">
                      {Math.floor((Date.now() - agent.lastSeen) / 1000)}s ago
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Uptime</div>
                    <div className="text-sm font-mono text-white">{agent.uptime}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Active Tasks</div>
                    <div className="text-sm font-mono text-white">{agent.tasks}</div>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="font-mono">{agent.cpu}%</span>
                  </div>
                  <div className="h-2 bg-cyber-light rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        agent.cpu > 80 ? 'bg-hacker-red' : 
                        agent.cpu > 50 ? 'bg-yellow-500' : 'bg-hacker-green'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.cpu}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Memory Usage</span>
                    <span className="font-mono">{agent.memory}%</span>
                  </div>
                  <div className="h-2 bg-cyber-light rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        agent.memory > 80 ? 'bg-hacker-red' : 
                        agent.memory > 50 ? 'bg-yellow-500' : 'bg-hacker-blue'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.memory}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-terminal-border">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommand(agent.id, 'shell');
                      }}
                      className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
                      title="Open Shell"
                    >
                      <Terminal className="w-4 h-4 text-gray-400" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommand(agent.id, 'upload');
                      }}
                      className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
                      title="Upload File"
                    >
                      <Upload className="w-4 h-4 text-gray-400" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommand(agent.id, 'download');
                      }}
                      className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
                      title="Download File"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                  
                  <button className="p-2 hover:bg-cyber-light rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected Agent Details */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-window border-hacker-green"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-6 h-6 text-hacker-green" />
                  <div>
                    <h4 className="text-lg font-cyber font-bold text-white">
                      {selectedAgent.name}
                    </h4>
                    <div className="text-sm font-mono text-gray-400">
                      Agent ID: {selectedAgent.id} • IP: {selectedAgent.ip}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-sm font-mono text-gray-400 hover:text-white"
                >
                  CLOSE
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 rounded-lg bg-cyber-dark">
                  <div className="text-2xl font-cyber font-bold text-hacker-green">
                    {selectedAgent.cpu}%
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1">CPU</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-cyber-dark">
                  <div className="text-2xl font-cyber font-bold text-hacker-blue">
                    {selectedAgent.memory}%
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1">MEMORY</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-cyber-dark">
                  <div className="text-2xl font-cyber font-bold text-hacker-purple">
                    {selectedAgent.tasks}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1">ACTIVE TASKS</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-cyber-dark">
                  <div className="text-2xl font-cyber font-bold text-matrix-green">
                    {selectedAgent.uptime}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1">UPTIME</div>
                </div>
              </div>

              {/* Command Panel */}
              <div className="space-y-4">
                <div className="font-cyber font-bold text-white mb-2">QUICK COMMANDS</div>
                <div className="flex flex-wrap gap-2">
                  {['Shell Access', 'File Browser', 'Keylogger', 'Screenshot', 'Webcam', 'Mic', 'Process List', 'Network Scan'].map((cmd) => (
                    <motion.button
                      key={cmd}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border text-sm font-mono hover:border-hacker-green"
                    >
                      {cmd}
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg bg-hacker-green/20 text-hacker-green font-mono flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>START TASK</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg bg-hacker-red/20 text-hacker-red font-mono flex items-center space-x-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>TERMINATE AGENT</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deployment Panel */}
      <div className="terminal-window p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-hacker-green" />
            <div className="font-cyber font-bold text-white">AGENT DEPLOYMENT</div>
          </div>
          <div className="text-xs font-mono text-gray-400">
            Payload Builder v2.1
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-cyber-dark border border-terminal-border">
            <div className="text-sm font-mono text-gray-400 mb-2">Windows</div>
            <div className="text-xs text-gray-500 mb-3">.exe • .ps1 • .dll</div>
            <button className="w-full py-2 text-sm font-mono bg-hacker-green/20 text-hacker-green rounded hover:bg-hacker-green/30">
              Generate Payload
            </button>
          </div>
          
          <div className="p-4 rounded-lg bg-cyber-dark border border-terminal-border">
            <div className="text-sm font-mono text-gray-400 mb-2">Linux</div>
            <div className="text-xs text-gray-500 mb-3">.elf • .sh • .py</div>
            <button className="w-full py-2 text-sm font-mono bg-hacker-blue/20 text-hacker-blue rounded hover:bg-hacker-blue/30">
              Generate Payload
            </button>
          </div>
          
          <div className="p-4 rounded-lg bg-cyber-dark border border-terminal-border">
            <div className="text-sm font-mono text-gray-400 mb-2">macOS</div>
            <div className="text-xs text-gray-500 mb-3">.app • .pkg • .dmg</div>
            <button className="w-full py-2 text-sm font-mono bg-hacker-purple/20 text-hacker-purple rounded hover:bg-hacker-purple/30">
              Generate Payload
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentManager;