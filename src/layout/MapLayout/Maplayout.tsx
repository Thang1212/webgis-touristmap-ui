import React from 'react'
import { Outlet } from 'react-router-dom'

const Maplayout = () => {
  return (
    <div className='w-full h-full'>
        <div>
          <Outlet />
        </div>
    </div>
  )
}

export default Maplayout