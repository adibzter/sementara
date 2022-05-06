import './styles/Loader.css';

const Loader = ({ children }) => {
  return (
    <>
      <div className='loader'></div>
      {children ? { ...children } : <h3>Loading</h3>}
    </>
  );
};

export default Loader;
