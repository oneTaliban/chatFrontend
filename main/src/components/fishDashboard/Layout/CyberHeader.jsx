// components/Layout/CyberHeader.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Wifi, 
  Clock, 
  User,
  Settings,
  Bell,
  Search
} from 'lucide-react';

const CyberHeader = () => {
  const [time, setTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('secure');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const connectionColors = {
    secure: 'text-hacker-green',
    warning: 'text-yellow-500',
    danger: 'text-hacker-red'
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 bg-terminal-header/95 backdrop-blur-lg border-b border-terminal-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and System Status */}
          <div className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Terminal className="w-8 h-8 text-hacker-green" />
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-hacker-green rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div>
                <h1 className="text-xl font-cyber font-bold tracking-wider">
                  <span className="text-hacker-green">SYSTEM</span>
                  <span className="text-white">_CTRL</span>
                </h1>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <div className={`flex items-center ${connectionColors[connectionStatus]}`}>
                    <Wifi className="w-3 h-3 mr-1" />
                    <span>{connectionStatus.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-hacker-blue">v2.1.4</span>
                </div>
              </div>
            </motion.div>

            {/* System Indicators */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-hacker-purple" />
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-4 mx-0.5 bg-hacker-purple"
                      animate={{ height: ['8px', '16px', '8px'] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1,
                        delay: i * 0.1 
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-hacker-green" />
                <div className="text-xs font-mono">
                  <span className="text-hacker-green">ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH SYSTEMS..."
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-terminal-border rounded-lg 
                         font-mono text-sm text-white placeholder-gray-500 focus:outline-none 
                         focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-1 w-full"
                  >
                    <div className="terminal-window p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Quick Search</span>
                          <span className="text-xs font-mono text-hacker-green">ENTER</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: User and Time */}
          <div className="flex items-center space-x-4">
            {/* Time Display */}
            <motion.div 
              className="text-right"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="text-lg font-cyber font-bold tracking-wider text-white">
                {formatTime(time)}
              </div>
              <div className="text-xs font-mono text-gray-400">
                {formatDate(time)}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-cyber-dark border border-terminal-border"
            >
              <Bell className="w-5 h-5 text-white" />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-hacker-red rounded-full 
                           flex items-center justify-center"
                >
                  <span className="text-xs font-bold">{notifications}</span>
                </motion.div>
              )}
            </motion.button>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-2 rounded-lg bg-cyber-dark border border-terminal-border cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-hacker-blue to-hacker-purple 
                            flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-cyber font-bold text-white">OPERATOR_01</div>
                <div className="text-xs font-mono text-hacker-green">ADMIN ACCESS</div>
              </div>
              <Settings className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Connection Status Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1 }}
          className="mt-4 h-1 bg-gradient-to-r from-hacker-green via-hacker-blue to-hacker-purple rounded-full"
        />
      </div>
    </motion.header>
  );
};

export default CyberHeader;