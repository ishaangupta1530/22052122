import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const API_BASE_URL = "http://20.244.56.144/evaluation-service";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authResponse = await axios.post("http://20.244.56.144/evaluation-service/auth", {
          email: "22052122@kiit.ac.in",
          name: "ishaan gupta",
          rollNo: "22052122",
          accessCode: "nwpwrZ",
          clientID: "daa2a091-2e8b-4175-83ae-62e6ac8478a3",
          clientSecret: "RNguRZSXqPKGBSNy",
        });
        setToken(authResponse.data.access_token);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    if (!token) return;
    
    const fetchAnalyticsData = async () => {
      try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userPostsResponse = await axios.get(`${API_BASE_URL}/users/1/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postCommentsResponse = await axios.get(`${API_BASE_URL}/posts/1/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const engagementData = userPostsResponse.data.map((post, index) => ({
          date: `Day ${index + 1}`,
          engagement: post.likes + post.comments,
        }));
        
        const topUsersData = usersResponse.data.map(user => ({
          username: user.name,
          postCount: user.posts.length,
        }));
        
        const trendingPostsData = postCommentsResponse.data.map(post => ({
          postTitle: post.title,
          commentCount: post.comments,
        }));

        setData(engagementData);
        setTopUsers(topUsersData);
        setTrendingPosts(trendingPostsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    
    fetchAnalyticsData();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Social Media Analytics</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold">User Engagement Trends</h3>
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Top Users</h3>
        <BarChart width={500} height={300} data={topUsers}>
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="postCount" fill="#82ca9d" />
        </BarChart>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Trending Posts</h3>
        <PieChart width={500} height={300}>
          <Pie
            data={trendingPosts}
            dataKey="commentCount"
            nameKey="postTitle"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#ffc658"
          >
            {trendingPosts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
