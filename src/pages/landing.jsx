import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

const API_KEY = 'c810403a4ebce0a9f3a9d53cef99721d';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function Landing() {
    const [popularFilms, setPopularFilms] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setPopularFilms(data.results))
            .catch(err => console.log('Error fetching films:', err));
    }, []);

    return (
        <div>
            <nav className="navbar">
                <div className="logo">CineVault</div>
                <div className="nav-buttons">
                    <Link to="/login">Login</Link>
                    <Link to="/login#signup">Sign Up</Link>
                </div>
            </nav>

            <section className="hero">
                <h1>Track Films. Discover Yourself</h1>
                <Link to="/login"><button>GET STARTED</button></Link>
            </section>

            <section className="popular">
                <h2>Popular This Week</h2>
                <div className="film-row" id="popular-films">
                    {popularFilms.map(film => (
                        <div className="landing-card" key={film.id}>
                            <img
                                src={IMAGE_BASE + film.poster_path}
                                alt={film.title}
                            />
                            <p>{film.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="activity">
                <h2>Recent Activity</h2>
                <div id="recent-activity">
                    <p>Recent activity will appear here after users log films.</p>
                </div>
            </section>

            <footer>
                <p>About | Contact | Github</p>
            </footer>
        </div>
    );
}

export default Landing;