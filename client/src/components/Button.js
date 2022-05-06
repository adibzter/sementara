import './styles/Button.css';

const Button = ({ children, onClick, margin = '5px' }) => {
  return (
    <button className='button' onClick={onClick} style={{ margin }}>
      {children}
    </button>
  );
};

export default Button;
