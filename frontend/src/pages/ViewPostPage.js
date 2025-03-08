import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ViewPostPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [authOverlayMessage, setAuthOverlayMessage] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);

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
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError(err.response?.data?.message || 'Error submitting comment');
    }
  };

  const promptDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    try {
      await api.delete(`/comments/${commentToDelete}`);
      setCommentToDelete(null);
      await fetchPost();
    } catch (err) {
      console.error("Error deleting comment:", err);
      setAuthOverlayMessage("Error deleting comment");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
    }
  };

  const cancelDeleteComment = () => {
    setCommentToDelete(null);
  };

  const promptDeletePost = () => {
    setConfirmDeletePost(true);
  };

  const confirmDeletePostAction = async () => {
    if (!user) {
      setAuthOverlayMessage("Please login to use this feature");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
      return;
    }
    try {
      await api.delete(`/posts/${id}`);
      window.location.href = '/';
    } catch (err) {
      console.error("Error deleting post:", err);
      setAuthOverlayMessage("Error deleting post");
      setTimeout(() => setAuthOverlayMessage(''), 3000);
    } finally {
      setConfirmDeletePost(false);
    }
  };

  const cancelDeletePost = () => {
    setConfirmDeletePost(false);
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.gradientBar} />
        {user && post.author && user.userId === post.author._id && (
          <button style={styles.deleteButton} onClick={promptDeletePost}>
            Delete Post
          </button>
        )}
        <div style={styles.postHeader}>
          {post.author && (
            <img
              src={
                post.author.profilePicture
                  ? `http://localhost:5001/${post.author.profilePicture}`
                  : '/placeholderpfp.png'
              }
              alt={`${post.author.username}'s profile`}
              style={styles.profilePicture}
            />
          )}
          <div style={styles.authorInfo}>
            {post.author ? (
              <Link to={`/profile/${post.author._id}`} style={styles.usernameLink}>
                <span style={styles.username}>{post.author.username}</span>
              </Link>
            ) : (
              <span style={styles.username}>Unknown</span>
            )}
            <span style={styles.postTimestamp}>
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div style={styles.postContent}>
          <h1 style={styles.postTitle}>{post.title}</h1>
          <p style={styles.postText}>{post.content}</p>
          <div style={styles.postStats}>
            <span style={styles.iconContainer} onClick={handleToggleLike}>
              <img src="/heart.png" alt="Likes" style={styles.icon} />
              <span>{post.likes}</span>
            </span>
            <span style={styles.iconContainer}>
              <img src="/speechbubble.png" alt="Comments" style={styles.icon} />{" "}
              {post.comments ? post.comments.length : 0}
            </span>
          </div>
          <div style={styles.commentFormInline}>
            <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
              <textarea
                placeholder="Add a Comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                style={styles.commentInput}
              />
              <button type="submit" style={styles.replyButton}>
                Reply
              </button>
              {commentError && <p style={styles.error}>{commentError}</p>}
            </form>
          </div>
        </div>
        <div style={styles.commentsSection}>
          <h2 style={styles.commentsHeader}>All comments</h2>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} style={styles.commentCard}>
                <div style={styles.commentHeader}>
                  <div style={styles.commentHeaderLeft}>
                    {comment.author && (
                      <img
                        src={
                          comment.author.profilePicture
                            ? `http://localhost:5001/${comment.author.profilePicture}`
                            : '/placeholderpfp.png'
                        }
                        alt={`${comment.author.username}'s profile`}
                        style={styles.commentProfilePicture}
                      />
                    )}
                    <span style={styles.commentUsername}>
                      {comment.author ? (
                        <Link to={`/profile/${comment.author._id}`} style={styles.usernameLink}>
                          {comment.author.username}
                        </Link>
                      ) : (
                        'Unknown'
                      )}
                    </span>
                  </div>
                  <span style={styles.commentTimestampInline}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  {user && (user.userId === comment.author?._id || (post.author && user.userId === post.author._id)) && (
                    <button 
                      style={styles.deleteCommentButton} 
                      onClick={() => promptDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={styles.commentText}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p style={styles.noComments}>No comments yet.</p>
          )}
        </div>
        {authOverlayMessage && (
          <div style={styles.overlay}>
            <div style={styles.overlayContent}>
              <h2>{authOverlayMessage}</h2>
            </div>
          </div>
        )}
      </div>
      {commentToDelete && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <h2>Are you sure you want to delete this comment?</h2>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={confirmDeleteComment} style={styles.replyButton}>Yes</button>
              <button onClick={cancelDeleteComment} style={{ ...styles.replyButton, backgroundColor: 'grey', marginLeft: '1rem' }}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeletePost && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <h2>Are you sure you want to delete this post?</h2>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={confirmDeletePostAction} style={styles.replyButton}>Yes</button>
              <button onClick={cancelDeletePost} style={{ ...styles.replyButton, backgroundColor: 'grey', marginLeft: '1rem' }}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '1rem',
    backgroundColor: 'transparent',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center'
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: '0px',
    width: '90%',
    maxWidth: '900px',
    overflow: 'auto',
    position: 'relative'
  },
  gradientBar: {
    height: '10px',
    background:
      'linear-gradient(90deg, rgba(255,235,128,1) 0%, rgba(255,198,11,1) 25%, rgba(255,123,180,1) 65%, rgba(255,87,159,1) 92%)'
  },
  deleteButton: {
    position: 'absolute',
    top: '30px',
    right: '10px',
    padding: '0.5rem 1rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 10
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem'
  },
  profilePicture: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '1rem'
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  username: {
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: 'black'
  },
  usernameLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  postTimestamp: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '0.9rem',
    color: 'lightgrey'
  },
  postContent: {
    padding: '0 1rem 1rem 1rem'
  },
  postTitle: {
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: '900',
    fontSize: '2rem',
    color: 'black',
    marginBottom: '0.5rem'
  },
  postText: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1rem'
  },
  postStats: {
    display: 'flex',
    gap: '1rem',
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1rem'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: '20px',
    marginRight: '0.3rem',
    cursor: 'pointer'
  },
  commentFormInline: {
    marginBottom: '1rem'
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  commentInput: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '1rem',
    color: '#333',
    width: '90%'
  },
  replyButton: {
    padding: '0.40rem 1.2rem',
    borderRadius: '40px',
    border: 'none',
    backgroundColor: 'rgb(255,102,196)',
    color: 'white',
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-start'
  },
  error: {
    color: 'red',
    fontFamily: 'Istok Web, sans-serif'
  },
  commentsSection: {
    padding: '1rem'
  },
  commentsHeader: {
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1rem'
  },
  commentCard: {
    backgroundColor: '#f0f0f0',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '0.9rem',
    position: 'relative'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  commentHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  commentProfilePicture: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  commentUsername: {
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    color: 'darkgrey'
  },
  commentTimestampInline: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '0.8rem',
    color: 'darkgrey'
  },
  commentText: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '0.9rem',
    color: '#555'
  },
  noComments: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '1rem',
    color: '#555'
  },
  deleteCommentButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    padding: '0.3rem 0.6rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  overlayContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: 'Istok Web, sans-serif'
  }
};

export default ViewPostPage;
