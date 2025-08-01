import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicMenuContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing.md};
`;

const MenuCard = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const MenuHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  background: ${props => props.theme.colors.primary.main};
  color: white;
`;

const BusinessName = styled.h1`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Tagline = styled.p`
  margin: 0;
  opacity: 0.9;
`;

const MenuContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PublicMenu = () => {
  const { shortUrl } = useParams();
  const { currentMenu, loading, fetchPublicMenu } = useMenu();

  useEffect(() => {
    if (shortUrl) {
      fetchPublicMenu(shortUrl);
    }
  }, [shortUrl, fetchPublicMenu]);

  if (loading) {
    return (
      <PublicMenuContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size="large" text="Loading menu..." />
        </div>
      </PublicMenuContainer>
    );
  }

  if (!currentMenu) {
    return (
      <PublicMenuContainer>
        <MenuCard>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Menu Not Found</h2>
            <p>The menu you're looking for doesn't exist or is no longer available.</p>
          </div>
        </MenuCard>
      </PublicMenuContainer>
    );
  }

  return (
    <PublicMenuContainer>
      <MenuCard>
        <MenuHeader>
          <BusinessName>{currentMenu.businessName}</BusinessName>
          {currentMenu.tagline && <Tagline>{currentMenu.tagline}</Tagline>}
        </MenuHeader>
        
        <MenuContent>
          <p>This is the public menu view. The full mobile-optimized menu will be implemented here.</p>
          <p>Items: {currentMenu.items?.length || 0}</p>
          <p>Status: {currentMenu.isOpen ? 'Open' : 'Closed'}</p>
        </MenuContent>
      </MenuCard>
    </PublicMenuContainer>
  );
};

export default PublicMenu;