import { useState } from 'react';

const InterviewQuiz = ({ quizData, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        return null;
    }

    const currentQuestion = quizData.questions[currentIndex];
    const progress = ((currentIndex + 1) / quizData.questions.length) * 100;

    const handleNext = () => {
        setShowAnswer(false);
        if (currentIndex < quizData.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        setShowAnswer(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container quiz-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>🎯 Préparation Entretien</h2>
                        <p className="subtitle">{quizData.application.company} - {quizData.application.position}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="quiz-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="modal-body quiz-body">
                    <div className="quiz-info">
                        <span className="question-counter">Question {currentIndex + 1} / {quizData.questions.length}</span>
                        <span className={`question-type type-${currentQuestion.type}`}>
                            {currentQuestion.type === 'cv' && '📄 Basé sur votre CV'}
                            {currentQuestion.type === 'requirement' && '📋 Basé sur les exigences'}
                            {currentQuestion.type === 'general' && '💼 Question générale'}
                        </span>
                    </div>

                    <div className="question-card">
                        <div className="question-category">{currentQuestion.category}</div>
                        <h3 className="question-text">{currentQuestion.question}</h3>
                        {currentQuestion.relatedTo && (
                            <p className="question-context">
                                <strong>Contexte:</strong> {currentQuestion.relatedTo}
                            </p>
                        )}
                    </div>

                    <div className="quiz-tips">
                        <h4>💡 Conseils pour répondre:</h4>
                        <ul>
                            <li>Utilisez la méthode STAR (Situation, Tâche, Action, Résultat)</li>
                            <li>Soyez spécifique avec des exemples concrets</li>
                            <li>Quantifiez vos résultats quand c'est possible</li>
                            <li>Reliez votre réponse aux besoins de l'entreprise</li>
                        </ul>
                    </div>

                    <div className="quiz-navigation">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            ← Précédent
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            disabled={currentIndex === quizData.questions.length - 1}
                        >
                            Suivant →
                        </button>
                    </div>
                </div>

                <div className="modal-footer quiz-footer">
                    <div className="quiz-stats">
                        📊 {quizData.breakdown.cvBased} questions CV •
                        📋 {quizData.breakdown.requirementBased} exigences •
                        💼 {quizData.breakdown.general} générales
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewQuiz;
