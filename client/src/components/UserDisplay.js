import { blue } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import TabletOutlinedIcon from '@mui/icons-material/TabletOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

import './styles/UserDisplay.css';

const fontSize = 'large';
const userIcon = {
  console: VideogameAssetOutlinedIcon,
  mobile: SmartphoneOutlinedIcon,
  tablet: TabletOutlinedIcon,
  smartv: TvOutlinedIcon,
  wearable: WatchOutlinedIcon,
  embedded: MemoryOutlinedIcon,
};

export default function UserDisplay({ displayName, deviceType, onClick }) {
  const UserIcon = userIcon[deviceType];

  return (
    <div className='user-display' onClick={onClick}>
      <Avatar
        variant='circular'
        sx={{ width: 56, height: 56, bgcolor: blue[600] }}
      >
        {UserIcon ? (
          <UserIcon fontSize={fontSize} />
        ) : (
          <DesktopWindowsOutlinedIcon fontSize={fontSize} />
        )}
      </Avatar>
      <sub>{displayName}</sub>
    </div>
  );
}
