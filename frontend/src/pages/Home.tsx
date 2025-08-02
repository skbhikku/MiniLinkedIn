import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Post } from '../types';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { RefreshCw } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      const fetchedPosts = await apiService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Hero Section: Only show if not logged in */}
      {!isAuthenticated && (
        <div className="bg-blue-50 rounded-lg p-6 mb-4 text-center shadow">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to MiniLinkedIn</h1>
          <p className="text-gray-700 mb-2">
            MiniLinkedIn is your modern, lightweight professional networking platform.<br />
            <br />
            <strong>Features:</strong>
            <ul className="list-disc list-inside text-left max-w-xl mx-auto my-4">
              <li>Share public, text-only posts with your network</li>
              <li>Like and interact with posts from others</li>
              <li>View a personalized feed after logging in</li>
              <li>Manage your profile, including name, bio, and password</li>
              <li>Delete your own posts at any time</li>
              <li>See how many likes your posts receive</li>
              <li>Simple, clean, and mobile-friendly design</li>
            </ul>
            <br />
            <span className="font-medium">Create an account to join the conversation, build your profile, and grow your professional network!</span>
          </p>
          <p className="text-gray-500 text-sm mt-4">Built for learning and demo purposes. No sensitive data, no ads, just pure networking fun!</p>
        </div>
      )}

      {isAuthenticated && (
        <>
          <CreatePost onPostCreated={fetchPosts} />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
            <button
              onClick={fetchPosts}
              disabled={refreshing}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
