// components/Charts/HackerTimeline.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HackerTimeline = ({ data }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && containerRef.current) {
      // GSAP animations for data points
      const lines = chartRef.current.querySelectorAll('.recharts-line');
      
      gsap.from(lines, {
        strokeDashoffset: 1000,
        strokeDasharray: 1000,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate grid lines
      const gridLines = chartRef.current.querySelectorAll('.recharts-cartesian-grid-line');
      gridLines.forEach((line, i) => {
        gsap.from(line, {
          opacity: 0,
          x: -50,
          duration: 1,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%"
          }
        });
      });
    }
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="terminal-window p-4"
        >
          <div className="font-mono text-xs space-y-1">
            <div className="text-gray-400">TIME: {label}</div>
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.dataKey}:</span>
                </div>
                <span className="font-bold text-hacker-green">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    
    return (
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.5 }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#00ff41"
          stroke="#0a0a0a"
          strokeWidth={2}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={8}
          fill="transparent"
          stroke="#00ff41"
          strokeWidth={1}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: [1, 2],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.g>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="terminal-window p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-cyber font-bold text-white mb-1">
            ACTIVITY TIMELINE
          </h3>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-hacker-green mr-2"></div>
              <span className="text-gray-400">Submissions</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-hacker-blue mr-2"></div>
              <span className="text-gray-400">Fingerprints</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-hacker-purple mr-2"></div>
              <span className="text-gray-400">Geolocations</span>
            </div>
          </div>
        </div>
        
        <motion.div
          className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border"
          animate={{ 
            boxShadow: [
              "0 0 0px rgba(0, 255, 0, 0.2)",
              "0 0 20px rgba(0, 255, 0, 0.4)",
              "0 0 0px rgba(0, 255, 0, 0.2)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
        >
          <span className="text-sm font-mono text-hacker-green">LIVE FEED</span>
        </motion.div>
      </div>

      <div ref={chartRef} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0, 255, 0, 0.1)" 
              strokeWidth={1}
            />
            <XAxis 
              dataKey="hour" 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(0, 255, 0, 0.3)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(0, 255, 0, 0.3)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="phishing"
              stroke="#00ff41"
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={{ r: 8 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="fingerprints"
              stroke="#0080ff"
              strokeWidth={2}
              dot={false}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="keystrokes"
              stroke="#bf00ff"
              strokeWidth={2}
              dot={false}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-hacker-green to-transparent"
        animate={{ y: [0, 320, 0] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export default HackerTimeline;