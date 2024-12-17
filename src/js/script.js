// Obiectul care conține datele testului (pentru fiecare test)
const questionData = {
    testId: "Test 1",  // Numele testului
    questions: [
        {
            question: 'I will ____ tennis this evening with my friend Jim.',
            correctAnswer: 'play',
            userAnswer: '',
            answeredCorrectly: false
        },
        {
            question: 'Please do not ___ around the house, you are making noise.',
            correctAnswer: 'run',
            userAnswer: '',
            answeredCorrectly: false
        },
        {
            question: 'The circus lions ____ through the hoop.',
            correctAnswer: 'jump',
            userAnswer: '',
            answeredCorrectly: false
        },
        {
            question: 'He tried to ____ the last candy from me.',
            correctAnswer: 'hide',
            userAnswer: '',
            answeredCorrectly: false
        },
        {
            question: 'We need to ____ a suitable person for the job.',
            correctAnswer: 'find',
            userAnswer: '',
            answeredCorrectly: false
        }
    ],
    score: 0
};

// Ține evidența indexului curent
let currentQuestionIndex = 0;

// Obține elementele din HTML
const questionText = document.getElementById('questionText');
const submitButton = document.getElementById('submitAnswer');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const tryAgainButton = document.getElementById('tryAgain');
const seeResultsButton = document.getElementById('seeResultsButton');

// Încărcăm datele anterioare din localStorage, dacă există
let allTests = JSON.parse(localStorage.getItem('allTests')) || [];

// Funcție pentru încărcarea unui nou test (sau primul test)
function loadQuestion() {
    const question = questionData.questions[currentQuestionIndex];
    questionText.innerHTML = question.question;
    answerInput.value = '';
    feedback.innerHTML = '';
}



// Funcție pentru a salva testul în localStorage
function saveTest() {
    // Verificăm dacă allTests este un array valid
    if (!Array.isArray(allTests)) {
        allTests = []; // Dacă nu este un array valid, îl resetăm la un array gol
    }

    // Căutăm dacă există deja un test cu același testId
    const existingTestIndex = allTests.findIndex(test => test.testId === questionData.testId);

    if (existingTestIndex !== -1) {
        // Dacă testul există deja, îl actualizăm
        allTests[existingTestIndex] = questionData;
    } else {
        // Dacă testul nu există, îl adăugăm ca un test nou
        allTests.push(questionData);
    }

    // Salvăm lista de teste în localStorage
    localStorage.setItem('allTests', JSON.stringify(allTests));
}

// Evenimentul care se activează la trimiterea răspunsului
submitButton.addEventListener('click', () => {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentQuestion = questionData.questions[currentQuestionIndex];

    currentQuestion.userAnswer = userAnswer; 

    // Verificăm dacă răspunsul este corect
    if (userAnswer === currentQuestion.correctAnswer.toLowerCase()) {
        currentQuestion.answeredCorrectly = true;
        questionData.score++;
        feedback.innerHTML = '<p style="color: green;">Well done!</p>';
    } else {
        currentQuestion.answeredCorrectly = false;
        feedback.innerHTML = ''; 
    }

    // Salvăm testul în localStorage
    saveTest();

    // Mergem la următorul întrebări sau afișăm rezultatele dacă am terminat toate întrebările
    currentQuestionIndex++;
    if (currentQuestionIndex < questionData.questions.length) {
        loadQuestion(); // Încărcăm următoarea întrebare
    } else {
        // Afișăm scorul final
        feedback.innerHTML = `<p>Your score: ${questionData.score} out of ${questionData.questions.length}</p>`;

        // Mesaj de feedback în funcție de scorul obținut
        let resultMessage = '';
        if (questionData.score === 5) {
            resultMessage = 'Excellent!';
        } else if (questionData.score >= 3) {
            resultMessage = 'Great! Good job!';
        } else {
            resultMessage = 'You did well, but try again';
        }
        feedback.innerHTML += `<p>${resultMessage}</p>`;

        // Afișăm butoanele pentru a reîncepe sau a vedea rezultatele
        seeResultsButton.style.display = 'block';
        tryAgainButton.style.display = 'block';
    }
});

// Evenimentul pentru a încerca din nou
tryAgainButton.addEventListener('click', () => {
    // Resetează datele pentru a încerca din nou testul
    questionData.questions.forEach(question => {
        question.userAnswer = '';
        question.answeredCorrectly = false;
    });
    questionData.score = 0;
    currentQuestionIndex = 0;

    tryAgainButton.style.display = 'none';
    seeResultsButton.style.display = 'none';

    // Resetează datele în localStorage
    localStorage.removeItem('allTests');

    loadQuestion();  // Încarcă prima întrebare
});

// Funcția pentru a vizualiza rezultatele
seeResultsButton.addEventListener('click', () => {
    let incorrectQuestionsHTML = '';

    // Parcurgem testele din localStorage și afișăm întrebările greșite
    allTests.forEach(test => {
        test.questions.forEach((question, index) => {
            if (!question.answeredCorrectly) {
                incorrectQuestionsHTML += `
                    <p><strong>Question:</strong> ${question.question}</p>
                    <p><strong>Your Answer:</strong> ${question.userAnswer}</p>
                    <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                    <hr>
                `;
            }
        });
    });

    // Afișează întrebările cu răspunsuri greșite
    feedback.innerHTML = incorrectQuestionsHTML;
    seeResultsButton.style.display = 'none'; // Ascunde butonul de "Vezi rezultate"
});

// Încarcă prima întrebare la început
loadQuestion();
