import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS

const EditUser = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 // Fetch user data on mount
 useEffect(() => {
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setStatus(response.data.status);
    } catch (err) {
      console.error("Error fetching user details:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };
    fetchUserData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { name, email, phone, status });
      // Optionally, you could display a success message here
      navigate('/users');
    } catch (err) {
      console.error("Error updating user:", err.response || err.message);
      setError("An error occurred while updating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit User</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Name:</label>
          <input 
            type="text" 
            placeholder='Name'
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-row">
          <label className="form-label">Email:</label>
          <input 
            type="email"
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-row">
          <label className="form-label">Phone:</label>
          <input 
            type="text" 
            placeholder="Phone"
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        
        <div className="form-row">
          <label className="form-label">Active:</label>
          <input 
            type="checkbox" 
            checked={status} 
            onChange={(e) => setStatus(e.target.checked)} 
          />
        </div>
        
        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
      </form>
    </div>
  );
};

export default EditUser;
