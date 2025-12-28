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
        <header className='navbar navbar-expand-lg bg-body-tertiary sticky-top' style={{minHeight: "var(--header-height)"}}>
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
                                <li className='nav-item dropdown'>
                                    <NavLink to="/" className="nav-link" onClick={toggleNav}>Accueil</NavLink>
                                </li>
                                <li className='nav-item dropdown'>
                                    <NavLink to="/dashboard" className="nav-link" onClick={toggleNav}>Tableau de bord</NavLink>
                                </li>
                                <li className='nav-item dropdown'>
                                    <a className='nav-link dropdown-toggle' href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                        Mon compte
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><NavLink to="/profile" className="dropdown-item" onClick={toggleNav}>Profil</NavLink></li>
                                        <li><NavLink to="/settings" className="dropdown-item" onClick={toggleNav}>Paramètres</NavLink></li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li><NavLink to="/logout" className="dropdown-item text-danger" onClick={toggleNav}>Déconnexion</NavLink></li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            // Navigation pour utilisateur non connecté
                            <>
                                <li className='nav-item'>
                                    <NavLink to="/login" className='nav-link' onClick={toggleNav}>Connexion</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink to="/register" className='nav-link' onClick={toggleNav}>Inscription</NavLink>
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