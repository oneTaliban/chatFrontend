// components/Logs/LogViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const LogViewer = ({ logs = [], title = "Log Viewer" }) => {
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: 'all',
    source: 'all',
    dateRange: 'all'
  });
  const [bookmarkedLogs, setBookmarkedLogs] = useState(new Set());
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [highlightQuery, setHighlightQuery] = useState('');
  const logContainerRef = useRef(null);

  const logLevels = {
    'info': { color: 'text-hacker-blue', bg: 'bg-hacker-blue/20', icon: Info },
    'warning': { color: 'text-yellow-500', bg: 'bg-yellow-500/20', icon: AlertTriangle },
    'error': { color: 'text-hacker-red', bg: 'bg-hacker-red/20', icon: XCircle },
    'success': { color: 'text-hacker-green', bg: 'bg-hacker-green/20', icon: CheckCircle }
  };

  useEffect(() => {
    // Simulate logs if none provided
    if (logs.length === 0) {
      const mockLogs = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date(Date.now() - i * 60000),
        level: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)],
        source: ['auth', 'network', 'system', 'agent', 'database'][Math.floor(Math.random() * 5)],
        message: `Log entry ${i + 1}: ${[
          'User authentication successful',
          'Network packet received from 192.168.1.100',
          'System resource usage high',
          'Agent AGENT-001 connected',
          'Database query executed',
          'File upload completed',
          'Security alert triggered',
          'Connection timeout'
        ][Math.floor(Math.random() * 8)]}`,
        details: `Additional details for log entry ${i + 1}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      }));
      setFilteredLogs(mockLogs);
    }
  }, [logs]);

  useEffect(() => {
    // Filter logs based on search and filters
    let result = logs;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.ip?.toLowerCase().includes(query)
      );
    }
    
    if (filters.level !== 'all') {
      result = result.filter(log => log.level === filters.level);
    }
    
    if (filters.source !== 'all') {
      result = result.filter(log => log.source === filters.source);
    }
    
    setFilteredLogs(result);
  }, [logs, searchQuery, filters]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const toggleBookmark = (logId) => {
    const newBookmarks = new Set(bookmarkedLogs);
    if (newBookmarks.has(logId)) {
      newBookmarks.delete(logId);
    } else {
      newBookmarks.add(logId);
    }
    setBookmarkedLogs(newBookmarks);
  };

  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      source: log.source,
      message: log.message,
      ip: log.ip,
      details: log.details
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
  };

  const copyToClipboard = () => {
    const text = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500/50 text-white">{part}</mark>
      ) : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="terminal-window h-full flex flex-col"
    >
      {/* Header */}
      <div className="terminal-header flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-hacker-green" />
          <div>
            <div className="font-cyber font-bold text-white">{title}</div>
            <div className="text-xs font-mono text-gray-400">
              {filteredLogs.length} logs • {bookmarkedLogs.size} bookmarked
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={exportLogs}
            className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border font-mono text-sm flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border font-mono text-sm flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-terminal-border p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-terminal-border rounded text-sm font-mono"
              />
            </div>
          </div>
          
          {/* Highlight */}
          <div className="flex-1">
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={highlightQuery}
                onChange={(e) => setHighlightQuery(e.target.value)}
                placeholder="Highlight text..."
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-terminal-border rounded text-sm font-mono"
              />
            </div>
          </div>
          
          {/* Level Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="bg-cyber-dark border border-terminal-border rounded px-3 py-2 text-sm font-mono"
            >
              <option value="all">All Levels</option>
              {Object.keys(logLevels).map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1 rounded text-xs font-mono flex items-center space-x-1
                      ${autoScroll ? 'bg-hacker-green/20 text-hacker-green' : 'bg-cyber-dark text-gray-400'}`}
          >
            {autoScroll ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>Auto-scroll</span>
          </button>
          
          {Object.keys(logLevels).map(level => (
            <button
              key={level}
              onClick={() => setFilters({ ...filters, level })}
              className={`px-3 py-1 rounded text-xs font-mono flex items-center space-x-1
                        ${filters.level === level ? logLevels[level].bg : 'bg-cyber-dark'}`}
            >
              <div className={`w-2 h-2 rounded-full ${logLevels[level].color}`}></div>
              <span>{level.toUpperCase()}</span>
              <span className="text-gray-400">
                ({filteredLogs.filter(l => l.level === level).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Log Container */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto terminal-scrollbar"
      >
        <div className="p-4 space-y-2">
          <AnimatePresence>
            {filteredLogs.map((log) => {
              const LevelIcon = logLevels[log.level].icon;
              const levelColor = logLevels[log.level].color;
              const levelBg = logLevels[log.level].bg;
              const isBookmarked = bookmarkedLogs.has(log.id);
              const isSelected = selectedLog?.id === log.id;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all
                            ${isSelected ? 'border-hacker-green bg-hacker-green/10' : 'border-terminal-border hover:border-hacker-green'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-1.5 rounded ${levelBg} border ${levelColor.replace('text-', 'border-')}/30`}>
                          <LevelIcon className={`w-3.5 h-3.5 ${levelColor}`} />
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm font-mono">
                          <span className="text-gray-400">
                            {log.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className={`px-2 py-0.5 rounded ${levelBg} ${levelColor}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-hacker-blue">{log.source}</span>
                          {log.ip && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400">{log.ip}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="font-mono text-sm whitespace-pre-wrap">
                        {highlightQuery ? highlightText(log.message, highlightQuery) : log.message}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(log.id);
                      }}
                      className="ml-3 flex-shrink-0"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-hacker-green" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-hacker-green" />
                      )}
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-terminal-border/30">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(log.message);
                        }}
                        className="text-xs font-mono text-gray-400 hover:text-white"
                      >
                        Copy
                      </button>
                      <span className="text-gray-600">•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Details:', log);
                        }}
                        className="text-xs font-mono text-gray-400 hover:text-white"
                      >
                        Details
                      </button>
                    </div>
                    
                    <div className="text-xs font-mono text-gray-400">
                      {Math.floor((Date.now() - log.timestamp) / 1000)}s ago
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* End of logs indicator */}
          {filteredLogs.length > 0 && (
            <div className="text-center py-6 text-sm font-mono text-gray-500">
              End of logs • {filteredLogs.length} entries displayed
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-terminal-border p-3">
        <div className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              Level: <span className="text-white">{filters.level}</span>
            </div>
            <div className="text-gray-400">
              Showing: <span className="text-hacker-green">{filteredLogs.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const container = logContainerRef.current;
                if (container) {
                  container.scrollTop = 0;
                }
              }}
              className="p-1 hover:bg-cyber-light rounded"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            
            <button
              onClick={() => {
                const container = logContainerRef.current;
                if (container) {
                  container.scrollTop = container.scrollHeight;
                }
              }}
              className="p-1 hover:bg-cyber-light rounded"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Details Panel */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-0 left-0 right-0 bg-terminal-header border-t border-terminal-border z-10"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-cyber font-bold text-white">LOG DETAILS</h4>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-sm font-mono text-gray-400 hover:text-white"
                >
                  CLOSE
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono text-gray-400">Timestamp</div>
                    <div className="font-mono text-white">{selectedLog.timestamp.toISOString()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400">Level</div>
                    <div className={`font-mono ${logLevels[selectedLog.level].color}`}>
                      {selectedLog.level.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400">Source</div>
                    <div className="font-mono text-white">{selectedLog.source}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400">IP Address</div>
                    <div className="font-mono text-white">{selectedLog.ip || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-2">Message</div>
                  <div className="p-3 rounded bg-terminal-bg font-mono text-sm whitespace-pre-wrap">
                    {selectedLog.message}
                  </div>
                </div>
                
                {selectedLog.details && (
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-2">Details</div>
                    <div className="p-3 rounded bg-terminal-bg font-mono text-sm whitespace-pre-wrap">
                      {selectedLog.details}
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

export default LogViewer;