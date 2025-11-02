import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import UserList from './components/UserList';
import axios from 'axios';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/user');
    
    // If backend sends { users: [...] }
    if (Array.isArray(response.data)) {
      setUsers(response.data);
    } else {
      setUsers(response.data.users || []);  
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]); // fallback to empty array
  }
};


  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    fetchUsers();
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Authentication App</h1>
          {loggedInUser && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {loggedInUser.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!loggedInUser ? (
          <>
            <div className="max-w-md mx-auto mb-8">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <button 
                  className={`flex-1 py-3 px-4 font-medium text-center ${currentView === 'login' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
                  onClick={() => setCurrentView('login')}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-3 px-4 font-medium text-center ${currentView === 'signup' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
                  onClick={() => setCurrentView('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {currentView === 'login' ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Signup onSignupSuccess={() => setCurrentView('login')} />
            )}
          </>
        ) : (
          <UserList users={users} onUserUpdate={fetchUsers} />
        )}
      </div>
    </div>
  );
}

export default App;
