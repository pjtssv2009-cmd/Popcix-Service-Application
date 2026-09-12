/**
 * POPCIX ADMIN - Advanced Reusable Data Table Component
 * Search, filter, sorting, pagination, empty state, and CSV export.
 */

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface POPCIXDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterOptions?: { key: string; label: string; values: string[]; getter: (item: T) => string }[];
  exportFileName?: string;
  onRowClick?: (item: T) => void;
  actionButton?: React.ReactNode;
}

export function POPCIXDataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  filterOptions = [],
  exportFileName = 'popcix_export',
  onRowClick,
  actionButton
}: POPCIXDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter & Search logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search check
      if (searchQuery.trim() && searchFilter) {
        if (!searchFilter(item, searchQuery)) return false;
      }

      // Filter options check
      for (const filter of filterOptions) {
        const selectedVal = activeFilters[filter.key];
        if (selectedVal && selectedVal !== 'ALL') {
          if (filter.getter(item) !== selectedVal) return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFilter, activeFilters, filterOptions]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortAsc]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // CSV Export
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = sortedData.map(item => {
      return columns.map(c => {
        const val = (item as any)[c.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(',');
    }).join('\n');

    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E0] shadow-2xs overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E5E5E0] flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F8F5] border border-[#E5E5E0] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          {filterOptions.map(filter => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || 'ALL'}
              onChange={(e) => {
                setActiveFilters({ ...activeFilters, [filter.key]: e.target.value });
                setCurrentPage(1);
              }}
              className="bg-[#F8F8F5] border border-[#E5E5E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#333333] focus:outline-none focus:border-black"
            >
              <option value="ALL">All {filter.label}s</option>
              {filter.values.map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {actionButton}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E5E0] bg-white text-xs font-bold text-[#444444] hover:bg-[#F8F8F5] transition-colors"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#333333]">
          <thead className="bg-[#F8F8F5] border-b border-[#E5E5E0] text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 ${col.sortable ? 'cursor-pointer hover:text-black select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBEBE6]">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr
                  key={(item as any).id || idx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[#F8F8F5]' : 'hover:bg-[#FAFAF7]'
                  }`}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3.5 align-middle">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-[#6B6B6B]">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm font-bold text-[#111111] mb-1">No matching records found</div>
                  <div className="text-xs">Try adjusting your search keywords or filter criteria.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#E5E5E0] flex items-center justify-between text-xs text-[#6B6B6B] bg-[#FAFAF7]">
        <div>
          Showing <strong>{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of <strong>{sortedData.length}</strong> records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#E5E5E0] bg-white text-[#444444] disabled:opacity-40 hover:bg-[#F8F8F5]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-[#111111]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-[#E5E5E0] bg-white text-[#444444] disabled:opacity-40 hover:bg-[#F8F8F5]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
