import axios from "axios";

const API_URL = "http://20.244.56.144/social-media-analytics"; // Replace with the actual API

export const fetchAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`); // Ensure this matches the correct endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};
