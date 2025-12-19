const questions = [
    {
        type: "input",
        q: "Когда день рождения Леди Гаги?",
        answer: "не ебу"
    },
    {
        type: "choice",
        q: "Когда родился самый известный зоофил?",
        a: [
            { t: "9 февраля", c: true },
            { t: "29 августа", c: false },
            { t: "1 января", c: false }
        ]
    },
    {
        type: "choice",
        q: "Ты гей (лезби)?",
        a: [
            { t: "Да", c: true },
            { t: "Нет", c: false }
        ]
    },
    {
        type: "choice",
        q: "Когда началась Великая Отечественная война?",
        a: [
            { t: "22 июня 1941 года", c: true },
            { t: "23 июля 1941 года", c: false },
            { t: "21 августа 1941 года", c: false },
            { t: "В душе не чаю", c: true }
        ]
    },
    {
        type: "input",
        q: "Твёрдое в мягкое вставляется — шарики рядом болтаются?",
        answer: "серьги"
    },
    {
        type: "input",
        q: "Беру двумя руками, сую между ногами. Пять минут потею, а потом балдею",
        answer: "велосипед"
    },
    {
        type: "input",
        q: "Тихо сзади подошёл, всунул и пошёл-пошёл",
        answer: "тапочки"
    },
    {
        type: "choice",
        q: "День рождения автора этой поеботы",
        a: [
            { t: "7 апреля", c: true },
            { t: "8 апреля", c: false },
            { t: "4 апреля", c: false }
        ]
    },
    {
        type: "any",
        q: "Сколько тебе лет?"
    },
    {
        type: "input",
        q: "Когда началось СВО (день, без месяца и года)?",
        answer: "24"
    },
    {
        type: "input",
        q: "Вы участвуете в марафоне. Вы обогнали последнего бегуна. Какое место вы заняли?",
        answer: "никакое"
    },
    {
        type: "input",
        q: "Бутылка с пробкой стоит 11 рублей. Бутылка на 10 рублей дороже пробки. Сколько стоит пробка?",
        answer: "50"
    }
];

let current = 0;
let score = 0;
let time = 10;
let timer;
let nick = "";
let locked = false;

const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const tEl = document.getElementById("timer");

const goodEnd = document.getElementById("goodEnd");
const badEnd = document.getElementById("badEnd");
const goodText = document.getElementById("goodText");
const badText = document.getElementById("badText");

/* 🔥 ВСТРЯСКА */
function shakeQuiz() {
    quiz.classList.remove("shake");
    void quiz.offsetWidth;
    quiz.classList.add("shake");
}

function start() {
    const input = document.getElementById("nick");
    nick = input.value.trim();

    if (!nick) {
        input.placeholder = "Ник обязателен!";
        input.style.border = "2px solid red";
        input.focus();
        return;
    }

    login.classList.add("hidden");
    quiz.classList.remove("hidden");
    show();
}

function show() {
    locked = false;
    result.classList.add("hidden");

    if (!questions[current]) {
        quiz.classList.add("hidden");

        const percent = score / questions.length;

        if (percent > 0.5) {
            goodEnd.classList.remove("hidden");
            goodText.textContent =
                `${nick}, поздравляем! 🎄
Правильных ответов: ${score} из ${questions.length}`;
        } else {
            badEnd.classList.remove("hidden");
            badText.textContent =
                `${nick}, ты проиграл 😬
Правильных ответов: ${score} из ${questions.length}`;
        }
        return;
    }

    const q = questions[current];

    time = 10;
    tEl.textContent = time;
    qEl.textContent = q.q;
    aEl.innerHTML = "";

    // 🔹 CHOICE
    if (q.type === "choice") {
        q.a.forEach(ans => {
            const btn = document.createElement("button");
            btn.textContent = ans.t;

            btn.onclick = () => {
                if (locked) return;
                locked = true;
                clearInterval(timer);

                if (ans.c) {
                    score++;
                    result.textContent = "ЛЯ красавец";
                } else {
                    shakeQuiz();
                    const right = q.a.find(x => x.c).t;
                    result.textContent =
                        "ой долбоеб: " + right;
                }

                result.classList.remove("hidden");

                setTimeout(() => {
                    current++;
                    show();
                }, 1200);
            };

            aEl.appendChild(btn);
        });
    }

    // 🔹 INPUT
    if (q.type === "input") {
        const input = document.createElement("input");
        input.placeholder = "Введите ответ";

        const btn = document.createElement("button");
        btn.textContent = "Ответить";

        btn.onclick = () => {
            if (locked) return;
            locked = true;
            clearInterval(timer);

            const user = input.value.trim().toLowerCase();
            const correct = q.answer.toLowerCase();

            if (user === correct) {
                score++;
                result.textContent = "ЛЯ красавец";
            } else {
                shakeQuiz();
                result.textContent =
                    "❌ Неправильно! Правильный ответ: " + q.answer;
            }

            result.classList.remove("hidden");

            setTimeout(() => {
                current++;
                show();
            }, 1200);
        };

        aEl.appendChild(input);
        aEl.appendChild(btn);
    }

    // 🔹 ANY (любой ответ)
    if (q.type === "any") {
        const input = document.createElement("input");
        input.placeholder = "Напиши что угодно";

        const btn = document.createElement("button");
        btn.textContent = "Ответить";

        btn.onclick = () => {
            if (locked) return;
            locked = true;
            clearInterval(timer);

            score++;
            result.textContent = "✅ Засчитано!";
            result.classList.remove("hidden");

            setTimeout(() => {
                current++;
                show();
            }, 1200);
        };

        aEl.appendChild(input);
        aEl.appendChild(btn);
    }

    timer = setInterval(() => {
        time--;
        tEl.textContent = time;

        if (time === 0) {
            if (locked) return;
            locked = true;
            clearInterval(timer);
            shakeQuiz();

            if (q.type === "choice") {
                const right = q.a.find(x => x.c).t;
                result.textContent =
                    "⏰ Время вышло! Правильный ответ: " + right;
            } else if (q.type === "input") {
                result.textContent =
                    "⏰ Время вышло! Правильный ответ: " + q.answer;
            } else {
                result.textContent = "⏰ Время вышло!";
            }

            result.classList.remove("hidden");

            setTimeout(() => {
                current++;
                show();
            }, 1200);
        }
    }, 1000);
}
