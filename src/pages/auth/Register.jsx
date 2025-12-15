import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';

function Register() {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const formData = {
            username,
            password,
            email,
            first_name: firstName,
            last_name: lastName,
            birth_date: birthdate
        };

        try {
            await register(formData);
            navigate('/verify', { 
                state: { email: email },
                replace: true 
            });
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors de l\'inscription, veuillez réessayer plus tard.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (value.trim() === '') {
            setUsernameError('Le nom d\'utilisateur est requis');
        } else if (value.length < 3) {
            setUsernameError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        } else if (value.length > 200) {
            setUsernameError('Le nom d\'utilisateur ne peut pas dépasser 200 caractères');
        } else {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value.trim() === '') {
            setPasswordError('Le mot de passe est requis');
        } else if (value.length < 3) {
            setPasswordError('Le mot de passe doit contenir au moins 3 caractères');
        } else if (value.length > 200) {
            setPasswordError('Le mot de passe ne peut pas dépasser 200 caractères');
        } else {
            setPasswordError('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value.trim() === '') {
            setEmailError('L\'email est requis');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('L\'email n\'est pas valide');
        } else {
            setEmailError('');
        }
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        if (value.trim() === '') {
            setFirstNameError('Le prénom est requis');
        } else if (value.length < 2) {
            setFirstNameError('Le prénom doit contenir au moins 2 caractères');
        } else if (value.length > 200) {
            setFirstNameError('Le prénom ne peut pas dépasser 200 caractères');
        } else {
            setFirstNameError('');
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        if (value.trim() === '') {
            setLastNameError('Le nom est requis');
        } else if (value.length < 2) {
            setLastNameError('Le nom doit contenir au moins 2 caractères');
        } else if (value.length > 200) {
            setLastNameError('Le nom ne peut pas dépasser 200 caractères');
        } else {
            setLastNameError('');
        }
    };

    const handleBirthdateChange = (e) => {
        const value = e.target.value;
        setBirthdate(value);
        if (value.trim() === '') {
            setBirthdateError('La date de naissance est requise');
        } else {
            setBirthdateError('');
        }
    };

    return (
        <main className="container-fluid d-flex align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="card shadow-sm" style={{maxWidth: '400px', width: '100%'}}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Inscription</h2>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            label="Nom d'utilisateur"
                            value={username}
                            onChange={handleUsernameChange}
                            error={usernameError}
                            required
                            disabled={isSubmitting}
                        />
                        
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Mot de passe"
                            value={password}
                            onChange={handlePasswordChange}
                            error={passwordError}
                            required
                            disabled={isSubmitting}
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={handleEmailChange}
                            error={emailError}
                            required
                            disabled={isSubmitting}
                        />

                        <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            label="Prénom"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            error={firstNameError}
                            required
                            disabled={isSubmitting}
                        />

                        <Input
                            id="last_name"
                            name="last_name"
                            type="text"
                            label="Nom"
                            value={lastName}
                            onChange={handleLastNameChange}
                            error={lastNameError}
                            required
                            disabled={isSubmitting}
                        />

                        <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            label="Date de naissance"
                            value={birthdate}
                            onChange={handleBirthdateChange}
                            error={birthdateError}
                            required
                            disabled={isSubmitting}
                        />
                        
                        <Button
                            type="submit"
                            className="w-100 mb-3"
                            disabled={usernameError || passwordError || emailError || firstNameError || lastNameError || birthdateError}
                            loading={isSubmitting}
                            loadingText="Inscription en cours..."
                        >
                            S'inscrire
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="mb-0 text-muted">
                            Déjà un compte ? <Link to="/login" className="link-primary text-decoration-none">Se connecter</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;