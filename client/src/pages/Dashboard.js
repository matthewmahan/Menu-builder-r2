import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiEdit3, FiEye, FiGrid, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin: 0;
`;

const WelcomeText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.sm} 0 0 0;
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.primary.dark};
    transform: translateY(-1px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const MenusSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const MenuCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  overflow: hidden;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const MenuCardHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const MenuName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.isOpen ? props.theme.colors.success.main : props.theme.colors.error.main};
`;

const MenuTagline = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`;

const MenuStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const MenuActions = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.medium};
  background: white;
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  flex: 1;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }

  &.primary {
    background: ${props => props.theme.colors.primary.main};
    color: white;
    border-color: ${props => props.theme.colors.primary.main};

    &:hover {
      background: ${props => props.theme.colors.primary.dark};
    }
  }

  &.danger {
    color: ${props => props.theme.colors.error.main};
    border-color: ${props => props.theme.colors.error.light};

    &:hover {
      background: ${props => props.theme.colors.error.light};
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.5;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { menus, loading, fetchMenus, deleteMenu, toggleMenuStatus } = useMenu();

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleCreateMenu = () => {
    navigate('/onboarding');
  };

  const handleEditMenu = (menuId) => {
    navigate(`/menu-editor/${menuId}`);
  };

  const handlePreviewMenu = (menuId) => {
    navigate(`/menu-preview/${menuId}`);
  };

  const handleQRCode = (menuId) => {
    navigate(`/qr-generator/${menuId}`);
  };

  const handleDeleteMenu = async (menuId, menuName) => {
    if (window.confirm(`Are you sure you want to delete "${menuName}"? This action cannot be undone.`)) {
      await deleteMenu(menuId);
    }
  };


  const totalItems = menus.reduce((sum, menu) => sum + (menu.items?.length || 0), 0);
  const activeMenus = menus.filter(menu => menu.isOpen).length;

  if (loading && menus.length === 0) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" text="Loading your dashboard..." />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Welcome back, {user?.businessName || user?.ownerName || 'there'}!</Title>
          <WelcomeText>Manage your digital menus and track your business</WelcomeText>
        </div>
        <CreateButton onClick={handleCreateMenu}>
          <FiPlus />
          Create New Menu
        </CreateButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{menus.length}</StatValue>
          <StatLabel>Total Menus</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalItems}</StatValue>
          <StatLabel>Menu Items</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{activeMenus}</StatValue>
          <StatLabel>Active Menus</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{user?.subscription?.plan || 'Free'}</StatValue>
          <StatLabel>Current Plan</StatLabel>
        </StatCard>
      </StatsGrid>

      <MenusSection>
        <SectionTitle>
          Your Menus
          {menus.length > 0 && (
            <CreateButton onClick={handleCreateMenu}>
              <FiPlus />
              Add Menu
            </CreateButton>
          )}
        </SectionTitle>

        {menus.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🍽️</EmptyStateIcon>
            <h3>No menus yet</h3>
            <p>Create your first digital menu to get started!</p>
            <CreateButton onClick={handleCreateMenu} style={{ marginTop: '1rem' }}>
              <FiPlus />
              Create Your First Menu
            </CreateButton>
          </EmptyState>
        ) : (
          <MenuGrid>
            {menus.map((menu) => (
              <MenuCard key={menu._id}>
                <MenuCardHeader>
                  <MenuName>
                    {menu.businessName}
                    <MenuStatus isOpen={menu.isOpen}>
                      {menu.isOpen ? <FiToggleRight /> : <FiToggleLeft />}
                      {menu.isOpen ? 'Open' : 'Closed'}
                    </MenuStatus>
                  </MenuName>
                  {menu.tagline && <MenuTagline>{menu.tagline}</MenuTagline>}
                </MenuCardHeader>

                <MenuStats>
                  <span>{menu.items?.length || 0} items</span>
                  <span>Updated {new Date(menu.updatedAt).toLocaleDateString()}</span>
                </MenuStats>

                <MenuActions>
                  <ActionButton className="primary" onClick={() => handleEditMenu(menu._id)}>
                    <FiEdit3 />
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => handlePreviewMenu(menu._id)}>
                    <FiEye />
                    Preview
                  </ActionButton>
                  <ActionButton onClick={() => handleQRCode(menu._id)}>
                    <FiGrid />
                    QR Code
                  </ActionButton>
                  <ActionButton className="danger" onClick={() => handleDeleteMenu(menu._id, menu.businessName)}>
                    <FiTrash2 />
                  </ActionButton>
                </MenuActions>
              </MenuCard>
            ))}
          </MenuGrid>
        )}
      </MenusSection>
    </DashboardContainer>
  );
};

export default Dashboard;