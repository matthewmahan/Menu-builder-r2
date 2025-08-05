import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiGrid,
  FiSettings,
  FiMoreVertical,
  FiEyeOff,
  FiEye,
  FiAlertCircle,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiBarChart2,
  FiCalendar,
  FiActivity,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MenuItemModal from '../components/MenuItemModal';

const ManagementContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MenuHeader = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const MenuTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const MenuTagline = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.base};
  margin: ${props => props.theme.spacing.sm} 0;
`;

const MenuMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const MenuContent = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
  background: ${props => props.theme.colors.background.primary};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.success.main};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.success.dark};
    transform: translateY(-1px);
  }
`;

const MenuItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const MenuItemCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.lg};
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text.primary};
`;

const ItemDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
  line-height: 1.4;
`;

const ItemPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-right: ${props => props.theme.spacing.lg};
`;

const ItemActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.border.light};
    color: ${props => props.theme.colors.text.primary};
    transform: translateY(-1px);
  }
`;

const OverflowMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const OverflowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.border.light};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.xs};
  background: white;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 180px;
  z-index: 1000;
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
  color: ${props => props.danger ? props.theme.colors.error.main : props.theme.colors.text.primary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.normal};
  text-align: left;

  &:hover {
    background: ${props => props.danger ? props.theme.colors.error.light : props.theme.colors.background.secondary};
    color: ${props => props.danger ? 'white' : props.theme.colors.text.primary};
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  }
`;

const ItemBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => {
    if (props.type === 'inactive') return props.theme.colors.text.secondary;
    if (props.type === 'soldout') return props.theme.colors.error.main;
    return props.theme.colors.background.secondary;
  }};
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-left: ${props => props.theme.spacing.sm};
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
  height: 400px;
`;

// Dashboard Components
const DashboardOverview = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const OverviewTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const QuickActionCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border.light};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const QuickActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary.light}22;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const QuickActionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const QuickActionDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`;

const RecentActivitySection = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const ActivityTime = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const MenuStatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.isOpen ? props.theme.colors.success.light + '22' : props.theme.colors.error.light + '22'};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.isOpen ? props.theme.colors.success.light : props.theme.colors.error.light};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatusText = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.isOpen ? props.theme.colors.success.dark : props.theme.colors.error.dark};
`;

const StatusDescription = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 28px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.active ? props.theme.colors.success.main : props.theme.colors.border.medium};
  color: white;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  position: relative;

  &:hover {
    background: ${props => props.active ? props.theme.colors.success.dark : props.theme.colors.border.dark};
  }

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: ${props => props.theme.transitions.normal};
    transform: translateX(${props => props.active ? '10px' : '-10px'});
  }
`;

const MenuManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { menus, currentMenu, loading, fetchMenus, fetchMenu, deleteMenuItem, addMenuItem, updateMenuItem, toggleMenuStatus } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Mock dashboard data (placeholder)
  const [dashboardData] = useState({
    totalViews: 1247,
    todayViews: 89,
    weeklyOrders: 156,
    monthlyRevenue: 3420,
    popularItems: ['Margherita Pizza', 'Caesar Salad', 'Chocolate Cake'],
    recentActivity: [
      { type: 'item_added', text: 'Added "Truffle Pasta" to menu', time: '2 hours ago', icon: FiPlus },
      { type: 'menu_updated', text: 'Updated menu prices', time: '1 day ago', icon: FiEdit3 },
      { type: 'item_sold_out', text: 'Marked "Fish & Chips" as sold out', time: '2 days ago', icon: FiAlertCircle },
      { type: 'menu_viewed', text: '23 customers viewed your menu', time: '3 days ago', icon: FiEye }
    ]
  });

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    // Auto-select the first menu if available
    if (menus.length > 0 && !currentMenu) {
      fetchMenu(menus[0]._id);
    }
  }, [menus, currentMenu, fetchMenu]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      await deleteMenuItem(currentMenu._id, itemId);
    }
    setOpenDropdown(null);
  };

  const handleToggleSoldOut = async (item) => {
    // This would need backend support to update item status
    console.log('Toggle sold out for:', item.name);
    setOpenDropdown(null);
  };

  const handleToggleActive = async (item) => {
    // This would need backend support to update item status
    console.log('Toggle active for:', item.name);
    setOpenDropdown(null);
  };

  const handleToggleMenuStatus = async () => {
    if (currentMenu) {
      await toggleMenuStatus(currentMenu._id);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-item':
        handleAddItem();
        break;
      case 'qr-code':
        if (currentMenu) {
          navigate(`/qr-generator/${currentMenu._id}`);
        }
        break;
      case 'preview':
        if (currentMenu) {
          navigate(`/menu-preview/${currentMenu._id}`);
        }
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        await updateMenuItem(currentMenu._id, editingItem._id, itemData);
      } else {
        await addMenuItem(currentMenu._id, itemData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading && !currentMenu) {
    return (
      <ManagementContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" text="Loading your menu..." />
        </LoadingContainer>
      </ManagementContainer>
    );
  }

  if (!currentMenu && menus.length === 0) {
    return (
      <ManagementContainer>
        <MainContent>
          <EmptyState>
            <EmptyStateIcon>🍽️</EmptyStateIcon>
            <h3>No menu yet</h3>
            <p>Create your digital menu to get started!</p>
            <AddButton onClick={() => navigate('/onboarding')} style={{ marginTop: '1rem' }}>
              <FiPlus />
              Create Your Menu
            </AddButton>
          </EmptyState>
        </MainContent>
      </ManagementContainer>
    );
  }

  return (
    <ManagementContainer>
      <MainContent>
        {currentMenu && (
          <>
            {/* Dashboard Overview Section */}
            <DashboardOverview>
              <OverviewTitle>
                <FiBarChart2 />
                Dashboard Overview
              </OverviewTitle>
              
              {/* Menu Status Toggle */}
              <MenuStatusToggle isOpen={currentMenu.isOpen}>
                <StatusText>
                  <StatusTitle isOpen={currentMenu.isOpen}>
                    Menu is {currentMenu.isOpen ? 'Open' : 'Closed'}
                  </StatusTitle>
                  <StatusDescription>
                    {currentMenu.isOpen
                      ? 'Customers can view and order from your menu'
                      : 'Your menu is hidden from customers'
                    }
                  </StatusDescription>
                </StatusText>
                <ToggleButton
                  active={currentMenu.isOpen}
                  onClick={handleToggleMenuStatus}
                />
              </MenuStatusToggle>

              {/* Stats Grid */}
              <StatsGrid>
                <StatCard>
                  <StatValue>{dashboardData.totalViews}</StatValue>
                  <StatLabel>
                    <FiEye />
                    Total Views
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{dashboardData.todayViews}</StatValue>
                  <StatLabel>
                    <FiCalendar />
                    Today's Views
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{dashboardData.weeklyOrders}</StatValue>
                  <StatLabel>
                    <FiTrendingUp />
                    Weekly Orders
                  </StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>${dashboardData.monthlyRevenue}</StatValue>
                  <StatLabel>
                    <FiDollarSign />
                    Monthly Revenue
                  </StatLabel>
                </StatCard>
              </StatsGrid>

              {/* Quick Actions */}
              <QuickActionsGrid>
                <QuickActionCard onClick={() => handleQuickAction('add-item')}>
                  <QuickActionIcon>
                    <FiPlus size={24} />
                  </QuickActionIcon>
                  <QuickActionTitle>Add Menu Item</QuickActionTitle>
                  <QuickActionDescription>
                    Add a new dish or beverage to your menu
                  </QuickActionDescription>
                </QuickActionCard>
                
                <QuickActionCard onClick={() => handleQuickAction('qr-code')}>
                  <QuickActionIcon>
                    <FiGrid size={24} />
                  </QuickActionIcon>
                  <QuickActionTitle>Generate QR Code</QuickActionTitle>
                  <QuickActionDescription>
                    Create and customize QR codes for your menu
                  </QuickActionDescription>
                </QuickActionCard>
                
                <QuickActionCard onClick={() => handleQuickAction('preview')}>
                  <QuickActionIcon>
                    <FiEye size={24} />
                  </QuickActionIcon>
                  <QuickActionTitle>Preview Menu</QuickActionTitle>
                  <QuickActionDescription>
                    See how your menu looks to customers
                  </QuickActionDescription>
                </QuickActionCard>
                
                <QuickActionCard onClick={() => handleQuickAction('settings')}>
                  <QuickActionIcon>
                    <FiSettings size={24} />
                  </QuickActionIcon>
                  <QuickActionTitle>Menu Settings</QuickActionTitle>
                  <QuickActionDescription>
                    Customize appearance and preferences
                  </QuickActionDescription>
                </QuickActionCard>
              </QuickActionsGrid>
            </DashboardOverview>

            {/* Recent Activity Section */}
            <RecentActivitySection>
              <OverviewTitle>
                <FiActivity />
                Recent Activity
              </OverviewTitle>
              {dashboardData.recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <ActivityItem key={index}>
                    <ActivityIcon>
                      <IconComponent size={16} />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>{activity.text}</ActivityText>
                      <ActivityTime>{activity.time}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                );
              })}
            </RecentActivitySection>

            <MenuHeader>
              <MenuTitle>
                {currentMenu.businessName}
              </MenuTitle>
              {currentMenu.tagline && (
                <MenuTagline>{currentMenu.tagline}</MenuTagline>
              )}
              <MenuMeta>
                <span>{currentMenu.items?.length || 0} items</span>
                <span>Last updated {new Date(currentMenu.updatedAt).toLocaleDateString()}</span>
              </MenuMeta>
            </MenuHeader>

            <MenuContent>
              <SectionHeader>
                <SectionTitle>Menu Items</SectionTitle>
                <AddButton onClick={handleAddItem}>
                  <FiPlus />
                  Add Menu Item
                </AddButton>
              </SectionHeader>

              {currentMenu.items && currentMenu.items.length > 0 ? (
                <MenuItemsList>
                  {currentMenu.items.map((item) => (
                    <MenuItemCard key={item._id}>
                      <ItemImage>
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          '🍽️'
                        )}
                      </ItemImage>
                      
                      <ItemContent>
                        <ItemName>
                          {item.name}
                          {item.isInactive && (
                            <ItemBadge type="inactive">
                              <FiEyeOff />
                              Inactive
                            </ItemBadge>
                          )}
                          {item.isSoldOut && (
                            <ItemBadge type="soldout">
                              <FiAlertCircle />
                              Sold Out
                            </ItemBadge>
                          )}
                        </ItemName>
                        {item.description && (
                          <ItemDescription>{item.description}</ItemDescription>
                        )}
                      </ItemContent>
                      
                      <ItemPrice>${item.price?.toFixed(2)}</ItemPrice>
                      
                      <ItemActions>
                        <ActionButton onClick={() => handleEditItem(item)}>
                          <FiEdit3 />
                        </ActionButton>
                        <OverflowMenu>
                          <OverflowButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(item._id);
                            }}
                          >
                            <FiMoreVertical />
                          </OverflowButton>
                          <DropdownMenu isOpen={openDropdown === item._id}>
                            <DropdownItem onClick={() => handleToggleSoldOut(item)}>
                              <FiAlertCircle />
                              {item.isSoldOut ? 'Mark Available' : 'Mark as Sold Out'}
                            </DropdownItem>
                            <DropdownItem onClick={() => handleToggleActive(item)}>
                              {item.isInactive ? <FiEye /> : <FiEyeOff />}
                              {item.isInactive ? 'Activate' : 'Mark as Inactive'}
                            </DropdownItem>
                            <DropdownItem danger onClick={() => handleDeleteItem(item._id, item.name)}>
                              <FiTrash2 />
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </OverflowMenu>
                      </ItemActions>
                    </MenuItemCard>
                  ))}
                </MenuItemsList>
              ) : (
                <EmptyState>
                  <EmptyStateIcon>🍽️</EmptyStateIcon>
                  <h3>No menu items yet</h3>
                  <p>Add your first menu item to get started!</p>
                  <AddButton onClick={handleAddItem} style={{ marginTop: '1rem' }}>
                    <FiPlus />
                    Add Menu Item
                  </AddButton>
                </EmptyState>
              )}
            </MenuContent>
          </>
        )}
      </MainContent>

      {currentMenu && (
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          editingItem={editingItem}
          menuId={currentMenu._id}
          categories={currentMenu?.categories || [
            { name: 'Main Dishes', order: 0 },
            { name: 'Sides', order: 1 },
            { name: 'Beverages', order: 2 }
          ]}
        />
      )}
    </ManagementContainer>
  );
};

export default MenuManagement;