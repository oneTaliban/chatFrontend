// components/Tasks/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  StopCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Terminal,
  FileText,
  Download,
  Upload,
  Copy,
  Key,
  Eye,
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    agent: 'all'
  });
  const [newTask, setNewTask] = useState({
    type: 'command',
    command: '',
    agent: '',
    timeout: 60
  });

  useEffect(() => {
    // Simulate initial tasks
    const mockTasks = [
      {
        id: 'TASK-001',
        name: 'System Information',
        type: 'command',
        status: 'completed',
        agent: 'AGENT-001',
        command: 'systeminfo',
        output: 'OS Name: Microsoft Windows 10 Pro\nOS Version: 10.0.19045\nProcessor: Intel Core i7-10700K',
        createdAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3500000),
        exitCode: 0
      },
      {
        id: 'TASK-002',
        name: 'File Download',
        type: 'download',
        status: 'running',
        agent: 'AGENT-002',
        command: 'download /home/user/documents',
        progress: 65,
        createdAt: new Date(Date.now() - 120000),
        estimatedCompletion: new Date(Date.now() + 60000)
      },
      {
        id: 'TASK-003',
        name: 'Keylogger Start',
        type: 'keylogger',
        status: 'failed',
        agent: 'AGENT-001',
        command: 'start_keylogger',
        output: 'Error: Permission denied',
        createdAt: new Date(Date.now() - 1800000),
        completedAt: new Date(Date.now() - 1790000),
        exitCode: 1
      },
      {
        id: 'TASK-004',
        name: 'Network Scan',
        type: 'scan',
        status: 'pending',
        agent: 'AGENT-004',
        command: 'nmap -sS 192.168.1.0/24',
        createdAt: new Date(Date.now() - 30000)
      },
      {
        id: 'TASK-005',
        name: 'Screenshot Capture',
        type: 'screenshot',
        status: 'completed',
        agent: 'AGENT-003',
        command: 'screenshot',
        output: 'Screenshot saved to /tmp/screen.png',
        createdAt: new Date(Date.now() - 2400000),
        completedAt: new Date(Date.now() - 2390000),
        exitCode: 0
      }
    ];
    setTasks(mockTasks);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-hacker-green';
      case 'running': return 'text-hacker-blue';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-hacker-red';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return CheckCircle;
      case 'running': return Play;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return AlertCircle;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'command': return Terminal;
      case 'download': return Download;
      case 'upload': return Upload;
      case 'keylogger': return Key;
      case 'screenshot': return Eye;
      default: return FileText;
    }
  };

  const handleCreateTask = () => {
    if (!newTask.command.trim() || !newTask.agent.trim()) return;

    const task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      name: `Task ${tasks.length + 1}`,
      type: newTask.type,
      status: 'pending',
      agent: newTask.agent,
      command: newTask.command,
      createdAt: new Date(),
      progress: 0
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ type: 'command', command: '', agent: '', timeout: 60 });
  };

  const handleTaskAction = (taskId, action) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        switch(action) {
          case 'start':
            return { ...task, status: 'running', progress: 0 };
          case 'stop':
            return { ...task, status: 'completed', progress: 100 };
          case 'pause':
            return { ...task, status: 'pending' };
          case 'delete':
            return null;
          default:
            return task;
        }
      }
      return task;
    }).filter(Boolean));
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.type !== 'all' && task.type !== filters.type) return false;
    if (filters.agent !== 'all' && task.agent !== filters.agent) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Terminal className="w-6 h-6 text-hacker-green" />
          <div>
            <h3 className="text-lg font-cyber font-bold text-white">TASK MANAGER</h3>
            <div className="text-xs font-mono text-gray-400">
              {tasks.filter(t => t.status === 'running').length} running • {tasks.length} total
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border font-mono text-sm">
            History
          </button>
          <button className="px-4 py-2 rounded-lg bg-hacker-green/20 text-hacker-green font-mono text-sm">
            + New Task
          </button>
        </div>
      </div>

      {/* Create Task Panel */}
      <div className="terminal-window p-6">
        <div className="font-cyber font-bold text-white mb-4">CREATE NEW TASK</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Task Type</label>
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              className="w-full bg-cyber-dark border border-terminal-border rounded px-3 py-2 text-white font-mono"
            >
              <option value="command">Command Execution</option>
              <option value="download">File Download</option>
              <option value="upload">File Upload</option>
              <option value="keylogger">Keylogger</option>
              <option value="screenshot">Screenshot</option>
              <option value="scan">Network Scan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Target Agent</label>
            <select
              value={newTask.agent}
              onChange={(e) => setNewTask({ ...newTask, agent: e.target.value })}
              className="w-full bg-cyber-dark border border-terminal-border rounded px-3 py-2 text-white font-mono"
            >
              <option value="">Select Agent</option>
              {[...new Set(tasks.map(t => t.agent))].map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-mono text-gray-400 mb-2">Command</label>
            <textarea
              value={newTask.command}
              onChange={(e) => setNewTask({ ...newTask, command: e.target.value })}
              placeholder="Enter command to execute..."
              rows="3"
              className="w-full bg-cyber-dark border border-terminal-border rounded px-3 py-2 text-white font-mono resize-none"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">Timeout (seconds)</label>
              <input
                type="number"
                value={newTask.timeout}
                onChange={(e) => setNewTask({ ...newTask, timeout: parseInt(e.target.value) })}
                className="w-32 bg-cyber-dark border border-terminal-border rounded px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTask}
            disabled={!newTask.command.trim() || !newTask.agent.trim()}
            className={`px-6 py-3 rounded-lg font-mono font-bold flex items-center space-x-2
                      ${newTask.command.trim() && newTask.agent.trim()
                        ? 'bg-hacker-green text-terminal-bg hover:bg-hacker-green/90'
                        : 'bg-cyber-dark text-gray-400 cursor-not-allowed'}`}
          >
            <Play className="w-4 h-4" />
            <span>EXECUTE TASK</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 rounded-lg bg-cyber-dark border border-terminal-border">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 text-sm font-mono"
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 text-sm font-mono"
        >
          <option value="all">All Types</option>
          <option value="command">Command</option>
          <option value="download">Download</option>
          <option value="upload">Upload</option>
          <option value="keylogger">Keylogger</option>
        </select>
        
        <select
          value={filters.agent}
          onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
          className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 text-sm font-mono"
        >
          <option value="all">All Agents</option>
          {[...new Set(tasks.map(t => t.agent))].map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            const TypeIcon = getTypeIcon(task.type);
            const statusColor = getStatusColor(task.status);

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedTask(task)}
                className={`terminal-window cursor-pointer ${
                  selectedTask?.id === task.id ? 'border-hacker-green' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${statusColor.replace('text-', 'bg-')}/20 border ${statusColor.replace('text-', 'border-')}/30`}>
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                      </div>
                      <div>
                        <div className="font-cyber font-bold text-white">{task.name}</div>
                        <div className="text-xs font-mono text-gray-400">{task.id}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-xs font-mono px-2 py-1 rounded ${statusColor.replace('text-', 'bg-')}/20 ${statusColor}`}>
                          {task.status.toUpperCase()}
                        </div>
                        <div className="text-xs font-mono text-gray-400 mt-1">
                          {task.agent}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <TypeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-mono text-gray-400">{task.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-mono text-gray-300 break-all">
                      {task.command}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-mono">{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-cyber-light rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${statusColor.replace('text-', 'bg-')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Task Info */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400">
                          {task.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      {task.completedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-hacker-green" />
                          <span className="text-gray-400">
                            {Math.floor((task.completedAt - task.createdAt) / 1000)}s
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.status === 'running' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, 'pause');
                            }}
                            className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-500"
                          >
                            <Pause className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, 'stop');
                            }}
                            className="px-3 py-1 rounded bg-hacker-red/20 text-hacker-red"
                          >
                            <StopCircle className="w-3 h-3" />
                          </motion.button>
                        </>
                      )}
                      
                      {task.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskAction(task.id, 'start');
                          }}
                          className="px-3 py-1 rounded bg-hacker-green/20 text-hacker-green"
                        >
                          <Play className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Task Details */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-window border-hacker-green"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Terminal className="w-6 h-6 text-hacker-green" />
                  <div>
                    <h4 className="text-lg font-cyber font-bold text-white">
                      {selectedTask.name}
                    </h4>
                    <div className="text-sm font-mono text-gray-400">
                      Task ID: {selectedTask.id} • Agent: {selectedTask.agent}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-sm font-mono text-gray-400 hover:text-white"
                >
                  CLOSE
                </button>
              </div>

              {/* Task Output */}
              <div className="mb-6">
                <div className="font-cyber font-bold text-white mb-3">OUTPUT</div>
                <div className="p-4 rounded-lg bg-terminal-bg border border-terminal-border font-mono text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedTask.output || 'No output available'}
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-cyber-dark">
                  <div className="text-xs font-mono text-gray-400">Status</div>
                  <div className={`text-sm font-mono font-bold ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-cyber-dark">
                  <div className="text-xs font-mono text-gray-400">Type</div>
                  <div className="text-sm font-mono text-white">
                    {selectedTask.type.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-cyber-dark">
                  <div className="text-xs font-mono text-gray-400">Created</div>
                  <div className="text-sm font-mono text-white">
                    {selectedTask.createdAt.toLocaleString()}
                  </div>
                </div>
                
                {selectedTask.completedAt && (
                  <div className="p-3 rounded-lg bg-cyber-dark">
                    <div className="text-xs font-mono text-gray-400">Duration</div>
                    <div className="text-sm font-mono text-white">
                      {Math.floor((selectedTask.completedAt - selectedTask.createdAt) / 1000)}s
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskManager;