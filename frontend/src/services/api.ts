const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

export const apiService = {
  // Like a post
  async likePost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  // Unlike a post
  async unlikePost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/unlike`, {
      method: 'POST',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
  // Authentication
  async register(userData: { name: string; email: string; password: string; bio: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: createHeaders(true),
    });
    
    return handleResponse(response);
  },

  // Posts
  async getPosts() {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: createHeaders(),
    });
    
    return handleResponse(response);
  },

  async createPost(content: string) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ content }),
    });
    
    return handleResponse(response);
  },

  async getUserPosts(userId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
      headers: createHeaders(),
    });
    
    return handleResponse(response);
  },

  async deletePost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    
    return handleResponse(response);
  },

  // Users
  async getUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: createHeaders(),
    });
    
    return handleResponse(response);
  },

  async updateUser(userId: string, userData: { name?: string; bio?: string; password?: string }) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};