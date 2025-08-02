import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit3, FiTrash2, FiGrid, FiSettings, FiMoreVertical, FiEyeOff, FiEye, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MenuItemModal from '../components/MenuItemModal';

const ManagementContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
`;

const Sidebar = styled.div`
  width: 280px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.primary ? props.theme.colors.primary.main : 'white'};
  color: ${props => props.primary ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.primary ? props.theme.colors.primary.main : props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  justify-content: center;
  text-decoration: none;

  &:hover {
    background: ${props => props.primary ? props.theme.colors.primary.dark : props.theme.colors.background.secondary};
    transform: translateY(-1px);
    text-decoration: none;
    color: ${props => props.primary ? 'white' : props.theme.colors.text.primary};
  }
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

// Mock data for demonstration
const mockMenu = {
  _id: '1',
  businessName: 'Tasty Food Truck',
  tagline: 'Fresh, delicious meals on wheels!',
  updatedAt: new Date().toISOString(),
  items: [
    {
      _id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
      price: 12.99,
      category: 'Main Dishes',
      image: null,
      isInactive: false,
      isSoldOut: false
    },
    {
      _id: '2',
      name: 'Crispy Fries',
      description: 'Golden crispy fries seasoned to perfection',
      price: 4.99,
      category: 'Sides',
      image: null,
      isInactive: false,
      isSoldOut: true
    },
    {
      _id: '3',
      name: 'Fresh Lemonade',
      description: 'Refreshing homemade lemonade with real lemons',
      price: 3.99,
      category: 'Beverages',
      image: null,
      isInactive: true,
      isSoldOut: false
    },
    {
      _id: '4',
      name: 'Grilled Chicken Wrap',
      description: 'Tender grilled chicken with fresh vegetables in a soft tortilla',
      price: 10.99,
      category: 'Main Dishes',
      image: null,
      isInactive: false,
      isSoldOut: false
    }
  ]
};

const MenuManagementDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState(mockMenu.items);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteItem = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      setMenuItems(prev => prev.filter(item => item._id !== itemId));
    }
    setOpenDropdown(null);
  };

  const handleToggleSoldOut = (item) => {
    setMenuItems(prev => prev.map(menuItem =>
      menuItem._id === item._id
        ? { ...menuItem, isSoldOut: !menuItem.isSoldOut }
        : menuItem
    ));
    setOpenDropdown(null);
  };

  const handleToggleActive = (item) => {
    setMenuItems(prev => prev.map(menuItem =>
      menuItem._id === item._id
        ? { ...menuItem, isInactive: !menuItem.isInactive }
        : menuItem
    ));
    setOpenDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setMenuItems(prev => prev.map(item =>
        item._id === editingItem._id
          ? { ...item, ...itemData }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        _id: Date.now().toString(),
        isInactive: false,
        isSoldOut: false,
        ...itemData
      };
      setMenuItems(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
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

  return (
    <ManagementContainer>
      <Sidebar>
        <h3>Menu Tools</h3>
        <SidebarLink to="/demo">
          <FiGrid />
          Dashboard
        </SidebarLink>
        <SidebarLink primary to="/qr-generator">
          <FiGrid />
          QR Code
        </SidebarLink>
        <SidebarLink to="/settings">
          <FiSettings />
          Settings
        </SidebarLink>
      </Sidebar>

      <MainContent>
        <MenuHeader>
          <MenuTitle>
            {mockMenu.businessName}
          </MenuTitle>
          {mockMenu.tagline && (
            <MenuTagline>{mockMenu.tagline}</MenuTagline>
          )}
          <MenuMeta>
            <span>{menuItems.length} items</span>
            <span>Last updated {new Date(mockMenu.updatedAt).toLocaleDateString()}</span>
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

          <MenuItemsList>
            {menuItems.map((item) => (
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
        </MenuContent>
      </MainContent>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        editingItem={editingItem}
        categories={[
          { name: 'Main Dishes', order: 0 },
          { name: 'Sides', order: 1 },
          { name: 'Beverages', order: 2 }
        ]}
      />
    </ManagementContainer>
  );
};

export default MenuManagementDemo;