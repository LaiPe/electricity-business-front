import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function UnauthorizedPage() {
    const location = useLocation();
    const { role } = useAuth();
    
    const requiredRole = location.state?.requiredRole;
    const currentRole = location.state?.currentRole || role;
    const attemptedPath = location.state?.attemptedPath;

    return (
        <main className="container-fluid d-flex align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="card shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
                <div className="card-body p-4 text-center">
                    <div className="mb-4">
                        <i className="bi bi-shield-exclamation text-warning" style={{fontSize: '4rem'}}></i>
                    </div>
                    
                    <h2 className="card-title text-warning mb-3">Accès non autorisé</h2>
                    
                    <p className="text-muted mb-4">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                    </p>
                    
                    {requiredRole && (
                        <div className="alert alert-info" role="alert">
                            <strong>Rôle requis :</strong> {requiredRole}
                            <br />
                            <strong>Votre rôle :</strong> {currentRole}
                        </div>
                    )}
                    
                    {attemptedPath && (
                        <p className="small text-muted mb-4">
                            Page demandée : <code>{attemptedPath}</code>
                        </p>
                    )}
                    
                    <div className="d-grid gap-2">
                        <Link 
                            to="/dashboard"
                            className="btn btn-primary"
                        >
                            Retour au tableau de bord
                        </Link>
                        
                        <Link 
                            to="/"
                            className="btn btn-link text-muted"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                    
                    <p className="small text-muted mt-4">
                        Si vous pensez avoir besoin d'un accès à cette section, 
                        contactez votre administrateur.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default UnauthorizedPage;