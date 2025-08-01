import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PreviewContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.secondary};
`;

const PreviewHeader = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.base};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const PreviewTitle = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ViewPublicButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  
  &:hover {
    background: ${props => props.theme.colors.primary.dark};
  }
`;

const PreviewContent = styled.div`
  max-width: 400px;
  margin: ${props => props.theme.spacing.xl} auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
`;

const MenuPreview = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { currentMenu, loading, fetchMenu } = useMenu();

  useEffect(() => {
    if (menuId) {
      fetchMenu(menuId);
    }
  }, [menuId, fetchMenu]);

  const handleBack = () => {
    navigate(`/menu-editor/${menuId}`);
  };

  const handleViewPublic = () => {
    if (currentMenu?.shortUrl) {
      window.open(`/menu/${currentMenu.shortUrl}`, '_blank');
    }
  };

  if (loading) {
    return (
      <PreviewContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size="large" text="Loading preview..." />
        </div>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer>
      <PreviewHeader>
        <BackButton onClick={handleBack}>
          <FiArrowLeft />
          Back to Editor
        </BackButton>
        
        <PreviewTitle>Menu Preview</PreviewTitle>
        
        <ViewPublicButton onClick={handleViewPublic}>
          <FiExternalLink />
          View Public
        </ViewPublicButton>
      </PreviewHeader>

      <PreviewContent>
        {currentMenu ? (
          <div style={{ padding: '2rem' }}>
            <h2>{currentMenu.businessName}</h2>
            {currentMenu.tagline && <p>{currentMenu.tagline}</p>}
            <p>This is a preview of your menu. The full mobile-optimized view will be implemented here.</p>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Menu not found</p>
          </div>
        )}
      </PreviewContent>
    </PreviewContainer>
  );
};

export default MenuPreview;