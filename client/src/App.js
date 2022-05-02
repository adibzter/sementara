import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Room from './pages/Room';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Folder from './pages/Folder';

function App() {
  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('user-id')) {
        // const userId = await fetch('http://localhost:5000/api/user');
        // console.log(userId);
        // localStorage.setItem('user-id', userId);
      }
    })();
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/room/*' element={<Room />} />
        <Route exact path='/send' element={<Send />} />
        <Route exact path='/receive' element={<Receive />} />
        <Route path='/folder/*' element={<Folder />} />
        <Route path='*' component={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
