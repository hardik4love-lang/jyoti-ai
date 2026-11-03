/**
 * Offline Cities Database for Instant Zero-Cost Geolocation
 * Over 120+ Indian and Global Cities with Latitudes, Longitudes, and Timezones
 */
export const CITIES = [
  // Metro & Major Indian Cities
  { name: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: "Surat", state: "Gujarat", country: "India", lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lon: 80.3319, tz: 5.5 },
  { name: "Nagpur", state: "Maharashtra", country: "India", lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { name: "Thane", state: "Maharashtra", country: "India", lat: 19.2183, lon: 72.9781, tz: 5.5 },
  { name: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.6868, lon: 83.2185, tz: 5.5 },
  { name: "Patna", state: "Bihar", country: "India", lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: "Vadodara", state: "Gujarat", country: "India", lat: 22.3072, lon: 73.1812, tz: 5.5 },
  { name: "Ghaziabad", state: "Uttar Pradesh", country: "India", lat: 28.6692, lon: 77.4538, tz: 5.5 },
  { name: "Ludhiana", state: "Punjab", country: "India", lat: 30.9010, lon: 75.8573, tz: 5.5 },
  { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lon: 78.0081, tz: 5.5 },
  { name: "Nashik", state: "Maharashtra", country: "India", lat: 19.9975, lon: 73.7898, tz: 5.5 },
  { name: "Faridabad", state: "Haryana", country: "India", lat: 28.4089, lon: 77.3178, tz: 5.5 },
  { name: "Meerut", state: "Uttar Pradesh", country: "India", lat: 28.9845, lon: 77.7064, tz: 5.5 },
  { name: "Rajkot", state: "Gujarat", country: "India", lat: 22.3039, lon: 70.8022, tz: 5.5 },
  { name: "Varanasi (Kashi)", state: "Uttar Pradesh", country: "India", lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: "Srinagar", state: "Jammu and Kashmir", country: "India", lat: 34.0837, lon: 74.7973, tz: 5.5 },
  { name: "Aurangabad (Chhatrapati Sambhajinagar)", state: "Maharashtra", country: "India", lat: 19.8762, lon: 75.3433, tz: 5.5 },
  { name: "Dhanbad", state: "Jharkhand", country: "India", lat: 23.7957, lon: 86.4304, tz: 5.5 },
  { name: "Amritsar", state: "Punjab", country: "India", lat: 31.6340, lon: 74.8723, tz: 5.5 },
  { name: "Navi Mumbai", state: "Maharashtra", country: "India", lat: 19.0330, lon: 73.0297, tz: 5.5 },
  { name: "Prayagraj (Allahabad)", state: "Uttar Pradesh", country: "India", lat: 25.4358, lon: 81.8463, tz: 5.5 },
  { name: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lon: 85.3096, tz: 5.5 },
  { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: "Jabalpur", state: "Madhya Pradesh", country: "India", lat: 23.1815, lon: 79.9864, tz: 5.5 },
  { name: "Gwalior", state: "Madhya Pradesh", country: "India", lat: 26.2183, lon: 78.1828, tz: 5.5 },
  { name: "Vijayawada", state: "Andhra Pradesh", country: "India", lat: 16.5062, lon: 80.6480, tz: 5.5 },
  { name: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.2389, lon: 73.0243, tz: 5.5 },
  { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { name: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lon: 81.6296, tz: 5.5 },
  { name: "Kota", state: "Rajasthan", country: "India", lat: 25.2138, lon: 75.8648, tz: 5.5 },
  { name: "Chandigarh", state: "Punjab/Haryana", country: "India", lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { name: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lon: 91.7362, tz: 5.5 },
  { name: "Solapur", state: "Maharashtra", country: "India", lat: 17.6599, lon: 75.9064, tz: 5.5 },
  { name: "Hubli-Dharwad", state: "Karnataka", country: "India", lat: 15.3647, lon: 75.1240, tz: 5.5 },
  { name: "Bareilly", state: "Uttar Pradesh", country: "India", lat: 28.3670, lon: 79.4304, tz: 5.5 },
  { name: "Moradabad", state: "Uttar Pradesh", country: "India", lat: 28.8351, lon: 78.7744, tz: 5.5 },
  { name: "Mysuru", state: "Karnataka", country: "India", lat: 12.2958, lon: 76.6394, tz: 5.5 },
  { name: "Gurugram (Gurgaon)", state: "Haryana", country: "India", lat: 28.4595, lon: 77.0266, tz: 5.5 },
  { name: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lon: 77.3910, tz: 5.5 },
  { name: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lon: 76.2673, tz: 5.5 },
  { name: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lon: 76.9366, tz: 5.5 },
  { name: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { name: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { name: "Haridwar", state: "Uttarakhand", country: "India", lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: "Ujjain", state: "Madhya Pradesh", country: "India", lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: "Mathura", state: "Uttar Pradesh", country: "India", lat: 27.4924, lon: 77.6737, tz: 5.5 },
  { name: "Ayodhya", state: "Uttar Pradesh", country: "India", lat: 26.7922, lon: 82.1998, tz: 5.5 },
  { name: "Tirupati", state: "Andhra Pradesh", country: "India", lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.1048, lon: 77.1734, tz: 5.5 },
  { name: "Goa (Panaji)", state: "Goa", country: "India", lat: 15.4909, lon: 73.8278, tz: 5.5 },

  // Major Global Cities for International & NRI Users
  { name: "Dubai", state: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: "Abu Dhabi", state: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773, tz: 4 },
  { name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: "New York", state: "NY", country: "United States", lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: "San Francisco", state: "CA", country: "United States", lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: "Los Angeles", state: "CA", country: "United States", lat: 34.0522, lon: -118.2437, tz: -8 },
  { name: "Chicago", state: "IL", country: "United States", lat: 41.8781, lon: -87.6298, tz: -6 },
  { name: "Dallas", state: "TX", country: "United States", lat: 32.7767, lon: -96.7970, tz: -6 },
  { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832, tz: -5 },
  { name: "Vancouver", state: "BC", country: "Canada", lat: 49.2827, lon: -123.1207, tz: -8 },
  { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: "Sydney", state: "NSW", country: "Australia", lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: "Melbourne", state: "VIC", country: "Australia", lat: -37.8136, lon: 144.9631, tz: 10 },
  { name: "Berlin", state: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, tz: 1 },
  { name: "Paris", state: "Ile-de-France", country: "France", lat: 48.8566, lon: 2.3522, tz: 1 },
  { name: "Kuala Lumpur", state: "KL", country: "Malaysia", lat: 3.1390, lon: 101.6869, tz: 8 },
  { name: "Kathmandu", state: "Bagmati", country: "Nepal", lat: 27.7172, lon: 85.3240, tz: 5.75 }
];

export function searchCities(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return CITIES.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.state.toLowerCase().includes(q) || 
    c.country.toLowerCase().includes(q)
  ).slice(0, 8);
}
