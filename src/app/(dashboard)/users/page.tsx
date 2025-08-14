import React from 'react'

interface user {
  id: number;
  name: string;
}

const UsersPage = async () => {
  //await new Promise(resolve => setTimeout(resolve, 3000)) // simulate delay
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 20 }
  })
  const users: user[] = await res.json();

  return (
    <>
      <h1>Users</h1>
      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  )
}

export default UsersPage
