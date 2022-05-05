import { Link } from 'react-router-dom';
import Button from './Button';

import './styles/Navbar.css';

const Navbar = () => {
  return (
    <div id='navbar'>
      <Link to='/'>
        <Button text='Home' />
      </Link>
      <Link to='/send'>
        <Button text='Send' />
      </Link>
      <Link to='/receive'>
        <Button text='Receive' />
      </Link>
    </div>
  );
};

export default Navbar;
