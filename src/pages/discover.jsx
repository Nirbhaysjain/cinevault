import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './discover.css';

const API_KEY = 'c810403a4ebce0a9f3a9d53cef99721d';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function Discover() {
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setGenres(data.genres))
            .catch(err => console.log('Error fetching genres:', err));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`;
                if (selectedYear) url += `&year=${selectedYear}`;
                fetch(url)
                    .then(res => res.json())
                    .then(data => setFilms(data.results || []))
                    .catch(err => console.log('Error:', err));
            } else {
                let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
                if (selectedGenre) url += `&with_genres=${selectedGenre}`;
                if (selectedYear) url += `&primary_release_year=${selectedYear}`;
                if (selectedRating) url += `&vote_average.gte=${selectedRating}`;
                fetch(url)
                    .then(res => res.json())
                    .then(data => setFilms(data.results || []))
                    .catch(err => console.log('Error:', err));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

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
                    <input
                        type="text"
                        placeholder="🔍 Search films or shows..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        <option value="">Genre</option>
                        {genres.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        <option value="">Year</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select value={selectedRating} onChange={e => setSelectedRating(e.target.value)}>
                        <option value="">Rating</option>
                        <option value="9">9+</option>
                        <option value="8">8+</option>
                        <option value="7">7+</option>
                        <option value="6">6+</option>
                        <option value="5">5+</option>
                    </select>
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