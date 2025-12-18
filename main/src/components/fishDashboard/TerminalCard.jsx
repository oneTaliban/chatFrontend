// components/Dashboard/TerminalCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Globe, 
  Shield, 
  User, 
  Zap,
  AlertTriangle,
  Terminal
} from 'lucide-react';

const TerminalCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'hacker-green',
  loading = false,
  onClick 
}) => {
  const colorClasses = {
    'hacker-green': 'border-hacker-green text-hacker-green',
    'hacker-blue': 'border-hacker-blue text-hacker-blue',
    'hacker-purple': 'border-hacker-purple text-hacker-purple',
    'hacker-red': 'border-hacker-red text-hacker-red',
    'matrix-green': 'border-matrix-green text-matrix-green',
  };

  const iconColors = {
    'hacker-green': 'text-hacker-green',
    'hacker-blue': 'text-hacker-blue',
    'hacker-purple': 'text-hacker-purple',
    'hacker-red': 'text-hacker-red',
    'matrix-green': 'text-matrix-green',
  };

  const iconMap = {
    Activity, Cpu, Globe, Shield, User, Zap, AlertTriangle, Terminal
  };

  const SelectedIcon = iconMap[Icon?.name] || Terminal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 30px rgba(0, 255, 0, 0.3)"
      }}
      className={`terminal-window group cursor-pointer hover:shadow-hacker-lg transition-all duration-300 ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="terminal-dot close"></div>
          <div className="terminal-dot minimize"></div>
          <div className="terminal-dot maximize"></div>
        </div>
        <span className="text-xs font-cyber tracking-wider opacity-70">{title}</span>
      </div>
      
      <div className="p-6 relative overflow-hidden">
        {/* Animated background lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"></div>
        </div>
        
        {/* Data stream effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-current to-transparent opacity-20 group-hover:opacity-40 transition-opacity"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-cyber-dark border ${colorClasses[color]} bg-opacity-50`}>
              <SelectedIcon className={`w-6 h-6 ${iconColors[color]}`} />
            </div>
            
            {change && (
              <motion.div 
                className={`px-3 py-1 rounded-full text-xs font-mono ${
                  change.startsWith('+') 
                    ? 'bg-green-900/30 text-hacker-green' 
                    : 'bg-red-900/30 text-hacker-red'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {change}
              </motion.div>
            )}
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <div className="h-6 bg-cyber-light rounded animate-pulse"></div>
              <div className="h-4 bg-cyber-light rounded animate-pulse w-2/3"></div>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold font-cyber tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </span>
                  <span className="text-xs font-mono opacity-70 mb-1">units</span>
                </div>
              </div>
              
              <div className="h-1 w-full bg-cyber-light rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${color === 'hacker-green' ? 'bg-hacker-green' : `bg-${color}`}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseInt(value) / 1000) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-terminal-border border-opacity-30">
                <div className="flex justify-between text-xs font-mono opacity-70">
                  <span>Active</span>
                  <span className={`${iconColors[color]} animate-pulse`}>LIVE</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Glitch effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default TerminalCard;