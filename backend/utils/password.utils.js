const bcrypt = require('bcrypt');
const { findUser, saveUser } = require('./users.dao');

/**
 * @constant {number} SALT_ROUNDS - Number of salt rounds for bcrypt password hashing
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 * @async
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If password hashing fails
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    console.log('\nPassword hashing:', {
      saltRounds: SALT_ROUNDS,
      hashLength: hash.length,
    });
    return hash;
  } catch (error) {
    console.error('\nError hashing password:', error);
    throw error;
  }
};

/**
 * Verify if a plain text password matches a hash
 * @async
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} True if password matches, false otherwise
 * @throws {Error} If password verification fails
 */
const verifyPassword = async (password, hash) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    console.log('\nPassword verification:', {
      hashLength: hash.length,
      isValid,
    });
    return isValid;
  } catch (error) {
    console.error('\nError verifying password:', error);
    throw error;
  }
};

/**
 * Reset a user's password by email
 * @async
 * @param {string} email - User's email address
 * @param {string} newPassword - New plain text password to set
 * @returns {Promise<boolean>} True if password reset was successful, false otherwise
 */
async function resetUserPassword(email, newPassword) {
  try {
    const user = await findUser(email);
    if (!user) {
      console.log('\nUser not found:', email);
      return false;
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await saveUser(user);

    console.log('\nPassword reset successful for:', email);
    return true;
  } catch (error) {
    console.error('\nError resetting password:', error);
    return false;
  }
}

/**
 * Password utility functions module
 * @module passwordUtils
 */
module.exports = {
  hashPassword,
  verifyPassword,
  resetUserPassword,
};
