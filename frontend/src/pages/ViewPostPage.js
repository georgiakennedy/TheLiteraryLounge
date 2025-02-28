import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ViewPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);

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
    try {
      await api.post(`/posts/${id}/toggle-like`);
      fetchPost();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    try {
      await api.post('/comments', { content: newComment, post: id });
      setNewComment('');
      setCommentError(null);
      fetchPost();
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError(err.response?.data?.message || 'Error submitting comment');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <strong>Likes:</strong> {post.likes}
      </p>
      <button onClick={handleToggleLike}>Like</button>
      <p>
        <strong>Author:</strong>{' '}
        {post.author ? (
          <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
        ) : (
          'Unknown'
        )}
      </p>
      
      <h2>Comments</h2>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <div
            key={comment._id}
            style={{
              border: '1px solid #ccc',
              padding: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <p style={{ fontWeight: 'bold' }}>
              {comment.author ? (
                <Link to={`/profile/${comment.author._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {comment.author.username}
                </Link>
              ) : (
                'Unknown'
              )}
            </p>
            <p>{comment.content}</p>
            <p>
              <strong>Posted:</strong> {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <form onSubmit={handleCommentSubmit} style={{ marginTop: '1rem' }}>
        <div>
          <label>Add a Comment:</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit">Submit Comment</button>
        {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
      </form>
    </div>
  );
};

export default ViewPostPage;
