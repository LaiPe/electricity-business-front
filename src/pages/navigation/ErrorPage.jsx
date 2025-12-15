function ErrorPage() {
    return (
        <main className="container-fluid d-flex flex-column align-items-center justify-content-center hero-fullscreen-height bg-light">
            <div className="text-center">
                <div className="mb-4">
                    <span style={{fontSize: '6rem'}}>❌</span>
                </div>
                <h1>Erreur 404</h1>
                <p>La page que vous recherchez n'existe pas.</p>
            </div>
        </main>
    );
}

export default ErrorPage;