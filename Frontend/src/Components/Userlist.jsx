import React, { useState } from 'react';
import axios from 'axios';

const UserList = ({ users, onUserUpdate }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    about: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      about: user.about || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

 const handleUpdate = async (userId) => {
  setIsLoading(true);
  try {
    const response = await axios.put(
      `http://localhost:5000/api/auth/user/${userId}`,
      editForm
    );

    if (response.status === 200) {
      setEditingUser(null);
      onUserUpdate(); // refresh users
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    setIsLoading(false);
  }
};


  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No users found.</div>
        ) : (
          users.map(user => (
            <div key={user._id} className="p-6">
              {editingUser === user._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <textarea
                      name="about"
                      value={editForm.about}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdate(user._id)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">About:</span> {user.about || 'No information provided'}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleEditClick(user)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;