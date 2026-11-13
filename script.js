
/* =================================
   QUIZNOVA - MAIN JAVASCRIPT
================================= */

// APPLICATION DATA
let studentName = "";

let currentSubject = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;

let quizHistory = JSON.parse(
    localStorage.getItem("quizHistory") || "[]"
);

// QUIZ QUESTIONS
const quizData = {
    HTML: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Text Machine Language",
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language"
            ],
            answer: 0
        },
        {
            question: "Which tag creates a paragraph?",
            options: ["<h1>", "<p>", "<br>", "<div>"],
            answer: 1
        },
        {
            question: "Which tag is used to insert an image?",
            options: ["<image>", "<pic>", "<img>", "<src>"],
            answer: 2
        },
        {
            question: "Which tag creates a hyperlink?",
            options: ["<a>", "<link>", "<href>", "<url>"],
            answer: 0
        },
        {
            question: "Which tag creates an unordered list?",
            options: ["<ol>", "<li>", "<ul>", "<list>"],
            answer: 2
        }
    ],

    CSS: [
        {
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Creative Style System",
                "Colorful Style Sheets"
            ],
            answer: 1
        },
        {
            question: "Which property changes text color?",
            options: [
                "background",
                "font-style",
                "color",
                "text-size"
            ],
            answer: 2
        },
        {
            question: "Which symbol is used for an ID selector?",
            options: [".", "#", "*", "&"],
            answer: 1
        },
        {
            question: "Which property changes background color?",
            options: [
                "background-color",
                "color",
                "font-color",
                "bg-text"
            ],
            answer: 0
        },
        {
            question: "Which property makes text bold?",
            options: [
                "font-weight",
                "text-decoration",
                "font-size",
                "font-family"
            ],
            answer: 0
        }
    ],

    JavaScript: [
        {
            question: "Which keyword declares a variable?",
            options: ["int", "var", "string", "define"],
            answer: 1
        },
        {
            question: "Which method displays an alert box?",
            options: [
                "alert()",
                "display()",
                "message()",
                "show()"
            ],
            answer: 0
        },
        {
            question: "Which symbol is used for comments in JavaScript?",
            options: ["##", "<!--", "//", "**"],
            answer: 2
        },
        {
            question: "Which method selects an element by ID?",
            options: [
                "getElementById()",
                "getClass()",
                "selectId()",
                "findElement()"
            ],
            answer: 0
        },
        {
            question: "Which keyword declares a constant?",
            options: ["let", "var", "const", "constant"],
            answer: 2
        }
    ]
};


/* =================================
   PAGE NAVIGATION
================================= */

function showPage(pageId) {

    const pages = [
        "login",
        "welcome",
        "dashboard",
        "quiz",
        "result"
    ];

    pages.forEach(function(id) {
        document.getElementById(id).classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =================================
   SIGN IN FUNCTION
================================= */

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const password = document.getElementById("password").value;
        const error = document.getElementById("loginError");

        if (name === "" || password.trim() === "") {
            error.textContent = "Please enter your name and password.";
            return;
        }

        if (password.length < 4) {
            error.textContent = "Password must contain at least 4 characters.";
            return;
        }

        studentName = name;

        error.textContent = "";

        document.getElementById("student").textContent = studentName;

        showPage("welcome");
    }
);


/* =================================
   LIGHT MODE AND DARK MODE
================================= */

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    const button = document.getElementById("themeToggle");

    if (isDark) {
        button.textContent = "☀️ Light Mode";
        localStorage.setItem("quizNovaTheme", "dark");
    } else {
        button.textContent = "🌙 Dark Mode";
        localStorage.setItem("quizNovaTheme", "light");
    }
}


// Restore saved theme
function loadTheme() {

    const savedTheme = localStorage.getItem("quizNovaTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("themeToggle").textContent =
            "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        document.getElementById("themeToggle").textContent =
            "🌙 Dark Mode";
    }
}


/* =================================
   DASHBOARD
================================= */

function showDashboard() {

    showPage("dashboard");

    document.getElementById("student").textContent = studentName;

    updateDashboard();
    displaySubjects();
}


function displaySubjects() {

    const subjects = document.getElementById("subjects");

    subjects.innerHTML = "";

    Object.keys(quizData).forEach(function(subject) {

        const card = document.createElement("div");
        card.className = "subject-card";

        const heading = document.createElement("h3");
        heading.textContent = subject;

        const description = document.createElement("p");
        description.textContent = "Test your " + subject + " knowledge.";

        const button = document.createElement("button");
        button.textContent = "Start Quiz";

        button.addEventListener("click", function() {
            startQuiz(subject);
        });

        card.appendChild(heading);
        card.appendChild(description);
        card.appendChild(button);

        subjects.appendChild(card);
    });
}


/* =================================
   START QUIZ
================================= */

function startQuiz(subject) {

    currentSubject = subject;

    // Shuffle a copy of the question list
    currentQuestions = [...quizData[subject]].sort(
        () => Math.random() - 0.5
    );

    currentQuestionIndex = 0;
    selectedAnswer = null;
    score = 0;

    document.getElementById("category").textContent =
        subject + " Quiz";

    showPage("quiz");

    displayQuestion();
}


/* =================================
   DISPLAY QUESTION
================================= */

function displayQuestion() {

    const question = currentQuestions[currentQuestionIndex];

    selectedAnswer = null;

    document.getElementById("questionNumber").textContent =
        "Question " + (currentQuestionIndex + 1) +
        " of " + currentQuestions.length;

    document.getElementById("question").textContent =
        question.question;

    document.getElementById("progressBar").style.width =
        ((currentQuestionIndex + 1) / currentQuestions.length * 100) + "%";

    const optionsDiv = document.getElementById("options");

    optionsDiv.innerHTML = "";

    question.options.forEach(function(option, index) {

        const button = document.createElement("button");

        button.className = "option";
        button.textContent = option;
        button.type = "button";

        button.addEventListener("click", function() {
            selectAnswer(index, button);
        });

        optionsDiv.appendChild(button);
    });

    const nextButton = document.getElementById("nextButton");

    nextButton.disabled = true;

    nextButton.textContent =
        currentQuestionIndex === currentQuestions.length - 1
        ? "Finish Quiz"
        : "Next Question";
}


/* =================================
   SELECT ANSWER
================================= */

function selectAnswer(index, selectedButton) {

    selectedAnswer = index;

    const buttons = document.querySelectorAll(".option");

    buttons.forEach(function(button) {
        button.classList.remove("selected");
    });

    selectedButton.classList.add("selected");

    document.getElementById("nextButton").disabled = false;
}


/* =================================
   NEXT QUESTION
================================= */

function nextQuestion() {

    if (selectedAnswer === null) {
        return;
    }

    const correctAnswer =
        currentQuestions[currentQuestionIndex].answer;

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {

        displayQuestion();

    } else {

        finishQuiz();
    }
}


/* =================================
   FINISH QUIZ
================================= */

function finishQuiz() {

    const totalQuestions = currentQuestions.length;

    const percentage = Math.round(
        (score / totalQuestions) * 100
    );

    const wrongAnswers = totalQuestions - score;

    document.getElementById("finalScore").textContent =
        "Your Score: " + percentage + "%";

    document.getElementById("correct").textContent = score;

    document.getElementById("wrong").textContent = wrongAnswers;

    let message = "";

    if (percentage === 100) {
        message = "Excellent! Perfect score. Keep it up!";
    } else if (percentage >= 70) {
        message = "Great work! You have a good understanding.";
    } else if (percentage >= 40) {
        message = "Good effort! Practice more to improve.";
    } else {
        message = "Keep learning! Review the topics and try again.";
    }

    document.getElementById("resultMessage").textContent = message;

    // Save quiz result
    const result = {
        subject: currentSubject,
        score: percentage,
        correct: score,
        total: totalQuestions,
        date: new Date().toLocaleDateString()
    };

    quizHistory.push(result);

    localStorage.setItem(
        "quizHistory",
        JSON.stringify(quizHistory)
    );

    showPage("result");
}


/* =================================
   UPDATE DASHBOARD STATISTICS
================================= */

function updateDashboard() {

    const total = quizHistory.length;

    const average = total > 0
        ? Math.round(
            quizHistory.reduce((sum, item) => sum + item.score, 0) / total
        )
        : 0;

    const best = total > 0
        ? Math.max(...quizHistory.map(item => item.score))
        : 0;

    document.getElementById("total").textContent = total;

    document.getElementById("average").textContent =
        average + "%";

    document.getElementById("best").textContent =
        best + "%";

    displayHistory();
    displayAnalysis();
}


/* =================================
   QUIZ HISTORY
================================= */

function displayHistory() {

    const historyDiv = document.getElementById("history");

    historyDiv.innerHTML = "";

    if (quizHistory.length === 0) {
        historyDiv.textContent = "No quizzes completed yet.";
        return;
    }

    [...quizHistory].reverse().forEach(function(item) {

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent =
            item.subject + " | Score: " +
            item.score + "% | Date: " + item.date;

        historyDiv.appendChild(div);
    });
}


/* =================================
   PERFORMANCE ANALYSIS
================================= */

function displayAnalysis() {

    const analysisDiv = document.getElementById("analysis");

    analysisDiv.innerHTML = "";

    if (quizHistory.length === 0) {
        analysisDiv.textContent =
            "Complete a quiz to see your performance.";
        return;
    }

    const subjects = {};

    quizHistory.forEach(function(item) {

        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }

        subjects[item.subject].push(item.score);
    });

    Object.keys(subjects).forEach(function(subject) {

        const scores = subjects[subject];

        const average = Math.round(
            scores.reduce((a, b) => a + b, 0) / scores.length
        );

        const div = document.createElement("div");

        div.className = "analysis-item";

        div.textContent =
            subject + " - Average Score: " + average + "%";

        analysisDiv.appendChild(div);
    });
}


/* =================================
   CHATBOT STUDY ASSISTANT
================================= */

function sendMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    const chatMessages = document.getElementById("chatMessages");

    // Display user message
    const userMessage = document.createElement("p");

    userMessage.className = "user-message";
    userMessage.textContent = message;

    chatMessages.appendChild(userMessage);

    // Generate chatbot response
    const response = getBotResponse(message.toLowerCase());

    const botMessage = document.createElement("p");

    botMessage.className = "bot-message";
    botMessage.textContent = response;

    chatMessages.appendChild(botMessage);

    input.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function getBotResponse(message) {

    if (message.includes("score") ||
        message.includes("improve") ||
        message.includes("better")) {

        return "To improve your score, revise your lessons daily, " +
               "practice more quizzes, understand your mistakes, " +
               "and focus on difficult topics.";
    }

    if (message.includes("study") ||
        message.includes("prepare")) {

        return "Create a simple study timetable. Study one topic " +
               "at a time, take short breaks, and test yourself regularly.";
    }

    if (message.includes("time")) {

        return "Manage your time by setting a time limit for each " +
               "question. Read questions carefully before answering.";
    }

    if (message.includes("html")) {

        return "Practice HTML tags such as headings, paragraphs, " +
               "images, links, tables and forms.";
    }

    if (message.includes("css")) {

        return "Practice CSS selectors, colors, backgrounds, " +
               "flexbox, grid and responsive design.";
    }

    if (message.includes("javascript")) {

        return "Practice JavaScript variables, functions, events, " +
               "conditions, loops and DOM manipulation.";
    }

    if (message.includes("hello") ||
        message.includes("hi")) {

        return "Hello! Welcome to QuizNova. How can I help you study today?";
    }

    if (message.includes("thank")) {

        return "You're welcome! Keep learning and do your best!";
    }

    if (message.includes("my performance") ||
        message.includes("my result")) {

        if (quizHistory.length === 0) {
            return "You have not completed any quizzes yet. " +
                   "Start a quiz to see your performance.";
        }

        const average = Math.round(
            quizHistory.reduce((sum, item) => sum + item.score, 0) /
            quizHistory.length
        );

        return "Your average quiz score is " + average +
               "%. Keep practising to improve your performance!";
    }

    return "Keep practising every day! Revise important topics, " +
           "take regular quizzes, and learn from your mistakes.";
}


/* =================================
   CHATBOT ENTER KEY
================================= */

document.getElementById("chatInput").addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }
    }
);


/* =================================
   INITIALIZE APPLICATION
================================= */

loadTheme();
updateDashboard();


/* =================================
   QUIZNOVA CALCULATOR
================================= */

function calculate(operator) {

    const num1 = document.getElementById("num1").value;
    const num2 = document.getElementById("num2").value;

    const result = document.getElementById("calcResult");

    if (num1.trim() === "" || num2.trim() === "") {
        result.textContent = "Please enter both numbers.";
        return;
    }

    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        result.textContent = "Please enter valid numbers.";
        return;
    }

    let answer;

    switch (operator) {

        case "+":
            answer = a + b;
            break;

        case "-":
            answer = a - b;
            break;

        case "*":
            answer = a * b;
            break;

        case "/":
            if (b === 0) {
                result.textContent = "Cannot divide by zero!";
                return;
            }
            answer = a / b;
            break;

        default:
            result.textContent = "Invalid operation.";
            return;
    }

    result.textContent = "Result: " + answer;
}


function clearCalculator() {

    document.getElementById("num1").value = "";
    document.getElementById("num2").value = "";

    document.getElementById("calcResult").textContent = "Result:";
}

