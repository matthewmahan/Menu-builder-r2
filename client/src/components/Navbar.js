import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiUser, FiSettings, FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  height: 64px;
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  text-decoration: none;
  
  svg {
    margin-right: ${props => props.theme.spacing.sm};
  }

  &:hover {
    text-decoration: none;
    color: ${props => props.theme.colors.primary.dark};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: ${props => props.theme.spacing.md};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.background.secondary};
    text-decoration: none;
  }

  &.active {
    color: ${props => props.theme.colors.primary.main};
    background: ${props => props.theme.colors.primary.light}22;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const BusinessName = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.xs};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.primary.dark};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: white;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  z-index: ${props => props.theme.zIndex.dropdown};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border: none;
  background: none;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <NavbarContainer>
      <Logo to="/dashboard">
        <FiMenu />
        MenuBuilder
      </Logo>

      <NavLinks>
        {/* Dashboard link moved to sidebar */}
      </NavLinks>

      <UserMenu>
        {user && (
          <>
            <UserInfo>
              <UserName>{user.ownerName || user.businessName}</UserName>
              <BusinessName>{user.businessName}</BusinessName>
            </UserInfo>
            
            <UserAvatar 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            >
              {getInitials(user.ownerName || user.businessName)}
            </UserAvatar>

            <DropdownMenu isOpen={dropdownOpen}>
              <DropdownItem onClick={handleDashboard}>
                <FiHome />
                Dashboard
              </DropdownItem>
              <DropdownItem onClick={handleSettings}>
                <FiSettings />
                Settings
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <FiLogOut />
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </>
        )}
      </UserMenu>
    </NavbarContainer>
  );
};

export default Navbar;