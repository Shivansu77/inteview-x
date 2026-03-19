import React from 'react'
import HistoryPage from './HistoryPage'
import { Link } from 'react-router-dom'


const DashBoardPage = () => {
    const [open, setOpen] = React.useState(false);

  return (
    <div>
        <h1 className="text-3xl font-bold text-center mt-10">Dashboard</h1>
        <div className='text-xl'>
            <div>
                <button onClick={() => setOpen(!open)}>history</button>
            </div>

            {open && <HistoryPage />}
            {/* <Link to="/history">History</Link> */}

            {/* <Link to="/choose">Choose Interview</Link>

            <Link to="/interview">Start Interview</Link> */}
        </div>
    </div>
  )
}

export default DashBoardPage
