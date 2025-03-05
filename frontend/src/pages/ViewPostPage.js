import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ViewPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [postDeleteMessage, setPostDeleteMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [authOverlayMessage, setAuthOverlayMessage] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(err.response?.data?.message || 'Error fetching post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleToggleLike = async () => {
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    try {
      await api.post(`/posts/${id}/toggle-like`);
      fetchPost();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    if (!newComment) return;
    try {
      await api.post('/comments', { content: newComment, post: id });
      setNewComment('');
      setCommentError(null);
      await fetchPost();
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError(err.response?.data?.message || 'Error submitting comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    try {
      await api.delete(`/comments/${commentId}`);
      setDeleteMessage("Comment Deleted");
      setTimeout(() => setDeleteMessage(null), 3000);
      fetchPost();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleDeletePost = () => {
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    setConfirmDelete(true);
  };

  const confirmDeletePost = async () => {
    try {
      setConfirmDelete(false);
      await api.delete(`/posts/${id}`);
      setPostDeleteMessage("Post Deleted");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const cancelDeletePost = () => {
    setConfirmDelete(false);
  };

  const handleAuthorClick = (e) => {
    if (!user) {
      e.preventDefault();
      setAuthOverlayMessage("Please login to view this profile");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ padding: '1rem', paddingBottom: '150px' }}>
      {/* Post header with author's profile picture and username */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        {post.author && (
          <img
            src={
              post.author.profilePicture
                ? `http://localhost:5001/${post.author.profilePicture}`
                : '/placeholderpfp.png'
            }
            alt={`${post.author.username}'s profile`}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '50%',
              marginRight: '1rem'
            }}
          />
        )}
        {post.author ? (
          <h2>
            <Link
              to={`/profile/${post.author._id}`}
              onClick={handleAuthorClick}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {post.author.username}
            </Link>
          </h2>
        ) : (
          <h2>Unknown</h2>
        )}
      </div>
      
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <strong>Likes:</strong> {post.likes}
      </p>
      <button onClick={handleToggleLike}>Like</button>
      
      {post.author && user && post.author._id === user.userId && (
        <button 
          onClick={handleDeletePost} 
          style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer', border: 'none', padding: '0.5rem 1rem' }}
        >
          Delete Post
        </button>
      )}
      
      <h2>Comments</h2>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <div
            key={comment._id}
            style={{ 
              position: 'relative', 
              border: '1px solid #ccc', 
              padding: '0.5rem', 
              marginBottom: '0.5rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              {comment.author && (
                <img
                  src={
                    comment.author.profilePicture
                      ? `http://localhost:5001/${comment.author.profilePicture}`
                      : '/placeholderpfp.png'
                  }
                  alt={`${comment.author.username}'s profile`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '0.5rem'
                  }}
                />
              )}
              <p style={{ fontWeight: 'bold', margin: 0 }}>
                {comment.author ? (
                  <Link
                    to={`/profile/${comment.author._id}`}
                    onClick={handleAuthorClick}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {comment.author.username}
                  </Link>
                ) : (
                  'Unknown'
                )}
              </p>
            </div>
            <p>{comment.content}</p>
            <p>
              <strong>Posted:</strong> {new Date(comment.createdAt).toLocaleString()}
            </p>
            {comment.author && user && comment.author._id === user.userId && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  backgroundColor: 'pink',
                  color: 'white',
                  cursor: 'pointer',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px'
                }}
              >
                Delete Comment
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: '1rem',
        borderTop: '1px solid #ccc',
        zIndex: 1000
      }}>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Add a Comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <button type="submit" style={{ marginTop: '0.5rem' }}>Reply</button>
          {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
        </form>
      </div>

      {authOverlayMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>{authOverlayMessage}</h2>
          </div>
        </div>
      )}

      {deleteMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>{deleteMessage}</h2>
          </div>
        </div>
      )}

      {postDeleteMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>{postDeleteMessage}</h2>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>Are you sure you want to delete this post?</h2>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={confirmDeletePost} 
                style={{ marginRight: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                Yes
              </button>
              <button 
                onClick={cancelDeletePost} 
                style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPostPage;
