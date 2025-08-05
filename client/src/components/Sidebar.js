import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiGrid, FiSettings, FiEdit3 } from 'react-icons/fi';
import { useMenu } from '../contexts/MenuContext';

const SidebarContainer = styled.div`
  width: 280px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const SidebarTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.active ? props.theme.colors.primary.main : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  justify-content: flex-start;
  text-decoration: none;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary.dark : props.theme.colors.background.secondary};
    transform: translateY(-1px);
    text-decoration: none;
    color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
    border-color: ${props => props.active ? props.theme.colors.primary.dark : props.theme.colors.border.dark};
  }

  svg {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const { menus } = useMenu();
  
  // Get the first menu for QR generator link
  const currentMenu = menus && menus.length > 0 ? menus[0] : null;

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path.startsWith('/qr-generator')) {
      return location.pathname.startsWith('/qr-generator');
    }
    if (path === '/settings') {
      return location.pathname === '/settings';
    }
    if (path === '/menu-management') {
      return location.pathname === '/menu-management' || location.pathname === '/demo';
    }
    return false;
  };

  return (
    <SidebarContainer>
      <SidebarTitle>Menu Tools</SidebarTitle>
      
      <SidebarLink 
        to="/dashboard" 
        active={isActive('/dashboard')}
      >
        <FiHome />
        Dashboard
      </SidebarLink>

      <SidebarLink 
        to="/menu-management" 
        active={isActive('/menu-management')}
      >
        <FiEdit3 />
        Menu Management
      </SidebarLink>
      
      <SidebarLink 
        to={currentMenu ? `/qr-generator/${currentMenu._id}` : '/qr-generator'} 
        active={isActive('/qr-generator')}
      >
        <FiGrid />
        QR Code
      </SidebarLink>
      
      <SidebarLink 
        to="/settings" 
        active={isActive('/settings')}
      >
        <FiSettings />
        Settings
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;