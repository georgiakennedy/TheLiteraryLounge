import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const profileId = id || (user && user.userId);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError('No profile ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/users/profile/${profileId}`);
        setProfile(response.data.user);
        setPosts(response.data.posts);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{profile.username}'s Profile</h1>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt={`${profile.username}'s profile`}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
        />
      )}
      <h2>Posts by {profile.username}</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Link 
            to={`/post/${post._id}`} 
            key={post._id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 100)}...</p>
              <p>
                <strong>Date:</strong> {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
