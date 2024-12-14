const questionData = {
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

// Очистка старых данных в localStorage перед загрузкой новых
localStorage.removeItem('questionData');

// Загрузка данных из localStorage, если они есть
if (localStorage.getItem('questionData')) {
    const savedData = JSON.parse(localStorage.getItem('questionData'));
    questionData.questions = savedData.questions;
    questionData.score = savedData.score;
}

const questionText = document.getElementById('questionText');
const submitButton = document.getElementById('submitAnswer');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const tryAgainButton = document.getElementById('tryAgain');
const seeResultsButton = document.getElementById('seeResultsButton');

// Отображение текущего вопроса
let currentQuestionIndex = 0;

function loadQuestion() {
    const question = questionData.questions[currentQuestionIndex];
    questionText.innerHTML = question.question;
    answerInput.value = '';
    feedback.innerHTML = '';
    scoreDisplay.innerHTML = `Your score: ${questionData.score}`;
}

// Проверка ответа
submitButton.addEventListener('click', () => {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentQuestion = questionData.questions[currentQuestionIndex];

    currentQuestion.userAnswer = userAnswer; // Сохраняем ответ пользователя

    if (userAnswer === currentQuestion.correctAnswer.toLowerCase()) {
        currentQuestion.answeredCorrectly = true;
        questionData.score++;
        feedback.innerHTML = '<p style="color: green;">Well done!</p>';
    } else {
        currentQuestion.answeredCorrectly = false;
        feedback.innerHTML = '';  // Ничего не выводится при неверном ответе
    }

    // Сохраняем данные в localStorage
    localStorage.setItem('questionData', JSON.stringify(questionData));

    // Переход к следующему вопросу
    currentQuestionIndex++;
    if (currentQuestionIndex < questionData.questions.length) {
        loadQuestion();
    } else {
        // Отображаем итоговый результат
        feedback.innerHTML = `<p>Your score: ${questionData.score} out of ${questionData.questions.length}</p>`;

        // Сообщение в зависимости от результата
        let resultMessage = '';
        if (questionData.score === 5) {
            resultMessage = 'Excellent!';
        } else if (questionData.score >= 3) {
            resultMessage = 'Great! Good job!';
        } else {
            resultMessage = 'You did well, but try again';
        }
        feedback.innerHTML += `<p>${resultMessage}</p>`;

        // Показываем кнопку "See results" и "Try again"
        seeResultsButton.style.display = 'block';
        tryAgainButton.style.display = 'block';
    }
});

tryAgainButton.addEventListener('click', () => {
    // Сброс всех данных для повторного прохождения
    questionData.questions.forEach(question => {
        question.userAnswer = '';
        question.answeredCorrectly = false;
    });
    questionData.score = 0;
    currentQuestionIndex = 0;

    tryAgainButton.style.display = 'none';
    seeResultsButton.style.display = 'none';

    localStorage.removeItem('questionData');

    loadQuestion();  // Перезагружаем первый вопрос
});

// Показ результатов (неправильные ответы)
seeResultsButton.addEventListener('click', () => {
    let incorrectQuestionsHTML = '';

    questionData.questions.forEach(question => {
        if (!question.answeredCorrectly) {
            incorrectQuestionsHTML += `
                <p><strong>Question:</strong> ${question.question}</p>
                <p><strong>Your Answer:</strong> ${question.userAnswer}</p>
                <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                <hr>
            `;
        }
    });

    // Выводим вопросы с неверными ответами
    feedback.innerHTML = incorrectQuestionsHTML;
    seeResultsButton.style.display = 'none';  // Скрываем кнопку "See results"
});

// Загрузка первого вопроса
loadQuestion();
