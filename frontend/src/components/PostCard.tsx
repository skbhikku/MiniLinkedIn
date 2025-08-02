import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Clock, User, ThumbsUp } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  const hasLiked = !!(isAuthenticated && user && likes.includes(user._id));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) return;
    setIsLiking(true);
    try {
      if (hasLiked) {
        const updated = await apiService.unlikePost(post._id);
        setLikes(updated.likes);
      } else {
        const updated = await apiService.likePost(post._id);
        setLikes(updated.likes);
      }
    } catch {
      // Optionally show error
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${post.author._id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={isLiking || !isAuthenticated}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors ${hasLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
              title={isAuthenticated ? (hasLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
              <ThumbsUp className="h-4 w-4" fill={hasLiked ? '#2563eb' : 'none'} />
              <span>{likes.length}</span>
              <span className="hidden sm:inline">Like</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;