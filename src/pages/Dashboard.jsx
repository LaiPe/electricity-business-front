import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
    const { 
        username, 
        email, 
        role, 
        isVerified,
        userId 
    } = useAuth();

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h1>Tableau de bord</h1>
                    <div className="alert alert-success" role="alert">
                        <strong>Bienvenue {username} !</strong> Vous êtes connecté avec succès.
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>Informations du compte</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>ID :</strong> {userId}</p>
                            <p><strong>Nom d'utilisateur :</strong> {username}</p>
                            <p><strong>Email :</strong> {email}</p>
                            <p><strong>Rôle :</strong> 
                                <span className={`badge ${role === 'ADMIN' ? 'bg-danger' : 'bg-primary'} ms-2`}>
                                    {role}
                                </span>
                            </p>
                            <p><strong>Statut :</strong> 
                                <span className={`badge ${isVerified ? 'bg-success' : 'bg-warning'} ms-2`}>
                                    {isVerified ? 'Vérifié' : 'Non vérifié'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Actions disponibles</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2 d-md-flex">
                                <Link to="/profile" className="btn btn-outline-primary">
                                    Mon profil
                                </Link>
                                <Link to="/settings" className="btn btn-outline-secondary">
                                    Paramètres
                                </Link>
                                <Link to="/projects" className="btn btn-outline-info">
                                    Mes projets
                                </Link>
                                {role === 'ADMIN' && (
                                    <Link to="/admin" className="btn btn-outline-danger">
                                        Administration
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="card mt-3">
                        <div className="card-header">
                            <h5>Tests de redirection</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted">Testez les redirections automatiques :</p>
                            <div className="d-grid gap-2 d-md-flex">
                                <Link to="/admin/test" className="btn btn-sm btn-outline-warning">
                                    Tester Admin (sera redirigé si pas admin)
                                </Link>
                                <Link to="/nonexistent" className="btn btn-sm btn-outline-dark">
                                    Route inexistante
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;