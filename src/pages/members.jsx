import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./members.css";

function Members() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    fetch("http://localhost:5000/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.log("Error:", err));

    fetch(`http://localhost:5000/following/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => setFollowing(data.map((f) => f.following_id)))
      .catch((err) => console.log("Error:", err));
  }, []);

  const handleFollow = (memberId) => {
    fetch("http://localhost:5000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_id: user.id, following_id: memberId }),
    })
      .then((res) => res.json())
      .then(() => {
        setFollowing([...following, memberId]);
        setMembers(
          members.map((m) =>
            m.id === memberId
              ? { ...m, follower_count: m.follower_count + 1 }
              : m,
          ),
        );
      })
      .catch((err) => console.log("Error:", err));
  };

  const handleUnfollow = (memberId) => {
    fetch("http://localhost:5000/follow", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_id: user.id, following_id: memberId }),
    })
      .then((res) => res.json())
      .then(() => {
        setFollowing(following.filter((id) => id !== memberId));
        setMembers(
          members.map((m) =>
            m.id === memberId
              ? { ...m, follower_count: m.follower_count - 1 }
              : m,
          ),
        );
      })
      .catch((err) => console.log("Error:", err));
  };

  const filteredMembers = members
    .filter((m) => m.id !== (user && user.id))
    .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <nav className="navbar">
        <div className="left-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="logo">CineVault</div>
        </div>
        <div className="nav-links">
          <Link to="/discover">Discover</Link>
          <Link to="/members">Members</Link>
        </div>
        <div className="nav-profile">
          <Link to="/profile">👤 Profile</Link>
        </div>
      </nav>

      <div className="members-section">
        <h2>Members</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="members-list">
          {filteredMembers.map((member) => (
            <div className="member-card" key={member.id}>
              <div className="avatar">👤</div>
              <div className="member-info">
                {following.includes(member.id) ? (
                  <Link to={`/member/${member.id}`} className="member-name">
                    {member.name}
                  </Link>
                ) : (
                  <span className="member-name">{member.name}</span>
                )}
                <div className="member-stats">
                  <span>🎬 {member.film_count} Films</span>
                  <span>👥 {member.follower_count} Followers</span>
                  <span>➕ {member.following_count} Following</span>
                </div>
              </div>
              {following.includes(member.id) ? (
                <button
                  className="btn-unfollow"
                  onClick={() => handleUnfollow(member.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn-follow"
                  onClick={() => handleFollow(member.id)}
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p>
          <Link to="/about">About</Link>
        </p>
      </footer>
    </div>
  );
}

export default Members;
