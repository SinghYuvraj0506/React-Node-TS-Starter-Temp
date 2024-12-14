import { useAppSelector } from '@/lib/store'
import React from 'react'

const Dashboard = () => {
    const {user} = useAppSelector(state=>state.auth)
  return (
    <div>Welcome to Dashboard, {user?.name}</div>
  )
}

export default Dashboard