const User = require('../models/user.model');

/**
 * Find a user by email (email is unique)
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
async function findUser(email) {
  // Attempt to find user by email in database
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('\nError finding user by email: ', error.message);
    return null;
  }
}

/**
 * Save or update a user in the database
 * @param {Object} data - The user data to save or update
 * @param {string} data.email - User's email address (required)
 * @param {string} [data.name] - User's name
 * @param {string} [data.password] - User's password
 * @param {Object} [data...] - Other user properties
 * @returns {Promise<Object>} The saved or updated user object
 * @throws {Error} If there's an error during save operation
 */
async function saveUser(data) {
  try {
    // Check if user already exists
    const user = await User.findOne({ email: data.email });

    // Update existing user
    if (user) {
      Object.assign(user, data);
      await user.save();
      return user;
    } else {
      // Create new user if doesn't exist
      const newUser = new User(data);
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error('\nError saving user:', error.message);
    throw error;
  }
}

/**
 * Delete a user by given parameters
 * @param {Object} params - Parameters to identify the user
 * @param {string} [params.email] - User's email to delete
 * @param {string} [params._id] - User's ID to delete
 * @throws {Error} If deletion operation fails
 * @returns {Promise<void>}
 */
async function deleteUser(params) {
  // Log deletion attempt for debugging
  console.log('\ndeleteUser params: ', params);
  try {
    await User.findOneAndDelete(params);
  } catch (error) {
    console.error('\nError deleting user:', error.message);
    throw error;
  }
}

/**
 * Find all users in the database
 * @description For testing and debugging purposes only. Not recommended for production use.
 * @returns {Promise<Array<Object>>} Array of all user documents
 * @throws {Error} If database query fails
 */
async function findAllUsers() {
  console.log('\nfindAllUsers');
  return await User.find();
}

/**
 * Delete all users from the database
 * @description Warning: This is a destructive operation that cannot be undone
 * @returns {Promise<Object>} MongoDB deletion result object
 * @throws {Error} If deletion operation fails
 */
async function deleteAllUsers() {
  console.log('\ndeleteAllUsers');
  return await User.deleteMany();
}

module.exports = {
  findAllUsers,
  findUser,
  saveUser,
  deleteUser,
  deleteAllUsers,
};
