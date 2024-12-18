require('dotenv').config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const database = process.env.MONGODB_DATABASE;

const url = `mongodb+srv://${username}:${password}@${database}`;

module.exports = { url };
