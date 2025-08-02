import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { User, Post } from '../types';
import PostCard from '../components/PostCard';
import { Mail, Calendar, User as UserIcon, RefreshCw, Trash2, Edit, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const [userData, userPosts] = await Promise.all([
          apiService.getUser(userId),
          apiService.getUserPosts(userId)
        ]);
        setUser(userData);
        setPosts(userPosts);
        setEditName(userData.name);
        setEditBio(userData.bio || '');
      } catch {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const isOwnProfile = authUser && user && authUser._id === user._id;

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await apiService.updateUser(userId!, { name: editName, bio: editBio });
      setEditSuccess('Profile updated!');
      setUser((u) => u ? { ...u, name: editName, bio: editBio } : u);
      setEditMode(false);
    } catch {
      setEditError('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // Password update (dummy, needs backend route)
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match');
      setPasswordLoading(false);
      return;
    }
    try {
      // Call backend API to update password
      await apiService.updateUser(userId!, { password: passwords.newPassword });
      setPasswordSuccess('Password updated!');
      setShowPasswordForm(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch {
      setPasswordError('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">{error || 'User not found'}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start -mt-16">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <UserIcon className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {isOwnProfile && (
                <button onClick={() => setEditMode((v) => !v)} className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
            {user.bio && !editMode && (
              <p className="mt-4 text-gray-700 leading-relaxed">{user.bio}</p>
            )}
            {editMode && (
              <form onSubmit={handleEditProfile} className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" required maxLength={50} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" maxLength={500} />
                </div>
                {editError && <div className="text-red-600 text-sm">{editError}</div>}
                {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                <div className="flex space-x-2">
                  <button type="submit" disabled={editLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
                  <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            {isOwnProfile && (
              <button onClick={() => setShowPasswordForm((v) => !v)} className="flex items-center space-x-1 mt-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <KeyRound className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            )}
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="mt-1 block w-full border rounded-md px-3 py-2" required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="mt-1 block w-full border rounded-md px-3 py-2" required minLength={6} />
                </div>
                {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
                <div className="flex space-x-2">
                  <button type="submit" disabled={passwordLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Update Password</button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Posts ({posts.length})
          </h2>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="relative group">
                <PostCard post={post} />
                {isOwnProfile && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full p-2 shadow hover:bg-red-700"
                    title="Delete Post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;