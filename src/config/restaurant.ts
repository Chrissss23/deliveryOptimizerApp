// Restaurant Configuration
// Update this file to change your restaurant's location and details

export const RESTAURANT_CONFIG = {
  // Restaurant Location (required for route optimization)
  location: {
    lat: 42.16132924545894, // Latitude - Update this to your restaurant's latitude
    lng: -70.90251311349468, // Longitude - Update this to your restaurant's longitude
    name: "Seasons Café & Deli", // Update this to your restaurant's name
    address: "938 Hingham St, Rockland, MA 02370", // Update this to your restaurant's address
  },

  // Restaurant Details
  name: "Seasons Cafe", // Update this to your restaurant's name
  phone: "+1-781-534-0616", // Update this to your restaurant's phone number

  // Default delivery radius (in miles)
  deliveryRadius: 5,

  // Average preparation time (in minutes)
  avgPrepTime: 20,
};

// Helper function to get restaurant location
export const getRestaurantLocation = () => {
  return RESTAURANT_CONFIG.location;
};

// Helper function to get restaurant details
export const getRestaurantDetails = () => {
  return {
    name: RESTAURANT_CONFIG.name,
    phone: RESTAURANT_CONFIG.phone,
    address: RESTAURANT_CONFIG.location.address,
  };
};
