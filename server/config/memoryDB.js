// Simple in-memory database for development when MongoDB is not available
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.menus = new Map();
    this.userIdCounter = 1;
    this.menuIdCounter = 1;
  }

  // User methods
  createUser(userData) {
    const id = this.userIdCounter++;
    const user = {
      _id: id.toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingStep: 0,
      onboardingCompleted: false,
      subscription: {
        plan: 'free',
        status: 'active',
        startDate: new Date()
      },
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          marketing: false
        },
        timezone: 'America/New_York'
      },
      loginCount: 0,
      lastLoginAt: null
    };
    this.users.set(id.toString(), user);
    return user;
  }

  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id.toString());
  }

  updateUser(id, updates) {
    const user = this.users.get(id.toString());
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
      this.users.set(id.toString(), user);
      return user;
    }
    return null;
  }

  deleteUser(id) {
    return this.users.delete(id.toString());
  }

  // Menu methods
  createMenu(menuData) {
    const id = this.menuIdCounter++;
    const menu = {
      _id: id.toString(),
      ...menuData,
      shortUrl: `menu-${id}`,
      isOpen: true,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: menuData.items || [],
      categories: menuData.categories || [
        { name: 'Main Dishes', order: 0 },
        { name: 'Sides', order: 1 },
        { name: 'Beverages', order: 2 }
      ]
    };
    this.menus.set(id.toString(), menu);
    return menu;
  }

  findMenuById(id) {
    return this.menus.get(id.toString());
  }

  findMenusByOwner(ownerId) {
    const userMenus = [];
    for (const menu of this.menus.values()) {
      if (menu.owner === ownerId) {
        userMenus.push(menu);
      }
    }
    return userMenus;
  }

  findMenuByShortUrl(shortUrl) {
    for (const menu of this.menus.values()) {
      if (menu.shortUrl === shortUrl) {
        return menu;
      }
    }
    return null;
  }

  updateMenu(id, updates) {
    const menu = this.menus.get(id.toString());
    if (menu) {
      Object.assign(menu, updates, { updatedAt: new Date() });
      this.menus.set(id.toString(), menu);
      return menu;
    }
    return null;
  }

  deleteMenu(id) {
    return this.menus.delete(id.toString());
  }

  // Utility methods
  clear() {
    this.users.clear();
    this.menus.clear();
    this.userIdCounter = 1;
    this.menuIdCounter = 1;
  }

  getStats() {
    return {
      users: this.users.size,
      menus: this.menus.size
    };
  }
}

// Create singleton instance
const memoryDB = new MemoryDB();

module.exports = memoryDB;