import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { selectCurrentUser } from '../../store/user/user.selector';
import { selectIsCartOpen } from '../../store/cart/cart.selector';
import { signOutStart } from '../../store/user/user.action';
import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';

import {
  NavigationContainer,
  LogoContainer,
  NavLinks,
  NavLink,
} from './navigation.styles.jsx';

const Navigation = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);

  const signOutUser = () => {
    dispatch(signOutStart());
  };

  return (
    <Fragment>
      <NavigationContainer className='navigation'>
        <LogoContainer className='logo-container' to='/'>
          <CrwnLogo />
        </LogoContainer>
        <NavLinks className='nav-links-container'>
          <NavLink className='nav-link' to='/shop'>
            Shop
          </NavLink>

          {currentUser ? (
            <NavLink as='span' onClick={signOutUser} className='nav-link'>
              Sign Out
            </NavLink>
          ) : (
            <NavLink className='nav-link' to='/auth'>
              Sign In
            </NavLink>
          )}

          <CartIcon />
        </NavLinks>

        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
