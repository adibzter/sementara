import { Link } from 'react-router-dom';
import Button from './Button';

import './styles/Navbar.css';

const Navbar = () => {
  return (
    <div id='navbar'>
      {/* <Link to='/'>
        <Button>Home</Button>
      </Link> */}
      <Link to='/send'>
        <Button>Send</Button>
      </Link>
      <Link to='/receive'>
        <Button>Receive</Button>
      </Link>
    </div>
  );
};

export default Navbar;
