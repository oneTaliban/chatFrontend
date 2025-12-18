// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import CyberHeader from '../components/Layout/CyberHeader';
import MatrixRain from '../components/Background/MatrixRain';
import TerminalCard from '../components/Dashboard/TerminalCard';
import HackerTimeline from '../components/Charts/HackerTimeline';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import GeoMap from '../components/Maps/GeoMap';
import SystemMonitor from '../components/Monitor/SystemMonitor';

// Icons
import { 
  Activity, 
  Cpu, 
  Globe, 
  Shield, 
  User, 
  Zap,
  Terminal,
  AlertTriangle,
  Database,
  Network,
  Lock
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    uniqueFingerprints: 0,
    keystrokesLogged: 0,
    geolocations: 0,
    evasionAttempts: 0,
    activeConnections: 0
  });

  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize GSAP animations
    gsap.from('.dashboard-grid > *', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.dashboard-grid',
        start: "top 80%"
      }
    });

    // Load initial data
    fetchDashboardData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      const mockStats = {
        totalSubmissions: Math.floor(Math.random() * 1000) + 500,
        uniqueFingerprints: Math.floor(Math.random() * 500) + 200,
        keystrokesLogged: Math.floor(Math.random() * 10000) + 5000,
        geolocations: Math.floor(Math.random() * 300) + 100,
        evasionAttempts: Math.floor(Math.random() * 50) + 10,
        activeConnections: Math.floor(Math.random() * 20) + 5
      };

      const mockTimeline = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        phishing: Math.floor(Math.random() * 100),
        fingerprints: Math.floor(Math.random() * 50),
        keystrokes: Math.floor(Math.random() * 200)
      }));

      setStats(mockStats);
      setTimelineData(mockTimeline);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      change: '+12%',
      icon: { name: 'User' },
      color: 'hacker-green'
    },
    {
      title: 'Unique Fingerprints',
      value: stats.uniqueFingerprints,
      change: '+8%',
      icon: { name: 'Fingerprint' },
      color: 'hacker-blue'
    },
    {
      title: 'Keystrokes Logged',
      value: stats.keystrokesLogged,
      change: '+15%',
      icon: { name: 'Keyboard' },
      color: 'hacker-purple'
    },
    {
      title: 'Geolocations',
      value: stats.geolocations,
      change: '+5%',
      icon: { name: 'Globe' },
      color: 'matrix-green'
    },
    {
      title: 'Evasion Attempts',
      value: stats.evasionAttempts,
      change: '+3%',
      icon: { name: 'Shield' },
      color: 'hacker-red'
    },
    {
      title: 'Active Connections',
      value: stats.activeConnections,
      change: '+7%',
      icon: { name: 'Network' },
      color: 'hacker-green'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark overflow-x-hidden">
      {/* Animated Background */}
      <MatrixRain />
      
      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-dark opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hacker-green to-transparent animate-scanline"></div>
      </div>

      {/* Header */}
      <CyberHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-20">
        {/* Dashboard Grid */}
        <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 
              }}
            >
              <TerminalCard {...card} loading={loading} />
            </motion.div>
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <HackerTimeline data={timelineData} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ActivityFeed />
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GeoMap />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SystemMonitor />
          </motion.div>
        </div>

        {/* System Status Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 p-6 terminal-window border-hacker-green"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm font-mono text-gray-400 mb-2">SYSTEM STATUS</div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-hacker-green mr-2 animate-pulse"></div>
                <span className="text-hacker-green font-bold">OPERATIONAL</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-mono text-gray-400 mb-2">ENCRYPTION</div>
              <div className="flex items-center justify-center">
                <Lock className="w-4 h-4 text-hacker-green mr-2" />
                <span className="text-white font-bold">AES-256</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-mono text-gray-400 mb-2">UPTIME</div>
              <div className="text-white font-bold font-mono">99.8%</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-mono text-gray-400 mb-2">LAST UPDATE</div>
              <div className="text-white font-bold font-mono">00:00:03</div>
            </div>
          </div>
        </motion.footer>
      </main>

      {/* Terminal Ticker */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-terminal-header border-t border-terminal-border z-30"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between font-mono text-sm">
            <div className="flex items-center space-x-6 overflow-hidden">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: 'linear' 
                }}
                className="whitespace-nowrap"
              >
                <span className="text-hacker-green">[SYSTEM]</span>
                <span className="text-white mx-4">•</span>
                <span>ACTIVE CONNECTIONS: {stats.activeConnections}</span>
                <span className="text-white mx-4">•</span>
                <span>LAST CAPTURE: {new Date().toLocaleTimeString()}</span>
                <span className="text-white mx-4">•</span>
                <span className="text-hacker-red">[ALERT]</span>
                <span className="text-white mx-4">•</span>
                <span>3 NEW FINGERPRINTS DETECTED</span>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-hacker-green mr-2 animate-pulse"></div>
                <span className="text-hacker-green">LIVE</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="text-xs text-gray-400">[</div>
                {[1, 0, 1, 0, 1, 1, 0, 1].map((bit, i) => (
                  <motion.span
                    key={i}
                    className={`text-xs ${bit ? 'text-hacker-green' : 'text-gray-600'}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      delay: i * 0.1 
                    }}
                  >
                    {bit}
                  </motion.span>
                ))}
                <div className="text-xs text-gray-400">]</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;