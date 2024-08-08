function addLabFields() {
    const numLabs = parseInt(document.getElementById('num-labs').value);
    const labsContainer = document.getElementById('labs-container');
    labsContainer.innerHTML = '';

    for (let i = 1; i <= numLabs; i++) {
        const labField = `
            <div class="field">
                <label class="label">Note obtenue au laboratoire ${i} (%)</label>
                <div class="control">
                    <input class="input" type="number" id="lab-score-${i}">
                </div>
            </div>
            <div class="field">
                <label class="label">Pondération du laboratoire ${i} (%)</label>
                <div class="control">
                    <input class="input" type="number" step="0.01" id="lab-weight-${i}" required>
                </div>
            </div>
        `;
        labsContainer.insertAdjacentHTML('beforeend', labField);
    }
}

function calculateFinalScore() {
    const Q = parseFloat(document.getElementById('quiz-score').value);
    const I = parseFloat(document.getElementById('intra-score').value);
    const PQ = parseFloat(document.getElementById('quiz-weight').value);
    const PI = parseFloat(document.getElementById('intra-weight').value);
    const PF = parseFloat(document.getElementById('final-weight').value);
    const M = 50;  // Moyenne pondérée cible fixée à 50%

    // Calcul du pourcentage cumulé des pondérations des évaluations individuelles
    const PC = PQ + PI + PF;

    // Calcul des contributions actuelles
    const currentScore = (Q * (PQ / 100)) + (I * (PI / 100));

    // Calcul des pondérations et notes des laboratoires
    const numLabs = parseInt(document.getElementById('num-labs').value);
    let totalLabWeights = 0;
    let totalLabScores = 0;
    let missingLabWeight = 0;

    for (let i = 1; i <= numLabs; i++) {
        const labScore = parseFloat(document.getElementById(`lab-score-${i}`).value);
        const labWeight = parseFloat(document.getElementById(`lab-weight-${i}`).value);

        if (!isNaN(labScore)) {
            totalLabScores += labScore * (labWeight / 100);
        } else {
            missingLabWeight += labWeight;
        }

        totalLabWeights += labWeight;
    }

    // Calcul du total des pondérations
    const totalWeight = PC + totalLabWeights;

    // Calcul de la contribution actuelle totale
    const currentTotalScore = currentScore + totalLabScores;

    // Calcul de la note globale nécessaire pour obtenir au moins 50%
    const requiredOverallScore = (M * (totalWeight / 100)) - currentTotalScore;

    // Calcul de la note nécessaire à l'examen final
    const requiredFinalScore = ((M * (PC / 100)) - currentScore) / (PF / 100);

    // Calcul de la note moyenne nécessaire pour les laboratoires restants
    const requiredLabAverage = (requiredOverallScore * 100) / missingLabWeight;

    // Affichage du résultat
    document.getElementById('final-score').innerText = requiredFinalScore.toFixed(2);
    document.getElementById('lab-average').innerText = requiredLabAverage.toFixed(2);
    document.getElementById('result').style.display = 'block';
}
