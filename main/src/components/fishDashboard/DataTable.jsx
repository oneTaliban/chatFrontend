// components/Tables/DataTable.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Search,
  Download,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  CheckSquare,
  Square,
  Copy
} from 'lucide-react';

const DataTable = ({ 
  data = [], 
  columns = [], 
  title = "Data Table",
  onRowClick,
  enableSelection = true,
  enableFilters = true,
  enableExport = true
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [columnVisibility, setColumnVisibility] = useState({});
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Initialize column visibility
  useEffect(() => {
    const initialVisibility = {};
    columns.forEach(col => {
      initialVisibility[col.key] = true;
    });
    setColumnVisibility(initialVisibility);
  }, [columns]);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const cellValue = row[key];
          if (Array.isArray(value)) {
            return value.includes(cellValue);
          }
          return cellValue === value;
        });
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
  }, [data, searchQuery, filters, sortConfig, columns]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleExport = () => {
    const exportData = filteredData
      .filter((_, index) => selectedRows.has(index))
      .map(row => {
        const obj = {};
        columns.forEach(col => {
          if (columnVisibility[col.key]) {
            obj[col.title] = row[col.key];
          }
        });
        return obj;
      });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString()}.json`;
    a.click();
  };

  const visibleColumns = columns.filter(col => columnVisibility[col.key]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const ColumnFilter = ({ column }) => {
    const [isOpen, setIsOpen] = useState(false);
    const uniqueValues = Array.from(new Set(data.map(row => row[column.key]))).slice(0, 10);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-cyber-light rounded"
        >
          <Filter className="w-3 h-3 text-gray-400" />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-48 terminal-window z-10"
            >
              <div className="p-3">
                <div className="text-xs font-mono text-gray-400 mb-2">{column.title}</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {uniqueValues.map(value => (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[column.key]?.includes(value)}
                        onChange={(e) => {
                          const current = filters[column.key] || [];
                          const newFilters = e.target.checked
                            ? [...current, value]
                            : current.filter(v => v !== value);
                          setFilters(prev => ({
                            ...prev,
                            [column.key]: newFilters.length ? newFilters : undefined
                          }));
                        }}
                        className="rounded border-terminal-border"
                      />
                      <span className="text-xs font-mono">{value || 'Empty'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="terminal-window"
    >
      {/* Table Header */}
      <div className="p-4 border-b border-terminal-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-cyber font-bold text-white">{title}</h3>
            <div className="text-xs font-mono text-gray-400">
              {filteredData.length} records • {selectedRows.size} selected
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-cyber-dark border border-terminal-border rounded-lg 
                         text-sm font-mono text-white w-64 focus:outline-none focus:border-hacker-green"
              />
            </div>

            {/* Export Button */}
            {enableExport && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={selectedRows.size === 0}
                className={`px-4 py-2 rounded-lg font-mono text-sm flex items-center space-x-2
                          ${selectedRows.size > 0 
                            ? 'bg-hacker-green/20 text-hacker-green hover:bg-hacker-green/30' 
                            : 'bg-cyber-dark text-gray-400 cursor-not-allowed'}`}
              >
                <Download className="w-4 h-4" />
                <span>Export ({selectedRows.size})</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, value]) => (
              <div
                key={key}
                className="px-3 py-1 rounded-full bg-hacker-blue/20 text-hacker-blue text-xs font-mono flex items-center space-x-2"
              >
                <span>{key}: {Array.isArray(value) ? value.join(', ') : value}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, [key]: undefined }))}
                  className="hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-terminal-border">
              {enableSelection && (
                <th className="p-4 text-left">
                  <button onClick={handleSelectAll} className="hover:text-hacker-green">
                    {selectedRows.size === filteredData.length ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}
              
              {visibleColumns.map(column => (
                <th
                  key={column.key}
                  className="p-4 text-left font-cyber font-bold text-gray-300 cursor-pointer hover:text-white"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="w-3 h-3 text-hacker-green" /> : 
                        <ChevronDown className="w-3 h-3 text-hacker-green" />
                    )}
                    {enableFilters && <ColumnFilter column={column} />}
                  </div>
                </th>
              ))}
              
              <th className="p-4 text-left font-cyber font-bold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody>
            <AnimatePresence>
              {paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`border-b border-terminal-border/50 hover:bg-cyber-dark/50 transition-colors
                            ${selectedRows.has(rowIndex) ? 'bg-hacker-green/10' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {enableSelection && (
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(rowIndex);
                        }}
                        className="hover:text-hacker-green"
                      >
                        {selectedRows.has(rowIndex) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  )}
                  
                  {visibleColumns.map(column => (
                    <td key={column.key} className="p-4 font-mono text-sm">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-cyber-light rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View action
                        }}
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-cyber-light rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(JSON.stringify(row, null, 2));
                        }}
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-cyber-light rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete action
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-hacker-red" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-terminal-border">
        <div className="flex items-center justify-between">
          <div className="text-sm font-mono text-gray-400">
            Page {page} of {totalPages} • Showing {paginatedData.length} of {filteredData.length} records
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-cyber-dark border border-terminal-border rounded px-3 py-1 text-sm font-mono"
            >
              {[10, 20, 50, 100].map(num => (
                <option key={num} value={num}>{num} per page</option>
              ))}
            </select>
            
            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-cyber-dark border border-terminal-border disabled:opacity-50"
              >
                ←
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded font-mono text-sm ${
                      page === pageNum
                        ? 'bg-hacker-green text-terminal-bg'
                        : 'bg-cyber-dark border border-terminal-border'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-cyber-dark border border-terminal-border disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataTable;