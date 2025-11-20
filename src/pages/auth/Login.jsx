import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const formData = {
            username,
            password,
        };

        try {
            await login(formData);
            navigate('/projects');
        } catch (error) {
            setError(error.message || 'Échec de la connexion, veuillez vérifier vos identifiants et réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (value.trim() === '') {
            setUsernameError('Le nom d\'utilisateur est requis');
        } else {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value.trim() === '') {
            setPasswordError('Le mot de passe est requis');
        } else {
            setPasswordError('');
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="card shadow-sm" style={{maxWidth: '400px', width: '100%'}}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Connexion</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form method="post" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Nom d'utilisateur
                            </label>
                            <input 
                                type="text" 
                                id="username"
                                name="username" 
                                className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                                value={username}
                                onChange={(e) => handleUsernameChange(e)}
                                required 
                            />
                            {usernameError && (
                                <div className="invalid-feedback">
                                    {usernameError}
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Mot de passe
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => handlePasswordChange(e)}
                                required 
                            />
                            {passwordError && (
                                <div className="invalid-feedback">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                        
                        <button 
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            disabled={isSubmitting || usernameError || passwordError}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="mb-0 text-muted">
                            Pas de compte ? <Link to="/register" className="link-primary text-decoration-none">S'inscrire</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;