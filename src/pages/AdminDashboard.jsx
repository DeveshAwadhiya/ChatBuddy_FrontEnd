import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/login");
      return;
    }

    const fetchAttempts = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        if (Array.isArray(res.data)) {
          setAttempts(res.data);
        } else {
          setAttempts([]);
          console.error("Unexpected data format for honeypot attempts:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch honeypot attempts", error);
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const handleClearLogs = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/admin/dashboard");
      setAttempts([]);
    } catch (error) {
      console.error("Failed to clear logs", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading honeypot activity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="max-w-7xl mx-auto bg-base-100 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 bg-primary text-primary-content p-5 rounded-lg shadow-md">
          <h1 className="text-4xl font-extrabold">Honeypot Activity Dashboard</h1>
          <div className="space-x-3">
            <button
              onClick={handleClearLogs}
              className="btn btn-warning btn-outline flex items-center space-x-2"
              title="Clear Logs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                />
              </svg>
              <span>Clear Logs</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-outline"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
        {attempts.length === 0 ? (
          <p className="text-center text-lg font-medium">No honeypot activity recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>User Agent</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-base-300">
                    <td>{attempt.ip}</td>
                    <td>{attempt.username || "-"}</td>
                    <td>{attempt.password || "-"}</td>
                    <td className="break-words max-w-xs">{attempt.userAgent || "-"}</td>
                    <td>{new Date(attempt.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
