import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (location.hash === '#signup') {
            setActiveTab('signup');
        }
    }, [location]);

    const handleLogin = () => {
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/discover');
            }
        })
        .catch(err => setError('Something went wrong'));
    };

    const handleSignup = () => {
        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setMessage('Signup successful! Please login.');
                setActiveTab('login');
                setError('');
            }
        })
        .catch(err => setError('Something went wrong'));
    };

    return (
        <div>
            <nav className="navbar">
                <div className="left-nav">
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                    <div className="logo">CineVault</div>
                </div>
            </nav>

            <div className="auth-container">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => { setActiveTab('login'); setError(''); setMessage(''); }}>Login</button>
                    <button className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => { setActiveTab('signup'); setError(''); setMessage(''); }}>Sign Up</button>
                </div>

                {error && <p className="error-msg">{error}</p>}
                {message && <p className="success-msg">{message}</p>}

                {activeTab === 'login' && (
                    <div className="form-section">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="submit-btn" onClick={handleLogin}>Login</button>
                    </div>
                )}

                {activeTab === 'signup' && (
                    <div className="form-section">
                        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="submit-btn" onClick={handleSignup}>Sign Up</button>
                    </div>
                )}
            </div>

            <footer>
                <p>About | Contact | Github</p>
            </footer>
        </div>
    );
}

export default Login;