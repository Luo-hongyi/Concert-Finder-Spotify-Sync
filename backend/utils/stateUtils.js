/**
 * Mapping of US state names to their two-letter abbreviations
 * Includes both full state names and abbreviations as keys
 * @type {Object.<string, string>}
 */
const STATE_MAPPING = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
};

/**
 * Adds reverse mapping from abbreviations to themselves
 * This allows the lookup to work with both full names and abbreviations
 * Example: 'AL' -> 'AL' in addition to 'alabama' -> 'AL'
 */
Object.values(STATE_MAPPING).forEach((abbr) => {
  STATE_MAPPING[abbr.toLowerCase()] = abbr;
});

/**
 * Validates and standardizes a US state input
 * @param {string} input - State name or abbreviation to validate (e.g., "California", "CA", "ca")
 * @returns {string|null} - Returns uppercase state abbreviation if valid (e.g., "CA"), null if invalid
 * @example
 * isStateCode("California") // returns "CA"
 * isStateCode("CA") // returns "CA"
 * isStateCode("Invalid") // returns null
 */
const isStateCode = function (input) {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, '');
  return STATE_MAPPING[cleaned] || null;
};

module.exports = { isStateCode };
