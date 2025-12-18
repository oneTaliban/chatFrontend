// components/Files/FileExplorer.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  File,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  Code,
  Database,
  Download,
  Upload,
  Trash2,
  Copy,
  Eye,
  Search,
  ChevronRight,
  ChevronDown,
  HardDrive
} from 'lucide-react';

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Simulate file system
  const fileSystem = {
    '/': {
      type: 'folder',
      children: ['/Documents', '/Downloads', '/Desktop', '/System', '/Users']
    },
    '/Documents': {
      type: 'folder',
      children: ['/Documents/report.pdf', '/Documents/notes.txt', '/Documents/project']
    },
    '/Documents/project': {
      type: 'folder',
      children: ['/Documents/project/src', '/Documents/project/readme.md']
    },
    '/Downloads': {
      type: 'folder',
      children: ['/Downloads/image.jpg', '/Downloads/video.mp4', '/Downloads/archive.zip']
    },
    '/System': {
      type: 'folder',
      children: ['/System/logs', '/System/config']
    },
    '/Users': {
      type: 'folder',
      children: ['/Users/admin', '/Users/guest']
    }
  };

  const fileTypes = {
    pdf: { icon: FileText, color: 'text-hacker-red' },
    txt: { icon: FileText, color: 'text-gray-400' },
    md: { icon: FileText, color: 'text-hacker-blue' },
    jpg: { icon: Image, color: 'text-hacker-purple' },
    mp4: { icon: Video, color: 'text-hacker-purple' },
    zip: { icon: Archive, color: 'text-yellow-500' },
    exe: { icon: Code, color: 'text-hacker-green' },
    log: { icon: Database, color: 'text-gray-400' }
  };

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = (path) => {
    // Simulate loading files for current path
    const mockFiles = [
      { name: 'report.pdf', size: '2.4 MB', type: 'pdf', modified: '2024-01-15 14:30' },
      { name: 'notes.txt', size: '15 KB', type: 'txt', modified: '2024-01-14 09:15' },
      { name: 'image.jpg', size: '5.1 MB', type: 'jpg', modified: '2024-01-13 16:45' },
      { name: 'video.mp4', size: '150 MB', type: 'mp4', modified: '2024-01-12 11:20' },
      { name: 'archive.zip', size: '45 MB', type: 'zip', modified: '2024-01-10 08:30' },
      { name: 'config.exe', size: '8.2 MB', type: 'exe', modified: '2024-01-09 10:15' },
      { name: 'system.log', size: '1.2 MB', type: 'log', modified: '2024-01-15 23:45' }
    ].map((file, i) => ({
      ...file,
      id: i,
      path: `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${file.name}`
    }));

    // Add folders
    if (fileSystem[path]) {
      fileSystem[path].children.forEach(child => {
        if (child.endsWith('/')) {
          mockFiles.unshift({
            id: mockFiles.length + 100,
            name: child.split('/').filter(Boolean).pop(),
            type: 'folder',
            size: '--',
            modified: '2024-01-15 00:00',
            path: child
          });
        }
      });
    }

    setFiles(mockFiles);
  };

  const getFileIcon = (type) => {
    if (type === 'folder') return Folder;
    const fileType = fileTypes[type];
    return fileType ? fileType.icon : File;
  };

  const getFileColor = (type) => {
    if (type === 'folder') return 'text-hacker-blue';
    const fileType = fileTypes[type];
    return fileType ? fileType.color : 'text-gray-400';
  };

  const formatSize = (size) => {
    if (size === '--') return size;
    return size;
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
      setExpandedFolders(prev => new Set([...prev, file.path]));
    }
  };

  const handleSelectFile = (fileId, event) => {
    event.stopPropagation();
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleDownload = () => {
    const selected = files.filter(f => selectedFiles.has(f.id));
    console.log('Downloading:', selected);
    // Implement download logic
  };

  const handleDelete = () => {
    const selected = files.filter(f => selectedFiles.has(f.id));
    console.log('Deleting:', selected);
    setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  };

  const Breadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center space-x-2 text-sm font-mono">
        <button
          onClick={() => setCurrentPath('/')}
          className="text-gray-400 hover:text-white"
        >
          ROOT
        </button>
        {parts.map((part, index) => {
          const path = '/' + parts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <button
                onClick={() => setCurrentPath(path)}
                className="text-gray-400 hover:text-white"
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </div>
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
          <HardDrive className="w-5 h-5 text-hacker-green" />
          <div>
            <div className="font-cyber font-bold text-white">FILE EXPLORER</div>
            <Breadcrumbs />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-10 pr-4 py-1 bg-cyber-dark border border-terminal-border rounded text-sm font-mono w-48"
            />
          </div>
          
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
          >
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-terminal-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={selectedFiles.size === 0}
              className={`px-4 py-2 rounded-lg font-mono text-sm flex items-center space-x-2
                        ${selectedFiles.size > 0 
                          ? 'bg-hacker-green/20 text-hacker-green hover:bg-hacker-green/30' 
                          : 'bg-cyber-dark text-gray-400 cursor-not-allowed'}`}
            >
              <Download className="w-4 h-4" />
              <span>Download ({selectedFiles.size})</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="px-4 py-2 rounded-lg bg-cyber-dark border border-terminal-border font-mono text-sm flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              disabled={selectedFiles.size === 0}
              className={`px-4 py-2 rounded-lg font-mono text-sm flex items-center space-x-2
                        ${selectedFiles.size > 0 
                          ? 'bg-hacker-red/20 text-hacker-red hover:bg-hacker-red/30' 
                          : 'bg-cyber-dark text-gray-400 cursor-not-allowed'}`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          </div>
          
          <div className="text-xs font-mono text-gray-400">
            {files.length} items • {files.filter(f => f.type !== 'folder').reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(1)} MB total
          </div>
        </div>
      </div>

      {/* File Browser */}
      <div className="flex-1 overflow-auto p-4 terminal-scrollbar">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              const color = getFileColor(file.type);
              const isSelected = selectedFiles.has(file.id);

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleFileClick(file)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleSelectFile(file.id, e);
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors
                            ${isSelected 
                              ? 'border-hacker-green bg-hacker-green/10' 
                              : 'border-terminal-border hover:border-hacker-green'}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <Icon className={`w-12 h-12 ${color}`} />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-hacker-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-terminal-bg rounded"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="font-mono text-sm truncate w-full">
                      {file.name}
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {formatSize(file.size)}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {file.modified.split(' ')[0]}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="p-3 text-left font-mono text-gray-400">Name</th>
                <th className="p-3 text-left font-mono text-gray-400">Size</th>
                <th className="p-3 text-left font-mono text-gray-400">Modified</th>
                <th className="p-3 text-left font-mono text-gray-400">Type</th>
                <th className="p-3 text-left font-mono text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const Icon = getFileIcon(file.type);
                const color = getFileColor(file.type);
                const isSelected = selectedFiles.has(file.id);

                return (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleFileClick(file)}
                    className={`border-b border-terminal-border/30 hover:bg-cyber-dark/50 cursor-pointer
                              ${isSelected ? 'bg-hacker-green/10' : ''}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectFile(file.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-terminal-border"
                        />
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="font-mono text-sm">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">
                      {formatSize(file.size)}
                    </td>
                    <td className="p-3 font-mono text-sm text-gray-400">
                      {file.modified}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${color} bg-${color.split('-')[1]}/20`}>
                        {file.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // View file
                          }}
                          className="p-1 hover:bg-cyber-light rounded"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(file.path);
                          }}
                          className="p-1 hover:bg-cyber-light rounded"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download single file
                          }}
                          className="p-1 hover:bg-cyber-light rounded"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-terminal-border p-3">
        <div className="flex items-center justify-between text-sm font-mono">
          <div className="text-gray-400">
            Path: <span className="text-white">{currentPath}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              Selected: <span className="text-hacker-green">{selectedFiles.size}</span>
            </div>
            <div className="text-gray-400">
              Free: <span className="text-hacker-blue">128.4 GB</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileExplorer;