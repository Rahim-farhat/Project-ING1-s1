const InterviewPrepPage = () => {
    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Préparation aux entretiens</h2>
                <p className="subtitle">Entraînez-vous avec des questions d&apos;entretien personnalisées</p>
            </div>

            <div className="content-card">
                <div className="interview-prep-content">
                    <div className="prep-section">
                        <div className="info-icon" style={{ margin: '0 auto 1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Système d&apos;entraînement</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Préparez-vous aux entretiens avec des questions adaptées à votre profil
                        </p>

                        <div className="quiz-categories">
                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Questions techniques</h4>
                                        <p>Testez vos compétences techniques</p>
                                    </div>
                                </div>
                                <button className="btn-primary">
                                    Commencer
                                </button>
                            </div>

                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Questions comportementales</h4>
                                        <p>Préparez vos soft skills</p>
                                    </div>
                                </div>
                                <button className="btn-primary">
                                    Commencer
                                </button>
                            </div>

                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Études de cas</h4>
                                        <p>Résolvez des problèmes réels</p>
                                    </div>
                                </div>
                                <button className="btn-primary">
                                    Commencer
                                </button>
                            </div>
                        </div>

                        <div className="security-info" style={{ marginTop: '2rem' }}>
                            <h3>💡 Conseil</h3>
                            <p>Pratiquez régulièrement pour améliorer vos performances lors des entretiens. Nos questions sont conçues pour simuler des situations réelles.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrepPage;
