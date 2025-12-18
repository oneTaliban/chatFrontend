// components/Terminal/TerminalConsole.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon,
  Send,
  Folder,
  Play,
  StopCircle,
  Code,
  Copy,
  History,
  Settings,
  Shield
} from 'lucide-react';

const TerminalConsole = () => {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalSettings, setTerminalSettings] = useState({
    autoScroll: true,
    showTimestamp: true,
    theme: 'hacker',
    fontSize: 14
  });

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const commandRegistry = {
    'help': {
      description: 'Show available commands',
      execute: () => [
        'Available commands:',
        '  clear    - Clear terminal',
        '  help     - Show this help',
        '  ls       - List files',
        '  pwd      - Show current directory',
        '  scan     - Start network scan',
        '  connect  - Connect to target',
        '  exploit  - Run exploit module',
        '  exit     - Exit terminal',
        '',
        'Type help [command] for more info'
      ]
    },
    'clear': {
      description: 'Clear terminal output',
      execute: () => {
        setCommands([]);
        return ['Terminal cleared.'];
      }
    },
    'scan': {
      description: 'Start network scan',
      execute: async () => {
        setIsProcessing(true);
        const responses = [
          'Starting network reconnaissance...',
          'Scanning 192.168.1.0/24',
          'Discovered 12 active hosts',
          'Port scanning initiated',
          '3 open ports found on target',
          'Scan completed successfully'
        ];
        
        for (const response of responses) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setCommands(prev => [...prev, { type: 'output', content: response }]);
        }
        setIsProcessing(false);
        return ['Network scan completed.'];
      }
    },
    'connect': {
      description: 'Connect to target system',
      execute: () => [
        'Establishing secure connection...',
        'Handshake protocol: TLS 1.3',
        'Authentication: RSA-2048',
        'Connection established successfully',
        'Target system: Windows Server 2019',
        'Session ID: XJ8H-3K9L-7M2N-4P5Q'
      ]
    }
  };

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Welcome message
    setCommands([
      { type: 'output', content: 'TERMINAL v2.1.4 - SECURE ACCESS' },
      { type: 'output', content: 'Initializing encrypted session...' },
      { type: 'output', content: 'Authentication: SUCCESS' },
      { type: 'output', content: 'Access level: ADMINISTRATOR' },
      { type: 'output', content: 'Type "help" for available commands' }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalSettings.autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands, terminalSettings.autoScroll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    setInput('');
    setCommandHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);

    // Add command to output
    setCommands(prev => [...prev, { type: 'input', content: command }]);

    // Process command
    const cmd = command.split(' ')[0].toLowerCase();
    if (cmd === 'exit') {
      setCommands(prev => [...prev, { type: 'output', content: 'Session terminated.' }]);
      return;
    }

    if (commandRegistry[cmd]) {
      const result = await commandRegistry[cmd].execute();
      if (Array.isArray(result)) {
        result.forEach(line => {
          setCommands(prev => [...prev, { type: 'output', content: line }]);
        });
      }
    } else {
      setCommands(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${cmd}. Type "help" for available commands.` 
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion
      const partial = input.toLowerCase();
      const matches = Object.keys(commandRegistry).filter(cmd => 
        cmd.startsWith(partial)
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  const getOutputColor = (type) => {
    switch(type) {
      case 'input': return 'text-hacker-green';
      case 'output': return 'text-white';
      case 'error': return 'text-hacker-red';
      default: return 'text-gray-400';
    }
  };

  const getPrompt = () => {
    return (
      <span className="font-mono">
        <span className="text-hacker-green">operator@c2</span>
        <span className="text-white">:</span>
        <span className="text-hacker-blue">~</span>
        <span className="text-white">$ </span>
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="terminal-window h-full flex flex-col"
    >
      {/* Terminal Header */}
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TerminalIcon className="w-5 h-5 text-hacker-green" />
          <span className="font-cyber font-bold text-white">TERMINAL</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-hacker-green"></div>
            <span className="text-xs font-mono text-hacker-green">ACTIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-cyber-light rounded">
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-cyber-light rounded">
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto terminal-scrollbar bg-terminal-bg/50"
        style={{ fontSize: `${terminalSettings.fontSize}px` }}
      >
        <div className="space-y-1 font-mono">
          <AnimatePresence>
            {commands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-pre-wrap"
              >
                {cmd.type === 'input' ? (
                  <div>
                    {getPrompt()}
                    <span className="text-hacker-green">{cmd.content}</span>
                  </div>
                ) : (
                  <div className={getOutputColor(cmd.type)}>
                    {terminalSettings.showTimestamp && (
                      <span className="text-gray-500 mr-2">
                        [{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                      </span>
                    )}
                    {cmd.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Current Input Line */}
          <div className="flex items-center">
            {getPrompt()}
            <form onSubmit={handleSubmit} className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                autoComplete="off"
                spellCheck="false"
              />
              {isProcessing && (
                <div className="flex items-center space-x-2 ml-2">
                  <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </form>
          </div>
          
          {/* Blinking cursor */}
          <div className="inline-block w-2 h-5 bg-hacker-green animate-cursor-blink ml-1"></div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-terminal-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => commandRegistry.clear.execute()}
              className="px-3 py-1 text-xs font-mono bg-cyber-dark border border-terminal-border rounded hover:border-hacker-green"
            >
              Clear
            </button>
            
            <button
              onClick={() => setInput('help')}
              className="px-3 py-1 text-xs font-mono bg-cyber-dark border border-terminal-border rounded hover:border-hacker-green"
            >
              Help
            </button>
            
            <button
              onClick={() => {
                const randomCommand = ['scan', 'connect', 'ls'][Math.floor(Math.random() * 3)];
                setInput(randomCommand);
              }}
              className="px-3 py-1 text-xs font-mono bg-cyber-dark border border-terminal-border rounded hover:border-hacker-green"
            >
              Quick Command
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xs font-mono text-gray-400">
              {commands.length} lines
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-hacker-green" />
              <span className="text-xs font-mono text-hacker-green">ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="border-t border-terminal-border p-2">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {Object.entries(commandRegistry).map(([cmd, config]) => (
            <motion.button
              key={cmd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInput(cmd);
                inputRef.current?.focus();
              }}
              className="px-3 py-1 text-xs font-mono bg-cyber-dark border border-terminal-border rounded whitespace-nowrap"
            >
              {cmd}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TerminalConsole;