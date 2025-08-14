'use client'
import React from 'react'

interface Row {
  name: string
  emotion: string
  timestamp: string
}

interface TableBodyProps {
  rows: Row[]
}

const TableBody: React.FC<TableBodyProps> = ({ rows }) => {
  return (
    <tbody>
      {rows.map((row, index) => (
        <tr className='border-b border-gray-300' key={`${row.name}-${row.timestamp}-${index}`}>
          <td className="px-2 sm:px-4 py-2 text-left truncate max-w-18">{row.name}</td>
          <td className="px-2 sm:px-4 py-2 text-left">{row.emotion}</td>
          <td className="px-2 sm:px-4 py-2 text-left">{row.timestamp}</td>
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
