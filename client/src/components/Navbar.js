import { Link } from 'react-router-dom';

import './styles/Navbar.css';

const Navbar = () => {
  return (
    <>
      <div id='navbar'>
        <Link to='/send'>Send</Link>
        <Link to='/receive'>Receive</Link>
      </div>
    </>
  );
};

export default Navbar;
