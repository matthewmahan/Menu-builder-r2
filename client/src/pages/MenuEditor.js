import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiEdit3, FiTrash2, FiMove, FiEye, FiSettings } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MenuItemModal from '../components/MenuItemModal';

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  height: calc(100vh - 64px); // Subtract navbar height
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const MainEditor = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  background: white;
`;

const EditorTitle = styled.div`
  flex: 1;
`;

const BusinessName = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Tagline = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const EditorActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  font-size: ${props => props.theme.fontSizes.sm};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.colors.primary.main};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary.dark};
  }
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const EditorContent = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  background: ${props => props.theme.colors.background.primary};
`;


const AddButton = styled(Button)`
  background: ${props => props.theme.colors.success.main};
  color: white;
  font-size: ${props => props.theme.fontSizes.sm};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.success.dark};
  }
`;

const CategorySection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.primary.main};
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.primary.main};
  margin: 0;
`;

const MenuItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const MenuItem = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  cursor: grab;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    cursor: grabbing;
  }
`;

const MenuItemImage = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.lg};
  flex-shrink: 0;
`;

const MenuItemContent = styled.div`
  flex: 1;
`;

const MenuItemName = styled.h4`
  font-size: ${props => props.theme.fontSizes.base};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MenuItemDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
  line-height: 1.4;
`;

const MenuItemPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.primary.main};
  margin-right: ${props => props.theme.spacing.md};
`;

const MenuItemActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.border.light};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const MenuEditor = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { currentMenu, loading, fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } = useMenu();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (menuId) {
      fetchMenu(menuId);
    }
  }, [menuId, fetchMenu]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = currentMenu.items.findIndex(item => item._id === active.id);
      const newIndex = currentMenu.items.findIndex(item => item._id === over.id);
      
      const newItems = arrayMove(currentMenu.items, oldIndex, newIndex);
      const itemIds = newItems.map(item => item._id);
      
      await reorderMenuItems(menuId, itemIds);
    }
  };

  const handleAddItem = (category = null) => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        // Update existing item
        await updateMenuItem(menuId, editingItem._id, itemData);
      } else {
        // Add new item
        await addMenuItem(menuId, itemData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(menuId, itemId);
    }
  };

  const handlePreview = () => {
    navigate(`/menu-preview/${menuId}`);
  };

  const handleSettings = () => {
    // Open menu settings modal
    console.log('Open menu settings');
  };

  const groupItemsByCategory = () => {
    if (!currentMenu?.items) return {};
    
    const grouped = {};
    const categories = currentMenu.categories || [
      { name: 'Main Dishes', order: 0 },
      { name: 'Sides', order: 1 },
      { name: 'Beverages', order: 2 }
    ];

    // Initialize categories
    categories.forEach(category => {
      grouped[category.name] = [];
    });

    // Group items by category
    currentMenu.items.forEach(item => {
      const categoryName = item.category || 'Main Dishes';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });

    return grouped;
  };

  if (loading) {
    return (
      <EditorContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" text="Loading menu..." />
        </LoadingContainer>
      </EditorContainer>
    );
  }

  if (!currentMenu) {
    return (
      <EditorContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Menu not found</h2>
          <p>The menu you're looking for doesn't exist or you don't have permission to edit it.</p>
        </div>
      </EditorContainer>
    );
  }

  const groupedItems = groupItemsByCategory();

  return (
    <EditorContainer>
      <Sidebar>
        <h3>Menu Tools</h3>
        <p>Drag and drop items to reorder them within categories.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h4>Quick Stats</h4>
          <p>Total Items: {currentMenu.items?.length || 0}</p>
          <p>Categories: {Object.keys(groupedItems).length}</p>
          <p>Status: {currentMenu.isOpen ? 'Open' : 'Closed'}</p>
        </div>
      </Sidebar>

      <MainEditor>
        <EditorHeader>
          <EditorTitle>
            <BusinessName>{currentMenu.businessName}</BusinessName>
            {currentMenu.tagline && <Tagline>{currentMenu.tagline}</Tagline>}
          </EditorTitle>
          
          <EditorActions>
            <SecondaryButton onClick={handleSettings}>
              <FiSettings />
              Settings
            </SecondaryButton>
            <SecondaryButton onClick={handlePreview}>
              <FiEye />
              Preview
            </SecondaryButton>
            <PrimaryButton onClick={handleAddItem}>
              <FiPlus />
              Add Item
            </PrimaryButton>
          </EditorActions>
        </EditorHeader>

        <EditorContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {Object.entries(groupedItems).map(([categoryName, items]) => (
              <CategorySection key={categoryName}>
                <CategoryHeader>
                  <CategoryName>{categoryName}</CategoryName>
                  <AddButton onClick={() => handleAddItem(categoryName)}>
                    <FiPlus />
                    Add Item
                  </AddButton>
                </CategoryHeader>

                {items.length > 0 ? (
                  <SortableContext items={items.map(item => item._id)} strategy={verticalListSortingStrategy}>
                    <MenuItemsList>
                      {items.map((item) => (
                        <MenuItem key={item._id}>
                          <MenuItemImage>
                            {item.image ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                            ) : (
                              <FiMove />
                            )}
                          </MenuItemImage>
                          
                          <MenuItemContent>
                            <MenuItemName>{item.name}</MenuItemName>
                            {item.description && (
                              <MenuItemDescription>{item.description}</MenuItemDescription>
                            )}
                          </MenuItemContent>
                          
                          <MenuItemPrice>${item.price?.toFixed(2)}</MenuItemPrice>
                          
                          <MenuItemActions>
                            <IconButton onClick={() => handleEditItem(item)}>
                              <FiEdit3 />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteItem(item._id)}>
                              <FiTrash2 />
                            </IconButton>
                          </MenuItemActions>
                        </MenuItem>
                      ))}
                    </MenuItemsList>
                  </SortableContext>
                ) : (
                  <EmptyState>
                    <p>No items in this category yet.</p>
                    <AddButton onClick={() => handleAddItem(categoryName)}>
                      <FiPlus />
                      Add First Item
                    </AddButton>
                  </EmptyState>
                )}
              </CategorySection>
            ))}
          </DndContext>
        </EditorContent>
      </MainEditor>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        editingItem={editingItem}
        categories={currentMenu?.categories || [
          { name: 'Main Dishes', order: 0 },
          { name: 'Sides', order: 1 },
          { name: 'Beverages', order: 2 }
        ]}
      />
    </EditorContainer>
  );
};

export default MenuEditor;