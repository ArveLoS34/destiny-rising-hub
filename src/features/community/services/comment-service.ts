import type { Comment, ContentType } from '@/types/domain';

/**
 * Comment Service
 * Manages user comments with threading support
 */

class CommentService {
  private comments: Map<string, Comment> = new Map();

  create(
    authorId: string,
    contentType: ContentType,
    contentId: string,
    content: string,
    parentId?: string,
    mentions: string[] = []
  ): Comment {
    const id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newComment: Comment = {
      id,
      authorId,
      contentType,
      contentId,
      parentId,
      content,
      mentions,
      likes: 0,
      replyCount: 0,
      isApproved: true,
      isEdited: false,
      editHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    this.comments.set(id, newComment);

    // Update parent reply count if this is a reply
    if (parentId) {
      const parent = this.comments.get(parentId);
      if (parent) {
        parent.replyCount++;
      }
    }

    return newComment;
  }

  getById(id: string): Comment | undefined {
    return this.comments.get(id);
  }

  getByContent(contentType: ContentType, contentId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter((c) => c.contentType === contentType && c.contentId === contentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getReplies(commentId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter((c) => c.parentId === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  update(id: string, content: string): Comment | undefined {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    const now = new Date().toISOString();

    // Save edit history
    comment.editHistory.push({
      content: comment.content,
      editedAt: now,
    });

    comment.content = content;
    comment.isEdited = true;
    comment.updatedAt = now;

    return comment;
  }

  delete(id: string): boolean {
    const comment = this.comments.get(id);
    if (!comment) return false;

    // Update parent reply count if this is a reply
    if (comment.parentId) {
      const parent = this.comments.get(comment.parentId);
      if (parent && parent.replyCount > 0) {
        parent.replyCount--;
      }
    }

    return this.comments.delete(id);
  }

  addLike(id: string): void {
    const comment = this.comments.get(id);
    if (comment) {
      comment.likes++;
    }
  }

  removeLike(id: string): void {
    const comment = this.comments.get(id);
    if (comment && comment.likes > 0) {
      comment.likes--;
    }
  }

  // Moderation
  approve(id: string): Comment | undefined {
    const comment = this.comments.get(id);
    if (!comment) return undefined;

    comment.isApproved = true;
    return comment;
  }

  getUnapproved(): Comment[] {
    return Array.from(this.comments.values()).filter((c) => !c.isApproved);
  }

  // Search
  search(query: string): Comment[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.comments.values()).filter((c) =>
      c.content.toLowerCase().includes(queryLower)
    );
  }

  // Get by author
  getByAuthor(authorId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter((c) => c.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const commentService = new CommentService();
