import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

// Menu context
const MenuContext = createContext();

// Menu reducer
const menuReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_MENUS':
      return {
        ...state,
        menus: action.payload,
        loading: false
      };
    
    case 'SET_CURRENT_MENU':
      return {
        ...state,
        currentMenu: action.payload,
        loading: false
      };
    
    case 'ADD_MENU':
      return {
        ...state,
        menus: [action.payload, ...state.menus],
        currentMenu: action.payload,
        loading: false
      };
    
    case 'UPDATE_MENU':
      return {
        ...state,
        menus: state.menus.map(menu => 
          menu._id === action.payload._id ? action.payload : menu
        ),
        currentMenu: state.currentMenu?._id === action.payload._id 
          ? action.payload 
          : state.currentMenu,
        loading: false
      };
    
    case 'DELETE_MENU':
      return {
        ...state,
        menus: state.menus.filter(menu => menu._id !== action.payload),
        currentMenu: state.currentMenu?._id === action.payload 
          ? null 
          : state.currentMenu,
        loading: false
      };
    
    case 'ADD_MENU_ITEM':
      if (!state.currentMenu) return state;
      
      const updatedMenuWithItem = {
        ...state.currentMenu,
        items: [...state.currentMenu.items, action.payload]
      };
      
      return {
        ...state,
        currentMenu: updatedMenuWithItem,
        menus: state.menus.map(menu => 
          menu._id === updatedMenuWithItem._id ? updatedMenuWithItem : menu
        )
      };
    
    case 'UPDATE_MENU_ITEM':
      if (!state.currentMenu) return state;
      
      const updatedMenuWithUpdatedItem = {
        ...state.currentMenu,
        items: state.currentMenu.items.map(item => 
          item._id === action.payload._id ? action.payload : item
        )
      };
      
      return {
        ...state,
        currentMenu: updatedMenuWithUpdatedItem,
        menus: state.menus.map(menu => 
          menu._id === updatedMenuWithUpdatedItem._id ? updatedMenuWithUpdatedItem : menu
        )
      };
    
    case 'DELETE_MENU_ITEM':
      if (!state.currentMenu) return state;
      
      const updatedMenuWithoutItem = {
        ...state.currentMenu,
        items: state.currentMenu.items.filter(item => item._id !== action.payload)
      };
      
      return {
        ...state,
        currentMenu: updatedMenuWithoutItem,
        menus: state.menus.map(menu => 
          menu._id === updatedMenuWithoutItem._id ? updatedMenuWithoutItem : menu
        )
      };
    
    case 'REORDER_MENU_ITEMS':
      if (!state.currentMenu) return state;
      
      const reorderedMenu = {
        ...state.currentMenu,
        items: action.payload
      };
      
      return {
        ...state,
        currentMenu: reorderedMenu,
        menus: state.menus.map(menu => 
          menu._id === reorderedMenu._id ? reorderedMenu : menu
        )
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload
      };
    
    case 'TOGGLE_MENU_STATUS':
      if (!state.currentMenu) return state;
      
      const toggledMenu = {
        ...state.currentMenu,
        isOpen: !state.currentMenu.isOpen
      };
      
      return {
        ...state,
        currentMenu: toggledMenu,
        menus: state.menus.map(menu => 
          menu._id === toggledMenu._id ? toggledMenu : menu
        )
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  menus: [],
  currentMenu: null,
  loading: false,
  error: null,
  previewMode: false
};

// Menu provider component
export const MenuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  // Fetch all menus
  const fetchMenus = async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get('/menus', { params });

      dispatch({ type: 'SET_MENUS', payload: response.data.menus });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch menus';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fetch single menu
  const fetchMenu = async (menuId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get(`/menus/${menuId}`);

      dispatch({ type: 'SET_CURRENT_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch menu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Fetch public menu
  const fetchPublicMenu = async (shortUrl) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get(`/menus/public/${shortUrl}`);

      dispatch({ type: 'SET_CURRENT_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Menu not found';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Create new menu
  const createMenu = async (menuData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post('/menus', menuData);

      dispatch({ type: 'ADD_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create menu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update menu
  const updateMenu = async (menuId, menuData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`/menus/${menuId}`, menuData);

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update menu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete menu
  const deleteMenu = async (menuId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.delete(`/menus/${menuId}`);

      dispatch({ type: 'DELETE_MENU', payload: menuId });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete menu';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Add menu item
  const addMenuItem = async (menuId, itemData) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`/menus/${menuId}/items`, itemData);

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add menu item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update menu item
  const updateMenuItem = async (menuId, itemId, itemData) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`/menus/${menuId}/items/${itemId}`, itemData);

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update menu item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete menu item
  const deleteMenuItem = async (menuId, itemId) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.delete(`/menus/${menuId}/items/${itemId}`);

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete menu item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Reorder menu items
  const reorderMenuItems = async (menuId, itemIds) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`/menus/${menuId}/items/reorder`, { itemIds });

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reorder menu items';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Toggle menu status (open/closed)
  const toggleMenuStatus = async (menuId) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.put(`/menus/${menuId}/toggle-status`);

      dispatch({ type: 'TOGGLE_MENU_STATUS' });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle menu status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Get menu versions
  const getMenuVersions = async (menuId) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get(`/menus/${menuId}/versions`);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch menu versions';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Restore menu from version
  const restoreMenuVersion = async (menuId, versionNumber) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`/menus/${menuId}/restore/${versionNumber}`);

      dispatch({ type: 'UPDATE_MENU', payload: response.data });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to restore menu version';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Set current menu
  const setCurrentMenu = (menu) => {
    dispatch({ type: 'SET_CURRENT_MENU', payload: menu });
  };

  // Clear current menu
  const clearCurrentMenu = () => {
    dispatch({ type: 'SET_CURRENT_MENU', payload: null });
  };

  // Set preview mode
  const setPreviewMode = (enabled) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: enabled });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value = {
    ...state,
    fetchMenus,
    fetchMenu,
    fetchPublicMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
    toggleMenuStatus,
    getMenuVersions,
    restoreMenuVersion,
    setCurrentMenu,
    clearCurrentMenu,
    setPreviewMode,
    clearError
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to use menu context
export const useMenu = () => {
  const context = useContext(MenuContext);
  
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  
  return context;
};

export default MenuContext;