import type { Collection, CollectionItem } from "@/types/domain";

/**
 * Collections Service
 * Manages user's custom collections
 */

const mockCollections: Collection[] = [];

export const collectionsService = {
  /**
   * Get all collections for a user
   */
  async getUserCollections(userId: string): Promise<Collection[]> {
    return mockCollections.filter((c) => c.userId === userId);
  },

  /**
   * Get a specific collection
   */
  async getCollection(userId: string, collectionId: string): Promise<Collection | null> {
    return mockCollections.find((c) => c.userId === userId && c.id === collectionId) || null;
  },

  /**
   * Create a new collection
   */
  async createCollection(userId: string, collection: Omit<Collection, "id" | "userId" | "items" | "createdAt" | "updatedAt">): Promise<Collection> {
    const newCollection: Collection = {
      ...collection,
      id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCollections.push(newCollection);
    return newCollection;
  },

  /**
   * Update a collection
   */
  async updateCollection(userId: string, collectionId: string, updates: Partial<Collection>): Promise<Collection> {
    const index = mockCollections.findIndex((c) => c.userId === userId && c.id === collectionId);

    if (index === -1) {
      throw new Error("Collection not found");
    }

    const updated = {
      ...mockCollections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockCollections[index] = updated;
    return updated;
  },

  /**
   * Add item to collection
   */
  async addItem(userId: string, collectionId: string, item: CollectionItem): Promise<Collection> {
    const collection = await this.getCollection(userId, collectionId);

    if (!collection) {
      throw new Error("Collection not found");
    }

    // Check if item already exists
    const exists = collection.items.some((i) => i.itemId === item.itemId && i.type === item.type);

    if (exists) {
      throw new Error("Item already in collection");
    }

    collection.items.push(item);
    collection.updatedAt = new Date().toISOString();

    return collection;
  },

  /**
   * Remove item from collection
   */
  async removeItem(userId: string, collectionId: string, type: string, itemId: string): Promise<Collection> {
    const collection = await this.getCollection(userId, collectionId);

    if (!collection) {
      throw new Error("Collection not found");
    }

    collection.items = collection.items.filter((i) => !(i.type === type && i.itemId === itemId));
    collection.updatedAt = new Date().toISOString();

    return collection;
  },

  /**
   * Delete a collection
   */
  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    const index = mockCollections.findIndex((c) => c.userId === userId && c.id === collectionId);

    if (index === -1) {
      throw new Error("Collection not found");
    }

    mockCollections.splice(index, 1);
  },

  /**
   * Get collection count
   */
  async getCollectionCount(userId: string): Promise<number> {
    return mockCollections.filter((c) => c.userId === userId).length;
  },
};
