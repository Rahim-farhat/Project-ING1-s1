const GenerateCVPage = () => {
    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Générer un CV</h2>
                <p className="subtitle">Créez votre CV professionnel avec l&apos;aide de l&apos;IA</p>
            </div>

            <div className="content-card">
                <div className="cv-generator-content">
                    <div className="generator-section">
                        <div className="info-icon" style={{ margin: '0 auto 1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Générateur de CV IA</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Utilisez notre outil intelligent pour créer un CV professionnel adapté à vos besoins
                        </p>

                        <div className="info-grid">
                            <div className="info-card">
                                <div className="info-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                </div>
                                <div className="info-content">
                                    <label>Templates modernes</label>
                                    <p>Plusieurs modèles disponibles</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </svg>
                                </div>
                                <div className="info-content">
                                    <label>IA intégrée</label>
                                    <p>Suggestions intelligentes</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                                        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                                        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <div className="info-content">
                                    <label>Export PDF</label>
                                    <p>Format professionnel</p>
                                </div>
                            </div>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14"></path>
                                <path d="M5 12h14"></path>
                            </svg>
                            Créer un nouveau CV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateCVPage;
