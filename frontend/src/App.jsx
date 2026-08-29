import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { ValorantDash } from './pages/Valorant.jsx';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className=' bg-linear-to-b from-purple-800 to-cyan-500'>
      <Router>
        <Navbar />
        <div className='flex min-h-screen justify-center'>
          <div className='w-4/5 pt-5'>
            <Routes>
              <Route path='/' element={<p>home</p>} />
              <Route path='/league' element={<p>League</p>} />
              <Route path='/valorant' element={<ValorantDash />} />
              <Route path='/about' element={<p>about</p>} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App
