import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import BASE_URL from "../config";

function MemberProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [memberUser, setMemberUser] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    fetch(`${BASE_URL}/user/${id}`)
      .then((res) => res.json())
      .then((data) => setMemberUser(data))
      .catch((err) => console.log("Error:", err));
    fetch(`${BASE_URL}/logs/${id}`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.log("Error:", err));
  }, [id]);

  return (
    <div>
      <div className="member-topbar">
        <button className="member-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h2 className="profile-username">
            {memberUser ? memberUser.name : "Loading..."}
          </h2>
          <p className="profile-bio">Film lover...</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{logs.length}</span>
              <span className="stat-label">Logged</span>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content">
        <div className="film-grid">
          {logs.map((log) => (
            <div className="film-card" key={log.id}>
              <img src={log.poster_url} alt={log.film_title} />
              <p className="film-name">{log.film_title}</p>
              <p className="film-rating">⭐ {log.rating}/10</p>
              <p className="film-mood">{log.mood}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default MemberProfile;
