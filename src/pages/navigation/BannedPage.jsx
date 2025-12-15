import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function BannedPage() {
    const location = useLocation();
    const { logout } = useAuth();
    
    const userId = location.state?.userId;
    const reason = location.state?.reason || 'account_banned';

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <main className="container-fluid d-flex align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="card shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
                <div className="card-body p-4 text-center">
                    <div className="mb-4">
                        <i className="bi bi-exclamation-triangle-fill text-danger" style={{fontSize: '4rem'}}></i>
                    </div>
                    
                    <h2 className="card-title text-danger mb-3">Compte suspendu</h2>
                    
                    <p className="text-muted mb-4">
                        Votre compte a été suspendu et vous ne pouvez plus accéder aux fonctionnalités de la plateforme.
                    </p>
                    
                    <div className="alert alert-warning" role="alert">
                        <strong>Raison :</strong> Violation des conditions d'utilisation
                    </div>
                    
                    <p className="small text-muted mb-4">
                        Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre équipe de support.
                    </p>
                    
                    <div className="d-grid gap-2">
                        <button 
                            onClick={handleLogout}
                            className="btn btn-outline-primary"
                        >
                            Se déconnecter
                        </button>
                        
                        <Link 
                            to="/"
                            className="btn btn-link text-muted"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                    
                    {userId && (
                        <p className="small text-muted mt-3">
                            ID de référence: {userId}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default BannedPage;