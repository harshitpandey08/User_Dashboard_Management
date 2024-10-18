import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';  // Import CSS here

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(err => {
        setError('Failed to fetch users. Please make sure the backend is running.');
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:5000/api/users/${id}`)
        .then((response) => {
          console.log(response.data);  // Log the server's response
          setUsers(users.filter(user => user._id !== id)); // Remove user from the state
        })
        .catch(err => {
          console.error(`Error: ${err.response ? err.response.data : err.message}`); // Detailed error log
          setError('Failed to delete the user.');  // Update error state
        });
    }
  };

  if (error) {
    return <div>{error}</div>; // Show error if delete fails
  }

  return (
    <div className="container">
      <h2>User List</h2>
      
      <input 
        type="text" 
        placeholder="Search by name or email" 
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => 
            (user.name.includes(search) || user.email.includes(search)) &&
            (statusFilter === "" || user.status.toString() === statusFilter)
          ).map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone || "N/A"}</td>
              <td>{user.status ? "Active" : "Inactive"}</td>
              <td>
                <Link to={`/users/edit/${user._id}`} className="edit-button">Edit</Link>
                <button onClick={() => handleDelete(user._id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/users/create" className="create-button">Create New User</Link>
    </div>
  );
};

export default UserList;
