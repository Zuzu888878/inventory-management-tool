import dashboardIcon from '../assets/stockholm-icons/Layout/Layout-4-blocks.svg';
import assetsIcon from '../assets/stockholm-icons/Shopping/Box2.svg';
import wrenchIcon from '../assets/stockholm-icons/Tools/Tools.svg';
import packageIcon from '../assets/stockholm-icons/Shopping/Box1.svg';
import usersIcon from '../assets/stockholm-icons/Communication/Group.svg';
import logoutIcon from '../assets/stockholm-icons/Navigation/Sign-out.svg';
import loginIcon from '../assets/stockholm-icons/Navigation/Sign-in.svg';
import plusIcon from '../assets/stockholm-icons/Navigation/Plus.svg';
import minusIcon from '../assets/stockholm-icons/Navigation/Minus.svg';
import pencilIcon from '../assets/stockholm-icons/General/Edit.svg';
import trashIcon from '../assets/stockholm-icons/General/Trash.svg';
import arrowLeftIcon from '../assets/stockholm-icons/Navigation/Arrow-left.svg';
import arrowRightIcon from '../assets/stockholm-icons/Navigation/Arrow-right.svg';
import chevronLeftIcon from '../assets/stockholm-icons/Navigation/Angle-left.svg';
import chevronRightIcon from '../assets/stockholm-icons/Navigation/Angle-right.svg';
import eyeIcon from '../assets/stockholm-icons/General/Eye.svg';
import searchIcon from '../assets/stockholm-icons/General/Search.svg';
import xIcon from '../assets/stockholm-icons/Navigation/Close.svg';
import userIcon from '../assets/stockholm-icons/General/User.svg';
import checkIcon from '../assets/stockholm-icons/Navigation/Check.svg';
import saveIcon from '../assets/stockholm-icons/General/Save.svg';

const icons = {
  dashboard: dashboardIcon,
  assets: assetsIcon,
  wrench: wrenchIcon,
  package: packageIcon,
  users: usersIcon,
  logout: logoutIcon,
  login: loginIcon,
  plus: plusIcon,
  minus: minusIcon,
  pencil: pencilIcon,
  trash: trashIcon,
  arrowLeft: arrowLeftIcon,
  arrowRight: arrowRightIcon,
  chevronLeft: chevronLeftIcon,
  chevronRight: chevronRightIcon,
  eye: eyeIcon,
  search: searchIcon,
  x: xIcon,
  user: userIcon,
  check: checkIcon,
  save: saveIcon,
};

export function Icon({ name, size = 20 }) {
  const source = icons[name];
  if (!source) return null;

  return (
    <span
      className="icon"
      style={{ width: size, height: size, maskImage: `url("${source}")`, WebkitMaskImage: `url("${source}")` }}
      aria-hidden="true"
    />
  );
}
