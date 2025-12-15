import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../utils/ApiRequest';
import Button from '../../components/form/Button';
import Input from '../../components/form/Input';

function Verify() {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [verified, setVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [codeError, setCodeError] = useState('');
    
    const { checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Récupérer l'email et la destination de redirection depuis l'état de navigation
    const email = location.state?.email || '';
    const redirectTo = location.state?.redirectTo || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await apiRequest('/auth/verify', 'POST', { "verification_code": verificationCode });
            
            setSuccess('Votre compte a été vérifié avec succès !');
            setVerified(true);
            
            // Vérifier le statut d'authentification et rediriger vers la destination d'origine
            setTimeout(async () => {
                await checkAuthStatus();
                navigate(redirectTo, { replace: true });
            }, 2000);
            
        } catch (err) {
            setError(err.message || 'Code de vérification invalide. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Ne garder que les chiffres
        if (value.length <= 6) {
            setVerificationCode(value);
            if (value.length === 0) {
                setCodeError('Le code de vérification est requis');
            } else if (value.length < 6) {
                setCodeError('Le code doit contenir exactement 6 chiffres');
            } else {
                setCodeError('');
            }
        }
    };

    const handleResendCode = async () => {
        setError('');
        setSuccess('');
        setIsResending(true);

        try {
            await apiRequest('/auth/refresh-verification-code', 'POST');
            setSuccess('Un nouveau code de vérification a été envoyé à votre adresse email.');
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main className="container-fluid d-flex align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="card shadow-sm" style={{maxWidth: '450px', width: '100%'}}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-3">Vérification du compte</h2>
                    <p className="text-muted text-center mb-4">
                        Nous avons envoyé un code de vérification à 6 chiffres à votre adresse email
                        {email && <><br /><strong>{email}</strong></>}
                        <br />Veuillez saisir ce code ci-dessous.
                    </p>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            name="verificationCode"
                            value={verificationCode}
                            onChange={handleCodeChange}
                            error={codeError}
                            required
                            disabled={isSubmitting}
                            className="text-center"
                            maxLength={6}
                            style={{
                                fontSize: '1.5rem',
                                letterSpacing: '0.5rem',
                                fontWeight: 'bold'
                            }}
                        />
                        
                        <Button
                            type="submit"
                            className="w-100 mb-3"
                            disabled={codeError || verificationCode.length !== 6 || verified}
                            loading={isSubmitting}
                            loadingText="Vérification en cours..."
                        >
                            Vérifier le code
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="mb-2 text-muted">
                            Vous n'avez pas reçu le code ?
                        </p>
                        <Button
                            variant="outline-primary"
                            onClick={handleResendCode}
                            loading={isResending}
                            loadingText="Envoi en cours..."
                            className="mb-3"
                            disabled={isSubmitting}
                        >
                            Renvoyer le code
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Verify;