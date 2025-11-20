import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <p className="mb-2 mb-md-1">© 2025 Electricity Business. Tous droits réservés.</p>
                        <p className="mb-0 text-light-emphasis">
                            Application réalisée par{' '}
                            <Link 
                                to="https://portfolio.leopeyronnet.fr/" 
                                className="link-light text-decoration-none"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Léo Peyronnet
                            </Link>
                        </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <div className="d-flex flex-column flex-md-row gap-3 justify-content-md-end mt-2 mt-md-0">
                            <Link to="/privacy-policy" className="link-light text-decoration-none small">
                                Politique de confidentialité
                            </Link>
                            <Link to="/terms-of-service" className="link-light text-decoration-none small">
                                Conditions d'utilisation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;