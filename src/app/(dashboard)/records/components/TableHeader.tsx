'use client'
import React from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

type SortKey = 'name' | 'emotion' | 'timestamp'

interface TableHeaderProps {
  onSort: (key: SortKey) => void
  sortKey: SortKey
  sortDirection: 'asc' | 'desc'
}

const TableHeader: React.FC<TableHeaderProps> = ({ onSort, sortKey, sortDirection }) => {
  const getChevronClass = (key: SortKey) =>
    clsx(
      'h-4 w-4 transition-transform duration-200',
      sortKey === key && sortDirection === 'desc' && 'rotate-180'
    )

  return (
    <thead className="bg-[#384959] text-white text-sm sm:text-base">
      <tr className="sticky top-0 bg-[#384959] z-10">
        <th className="px-2 sm:px-4 py-2 text-left cursor-pointer" onClick={() => onSort('name')}>
          <div className="flex items-center gap-1">
            Name
            <ChevronDown className={getChevronClass('name')} />
          </div>
        </th>
        <th className="px-2 sm:px-4 py-2 text-left cursor-pointer" onClick={() => onSort('emotion')}>
          <div className="flex items-center gap-1">
            Emotions
            <ChevronDown className={getChevronClass('emotion')} />
          </div>
        </th>
        <th className="px-2 sm:px-4 py-2 text-left cursor-pointer" onClick={() => onSort('timestamp')}>
          <div className="flex items-center gap-1">
            Timestamp
            <ChevronDown className={getChevronClass('timestamp')} />
          </div>
        </th>
      </tr>
    </thead>
  )
}

export default TableHeader
