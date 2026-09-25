export type PostType =
  | 'GENERAL'
  | 'ACCOMMODATION'
  | 'HELP'
  | 'TRAVEL'
  | 'CAREER'
  | 'EVENT'
  | 'LOCAL_INFO'
  | 'QUESTION';

export type PostStatus = 'ACTIVE' | 'EDITED' | 'DELETED';
export type CommentStatus = 'ACTIVE' | 'EDITED' | 'DELETED';
export type ReportTargetType = 'POST' | 'COMMENT' | 'USER' | 'ACCOMMODATION';

export interface PostDto {
  id: number;
  communityId: number;
  communityName: string;
  authorId: number;
  authorName: string;
  authorProfession?: string;
  title: string;
  content: string;
  postType: PostType;
  status: PostStatus;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentDto {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorProfession?: string;
  content: string;
  status: CommentStatus;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  postType: PostType;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  postType?: PostType;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  description?: string;
}

export interface ReportDto {
  id: number;
  reporterId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
}
