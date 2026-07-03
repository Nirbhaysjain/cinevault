import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './discover.css';

const API_KEY = 'c810403a4ebce0a9f3a9d53cef99721d';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function Discover() {
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setFilms(data.results))
            .catch(err => console.log('Error fetching films:', err));
    }, []);

    return (
        <div>
            <nav className="navbar">
                <div className="left-nav">
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
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

            <div className="films-section">
                <div className="search-bar">
                    <input type="text" placeholder="🔍 Search films or shows..." />
                </div>

                <div className="filters">
                    <select><option>Genre</option></select>
                    <select><option>Year</option></select>
                    <select><option>Rating</option></select>
                </div>

                <div className="film-grid">
                    {films.map(film => (
                        <div className="film-card" key={film.id}>
                            <img
                                src={IMAGE_BASE + film.poster_path}
                                alt={film.title}
                            />
                            <p className="film-name">{film.title}</p>
                            <p className="film-rating">⭐ {film.vote_average.toFixed(1)}</p>
                            <button className="btn-watchlist">+ Watchlist</button>
                            <button className="btn-log">Log It</button>
                        </div>
                    ))}
                </div>
            </div>

            <footer>
                <p>About | Contact | Github</p>
            </footer>
        </div>
    );
}

export default Discover;