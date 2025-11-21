import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

function Header() {
    const { isAuthenticated, username } = useAuth();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header className='navbar navbar-expand-lg bg-body-tertiary sticky-top'>
            <div className='container-fluid'>
                <NavLink to="/" className='navbar-brand'>
                    <h1>Electricity Business</h1>
                </NavLink>
                
                {/* Bouton hamburger pour mobile */}
                <button 
                    className='navbar-toggler' 
                    type='button' 
                    onClick={toggleNav}
                    aria-controls='navbarNav' 
                    aria-expanded={isNavOpen} 
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <nav className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''} `} id='navbarNav'>
                    <ul className='navbar-nav ms-auto text-end'>
                        {isAuthenticated ? (
                            // Navigation pour utilisateur connecté
                            <>
                                <span className='navbar-text me-2'>Bienvenue, {username}!</span>
                                <li className='nav-item'>
                                    <NavLink to="/projects" className='nav-link' onClick={() => setIsNavOpen(false)}>Projets</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to="/tasks" className='nav-link' onClick={() => setIsNavOpen(false)}>Tâches</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to="/logout" className='nav-link' onClick={() => setIsNavOpen(false)}>Déconnexion</NavLink>
                                </li>
                            </>
                        ) : (
                            // Navigation pour utilisateur non connecté
                            <>
                                <li className='nav-item'>
                                    <NavLink to="/login" className='nav-link' onClick={() => setIsNavOpen(false)}>Connexion</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to="/register" className='nav-link' onClick={() => setIsNavOpen(false)}>Inscription</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;