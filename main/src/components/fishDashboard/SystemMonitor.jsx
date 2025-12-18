// components/Monitor/SystemMonitor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Thermometer, 
  Activity,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { LineChart, Line, Area, AreaChart, ResponsiveContainer } from 'recharts';

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 68,
    network: 120,
    storage: 82,
    temperature: 42,
    connections: 18
  });

  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [networkHistory, setNetworkHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Simulate real-time metric updates
    intervalRef.current = setInterval(() => {
      const newMetrics = {
        cpu: Math.min(100, Math.max(0, metrics.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, metrics.memory + (Math.random() * 4 - 2))),
        network: Math.max(0, metrics.network + (Math.random() * 40 - 20)),
        storage: metrics.storage + 0.1,
        temperature: Math.min(90, Math.max(30, metrics.temperature + (Math.random() * 2 - 1))),
        connections: Math.max(0, metrics.connections + (Math.random() > 0.5 ? 1 : -1))
      };

      setMetrics(newMetrics);

      // Update history
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCpuHistory(prev => [...prev.slice(-19), { time: timestamp, value: newMetrics.cpu }]);
      setMemoryHistory(prev => [...prev.slice(-19), { time: timestamp, value: newMetrics.memory }]);
      setNetworkHistory(prev => [...prev.slice(-19), { time: timestamp, value: newMetrics.network }]);

      // Generate alerts
      if (newMetrics.cpu > 90 && Math.random() > 0.7) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'critical',
          message: `CPU usage critical: ${newMetrics.cpu.toFixed(1)}%`,
          time: new Date()
        }, ...prev.slice(0, 4)]);
      }
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [metrics]);

  const MetricCard = ({ title, value, unit, icon: Icon, color, max = 100, history }) => {
    const percentage = (value / max) * 100;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="terminal-window p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${color}/20 border border-${color}/30`}>
              <Icon className={`w-5 h-5 text-${color}`} />
            </div>
            <div>
              <div className="text-sm font-mono text-gray-400">{title}</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-cyber font-bold text-white">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </span>
                <span className="text-sm font-mono text-gray-400 ml-1">{unit}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs font-mono px-2 py-1 rounded ${percentage > 80 ? 'bg-red-900/30 text-hacker-red' : percentage > 60 ? 'bg-yellow-900/30 text-yellow-500' : 'bg-green-900/30 text-hacker-green'}`}>
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-cyber-light rounded-full overflow-hidden mb-3">
          <motion.div
            className={`h-full bg-gradient-to-r from-${color} to-${color}/70`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Mini chart */}
        {history && history.length > 0 && (
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={`url(#gradient-${title})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-cyber font-bold text-white">SYSTEM MONITOR</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse"></div>
          <span className="text-xs font-mono text-hacker-green">LIVE</span>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="terminal-window border-hacker-red"
        >
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-hacker-red" />
              <div className="flex-1">
                <div className="font-mono text-sm text-white">
                  {alerts[0].message}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {alerts[0].time.toLocaleTimeString()}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 text-xs font-mono bg-hacker-red/20 text-hacker-red rounded"
                onClick={() => setAlerts([])}
              >
                DISMISS
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="CPU USAGE"
          value={metrics.cpu}
          unit="%"
          icon={Cpu}
          color="hacker-green"
          history={cpuHistory}
        />
        
        <MetricCard
          title="MEMORY"
          value={metrics.memory}
          unit="%"
          icon={MemoryStick}
          color="hacker-blue"
          history={memoryHistory}
        />
        
        <MetricCard
          title="NETWORK"
          value={metrics.network}
          unit="MB/s"
          icon={Network}
          color="hacker-purple"
          max={200}
          history={networkHistory}
        />
        
        <MetricCard
          title="STORAGE"
          value={metrics.storage}
          unit="%"
          icon={HardDrive}
          color="matrix-green"
        />
        
        <MetricCard
          title="TEMPERATURE"
          value={metrics.temperature}
          unit="°C"
          icon={Thermometer}
          color="hacker-red"
          max={100}
        />
        
        <MetricCard
          title="CONNECTIONS"
          value={metrics.connections}
          unit=""
          icon={Activity}
          color="hacker-blue"
          max={50}
        />
      </div>

      {/* System Overview Chart */}
      <div className="terminal-window p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-hacker-green" />
            <span className="font-cyber font-bold text-white">SYSTEM OVERVIEW</span>
          </div>
          <div className="flex items-center space-x-4">
            {['1H', '6H', '24H', '7D'].map((period) => (
              <button
                key={period}
                className="px-3 py-1 text-xs font-mono rounded-lg bg-cyber-dark border border-terminal-border text-gray-400 hover:text-white hover:border-hacker-green transition-colors"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cpuHistory}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00ff41"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="terminal-window p-4 border-hacker-blue">
        <div className="flex items-start space-x-3">
          <Zap className="w-5 h-5 text-hacker-blue mt-1" />
          <div>
            <div className="font-cyber font-bold text-white mb-2">PERFORMANCE TIPS</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">CPU Optimization</span>
                <span className="font-mono text-hacker-green">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Memory Cache</span>
                <span className="font-mono text-hacker-green">ENABLED</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Network Compression</span>
                <span className="font-mono text-yellow-500">PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemMonitor;