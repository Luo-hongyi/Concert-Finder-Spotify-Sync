import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserApi, loginApi, logoutApi, signupApi, updateUserApi } from '../services/apiService';
import { clearAllStorage, loadUser, storeToken, storeUser } from '../utils/localStorage';

// Create an empty context object
const AuthContext = createContext({});

/**
 * Authentication context provider component
 * Manages user authentication state and provides auth-related functions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} AuthContext Provider component
 */
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = loadUser();
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Restore user login state from localStorage on page refresh
  useEffect(() => {
    const storedUser = loadUser();
    setUser(JSON.parse(storedUser));
  }, []);

  /**
   * Authenticates user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Response containing user data and token or error
   */
  const login = async (email, password) => {
    try {
      // console.log('Attempting login with:', { email });
      const response = await loginApi(email, password);
      // console.log('Login success: ', response);
      // alert(JSON.stringify(response));

      if (response?.token) {
        const { token, user } = response;
        storeUser(user);
        storeToken(token);
        setUser(user);
        return response;
      }
      return { error: 'Login failed, check email and password and try again.' };
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      // throw error;
      return { error: error.message };
    }
  };

  /**
   * Registers a new user
   * @param {Object} formData - User registration data
   * @returns {Promise<void>}
   */
  const signup = async (formData) => {
    try {
      const data = {
        ...formData,
        zip_code: formData.zip_code || '61820',
        range: formData.range && Number.isInteger(Number(formData.range)) ? formData.range : '250',
      };

      await signupApi(data.email, data.password, data.name, data.zip_code, data.range);
      await login(data.email, data.password);
    } catch (error) {
      console.error('Error during sign up:', error.message);
      throw error;
    }
  };

  /**
   * Logs out the current user and clears all storage
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      // Clear local state
      clearAllStorage();
      setTimeout(async () => {
        setUser(null);
        // console.log('logout: user set to null');

        // Call backend API, even if it fails, it won't affect frontend state
        await logoutApi();
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error.message);
      // Do not throw error, ensure frontend state is cleared
    }
  };

  /**
   * Fetches current user data from the server
   * @returns {Promise<Object>} User data
   */
  const fetchUser = async () => {
    // console.log('fetchUser: from database');
    try {
      const userData = await fetchUserApi();
      storeUser(userData);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear user state only if token is invalid
      if (error.response?.data?.error === 'Invalid token') {
        clearAllStorage();
        setUser(null);
        // console.log('fetchUser: user set to null');
      }
      throw error;
    }
  };

  /**
   * Updates user data in the database and local state
   * @param {Object} userData - Updated user information
   * @returns {Promise<void>}
   */
  const updateUser = async (userData) => {
    // console.log('updateUser: to database');
    await updateUserApi(userData);
    setUser(userData);
    // console.log('updateUser: user set to: ', userData);
  };

  // Global state provided to child components
  const value = {
    user,
    isLoggedIn: Boolean(user), // Logged in if user data exists
    signup,
    login,
    logout,
    fetchUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for accessing auth context in child components
 * Usage:
 * import { UseAuthContext } from '@/contexts/AuthContext';
 * const { user, isLoggedIn, ... } = UseAuthContext();
 * @returns {Object} Auth context value
 */
export const UseAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
