import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Send from './pages/Send';
import Receive from './pages/Receive';

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
        <Route exact path='/send' element={<Send />} />
        <Route exact path='/receive' element={<Receive />} />
        <Route path='*' component={<Send />} />
      </Routes>
    </Router>
  );
}

export default App;
