import { default as MuiButton } from '@mui/material/Button';

const Button = ({ children, onClick, margin = '15px', endIcon }) => {
  return (
    <MuiButton
      sx={{ margin }}
      variant='contained'
      size='large'
      endIcon={endIcon}
      onClick={onClick}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
