import { useState, useEffect } from 'react';
import api from '../api/axios';

const GenerateCVPage = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [selectedApplicationId, setSelectedApplicationId] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [generatedCV, setGeneratedCV] = useState(null);
    const [error, setError] = useState(null);

    // Fetch job applications on mount
    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const response = await api.get('/job-applications');
                // The API returns { success: true, count: N, data: [...] }
                // So we need to access response.data.data to get the array
                setJobApplications(response.data.data || []);
            } catch (err) {
                console.error('Error fetching job applications:', err);
                setError('Impossible de charger les candidatures. Veuillez réessayer.');
            } finally {
                setLoadingApplications(false);
            }
        };

        fetchJobApplications();
    }, []);

    const handleGenerateCV = async () => {
        if (!selectedApplicationId) {
            setError('Veuillez sélectionner une candidature.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedCV(null);

        try {
            const response = await api.post('/cvs/generate', { jobApplicationId: selectedApplicationId });
            if (response.data.success) {
                setGeneratedCV(response.data.latex);
            } else {
                setError('Erreur lors de la génération du CV.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la communication avec le serveur.');
        } finally {
            setLoading(false);
        }
    };

    const downloadTex = () => {
        if (!generatedCV) return;
        const blob = new Blob([generatedCV], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Générer un CV</h2>
                <p className="subtitle">Créez votre CV professionnel avec l'aide de l'IA</p>
            </div>

            <div className="content-card">
                <div className="cv-generator-content">
                    {/* Header Icon */}
                    <div className="generator-section">
                        {!generatedCV && (
                            <>
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
                                    Sélectionnez une candidature pour générer un CV sur mesure.
                                </p>
                            </>
                        )}

                        {/* Input Section */}
                        <div className="input-section" style={{ width: '100%', marginBottom: '2rem' }}>
                            <label htmlFor="jobApplication" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                Candidature <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            {loadingApplications ? (
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Chargement des candidatures...</p>
                            ) : jobApplications.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Aucune candidature enregistrée. Veuillez d'abord créer une candidature.
                                </p>
                            ) : (
                                <select
                                    id="jobApplication"
                                    value={selectedApplicationId}
                                    onChange={(e) => setSelectedApplicationId(e.target.value)}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        fontFamily: 'inherit',
                                        backgroundColor: loading ? '#f1f5f9' : 'white',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <option value="">-- Sélectionnez une candidature --</option>
                                    {jobApplications.map((app) => (
                                        <option key={app._id} value={app._id}>
                                            {app.company} - {app.position} ({app.location || 'Non spécifié'})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                                <strong>Erreur:</strong> {error}
                            </div>
                        )}

                        {/* Button */}
                        {!generatedCV && (
                            <button
                                className="btn-primary"
                                onClick={handleGenerateCV}
                                disabled={loading}
                                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                        </svg>
                                        Génération du CV en cours...
                                    </span>
                                ) : (
                                    <>
                                        ✨ Générer mon CV Maintenant
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Result Section */}
                    {generatedCV && (
                        <div className="result-section" style={{ marginTop: '0', animation: 'fadeIn 0.5s ease-out' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Aperçu du Code LaTeX</h3>
                                <button
                                    onClick={() => setGeneratedCV(null)}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Générer un autre
                                </button>
                            </div>

                            <div className="preview-box" style={{
                                backgroundColor: '#1e293b',
                                color: '#e2e8f0',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                overflowX: 'auto',
                                maxHeight: '500px',
                                border: '1px solid #334155',
                                fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                                fontSize: '0.85rem',
                                whiteSpace: 'pre-wrap',
                                positions: 'relative'
                            }}>
                                {generatedCV}
                            </div>

                            <div className="actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    className="btn-primary"
                                    onClick={downloadTex}
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Télécharger le fichier .tex
                                </button>

                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        try {
                                            const base64 = btoa(unescape(encodeURIComponent(generatedCV)));
                                            const dataUri = 'data:text/x-tex;base64,' + base64;
                                            window.open('https://www.overleaf.com/docs?snip_uri=' + encodeURIComponent(dataUri), '_blank');
                                        } catch (e) {
                                            console.error('Error opening Overleaf:', e);
                                            alert('Impossible d\'ouvrir Overleaf avec ce contenu.');
                                        }
                                    }}
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'white', color: '#333', border: '1px solid #ccc' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                    Ouvrir dans Overleaf
                                </button>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                Note : Le téléchargement direct de PDF nécessite un compilateur LaTeX. Vous pouvez utiliser le fichier .tex ci-dessus sur des sites comme Overleaf.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GenerateCVPage;