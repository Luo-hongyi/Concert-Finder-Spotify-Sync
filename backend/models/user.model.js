const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Required system user information
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  password: { type: String, required: true },

  // Optional fields with default values
  zip_code: { type: String, default: '' },
  range: { type: Number, default: 100 },

  // Spotify user information
  // Re-synced every time, no need to store
  // display_name: { type: String, default: '' },
  // spotify_id: { type: String, default: '' },
  // refresh_token: { type: String, default: '' },
  // access_token: { type: String, default: '' },
  // expires_at: { type: Date, default: Date.now },

  // Artists followed by the user
  followed_artists: {
    type: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        followers: { type: Number, default: 0 },
        image: { type: String, default: '' },

        // Ticketmaster related fields
        ticketmaster_id: { type: String, default: '' },
        ticketmaster_url: { type: String, default: '' },
        ticketmaster_image_16_9: { type: String, default: '' },
        ticketmaster_image_3_2: { type: String, default: '' },
        ticketmaster_genre: { type: String, default: '' },

        // Social media and external links
        youtube_link: { type: String, default: '' },
        twitter_link: { type: String, default: '' },
        itunes_link: { type: String, default: '' },
        lastfm_link: { type: String, default: '' },
        spotify_link: { type: String, default: '' },
        facebook_link: { type: String, default: '' },
        musicbrainz_link: { type: String, default: '' },
        instagram_link: { type: String, default: '' },
        wiki_link: { type: String, default: '' },
        homepage_link: { type: String, default: '' },
        upcoming_events: { type: Number, default: 0 },
      },
    ],
    default: [],
  },

  // Events followed by the user
  followed_events: {
    type: [String],
    default: [],
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Mongoose pre-save middleware
 * Updates the updatedAt timestamp before saving the document
 * @param {Function} next - The next middleware function
 */
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
