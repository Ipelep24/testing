'use client'

import React, { useState } from 'react'
import TableHeader from './components/TableHeader'
import TableBody from './components/TableBody'
import SessionList from './components/SessionList'
import Role from './components/Role'

const RecordsLayout = () => {
  type SortKey = 'name' | 'emotion' | 'timestamp'
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  type Role = 'host' | 'participant'
  const [role, setRole] = useState<Role>('host')

  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const currentUser = 'Linory'

  const sessions = [
    {
      name: "Session Omega",
      date: "2025-05-24",
      host: "Philip",
      participants: ["Philip", "Kenneth", "Cristina", "Linory"],
      records: [
        {
          name: "Kenneth",
          emotions: [
            { emotion: "Happy", timestamp: "09:00" },
            { emotion: "Neutral", timestamp: "09:01" },
            { emotion: "Sad", timestamp: "09:02" },
            { emotion: "Happy", timestamp: "09:03" }
          ]
        },
        {
          name: "Cristina",
          emotions: [
            { emotion: "Surprised", timestamp: "09:00" },
            { emotion: "Neutral", timestamp: "09:01" },
            { emotion: "Happy", timestamp: "09:02" }
          ]
        },
        {
          name: "Linory",
          emotions: [
            { emotion: "Sad", timestamp: "09:00" },
            { emotion: "Happy", timestamp: "09:01" }
          ]
        },
        {
          name: "Philip",
          emotions: []
        }
      ]
    },
    {
      name: "Session Sigma",
      date: "2025-05-25",
      host: "Kenneth",
      participants: ["Philip", "Kenneth", "Cristina", "Linory"],
      records: [
        {
          name: "Philip",
          emotions: [
            { emotion: "Happy", timestamp: "10:00" },
            { emotion: "Neutral", timestamp: "10:01" },
            { emotion: "Surprised", timestamp: "10:02" }
          ]
        },
        {
          name: "Cristina",
          emotions: [
            { emotion: "Sad", timestamp: "10:00" },
            { emotion: "Happy", timestamp: "10:01" }
          ]
        },
        {
          name: "Linory",
          emotions: [
            { emotion: "Neutral", timestamp: "10:00" },
            { emotion: "Happy", timestamp: "10:01" },
            { emotion: "Happy", timestamp: "10:02" }
          ]
        }
      ]
    },
    {
      name: "Session Theta",
      date: "2025-05-26",
      host: "Cristina",
      participants: ["Philip", "Kenneth", "Cristina", "Linory"],
      records: [
        {
          name: "Kenneth",
          emotions: [
            { emotion: "Neutral", timestamp: "11:00" },
            { emotion: "Happy", timestamp: "11:01" },
            { emotion: "Sad", timestamp: "11:02" },
            { emotion: "Happy", timestamp: "11:03" }
          ]
        },
        {
          name: "Linory",
          emotions: [
            { emotion: "Sad", timestamp: "11:00" },
            { emotion: "Neutral", timestamp: "11:01" },
            { emotion: "Happy", timestamp: "11:02" }
          ]
        },
        {
          name: "Philip",
          emotions: []
        }
      ]
    }
  ]

  const filteredSessions = sessions.filter(session => {
    if (role === 'host') {
      return session.host === currentUser
    } else {
      const isParticipant = session.participants.includes(currentUser) && session.host !== currentUser
      const hasRecords = session.records.some(record =>
        record.name === currentUser && record.emotions.length > 0
      )
      return isParticipant && hasRecords
    }
  })

  const visibleSessions = selectedSession
    ? filteredSessions.filter(session => session.name === selectedSession)
    : []

  const flattenedRows = visibleSessions.flatMap(session =>
    session.records.flatMap(record => {
      if (role === 'host') {
        return record.emotions.map(emotionObj => ({
          name: record.name,
          emotion: emotionObj.emotion,
          timestamp: emotionObj.timestamp
        }))
      } else {
        if (record.name === currentUser || record.name === `${currentUser} Genoso`) {
          return record.emotions.map(emotionObj => ({
            name: record.name,
            emotion: emotionObj.emotion,
            timestamp: emotionObj.timestamp
          }))
        }
        return []
      }
    })
  )

  const sortedRows = [...flattenedRows]
  if (sortKey) {
    sortedRows.sort((a, b) => {
      let valA = a[sortKey]
      let valB = b[sortKey]

      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  return (
    <div className='font-futura px-4 h-screen'>
      <header className='w-full h-1/10 flex items-center justify-between'>
        <h1 className='text-3xl'>Data Analytics</h1>
        <Role
          role={role}
          onToggle={() => {
            setRole(prev => (prev === 'host' ? 'participant' : 'host'))
            setSelectedSession(null)
          }}
        />
      </header>
      <main className='w-full h-9/10 py-3 flex gap-4'>
        {filteredSessions.length > 0 ? (
          <SessionList
            sessions={filteredSessions}
            selectedSession={selectedSession}
            onSelect={setSelectedSession}
          />
        ) : (
          <div className="w-1/4 h-full border shadow-md rounded-lg flex items-center justify-center text-gray-500">
            <p className="text-md text-center px-4">
              No sessions available
            </p>
          </div>
        )}


        <div className='w-full h-full flex flex-col gap-4'>
          <div className='border w-full h-1/2 shadow-md rounded-lg'>
            {/* Chart or analytics here */}
          </div>
          <div className="w-full h-1/2 shadow-md rounded-lg border overflow-y-auto">
            {sortedRows.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className='text-md md:text-xl'>Select a session to view records</p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <TableHeader
                  onSort={handleSort}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
                <TableBody rows={sortedRows} />
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default RecordsLayout
