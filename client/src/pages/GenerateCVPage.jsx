import { useState } from 'react';
import api from '../api/axios';

const GenerateCVPage = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedCV, setGeneratedCV] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateCV = async () => {
        if (!jobDescription.trim()) {
            setError('Veuillez entrer une description de poste.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedCV(null);

        try {
            const response = await api.post('/cv/generate', { jobDescription });
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
                                    Entrez la description du poste pour générer un CV sur mesure.
                                </p>
                            </>
                        )}

                        {/* Input Section */}
                        <div className="input-section" style={{ width: '100%', marginBottom: '2rem' }}>
                            <label htmlFor="jobDescription" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                Description du poste cible <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Copiez-collez ici la description complète du poste (Titre, missions, pré-requis, etc.)..."
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    resize: 'vertical',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.5',
                                    backgroundColor: loading ? '#f1f5f9' : 'white'
                                }}
                            />
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
                                    onClick={() => window.open('https://www.overleaf.com/docs?snip_uri=' + encodeURIComponent('data:text/x-tex;base64,' + btoa(generatedCV)), '_blank')}
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
            <style jsx>{`
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
