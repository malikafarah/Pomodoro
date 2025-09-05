const timeDisplay = document.getElementById('time-display');
const timerTitle = document.getElementById('timer-title');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroInput = document.getElementById('pomodoro-minutes');
const breakInput = document.getElementById('break-minutes');
const progressCircle = document.getElementById('progress-circle');

let timerInterval;
let isTimerRunning = false;
let isBreak = false;
let totalTime = parseInt(pomodoroInput.value) * 60;
let timeLeft = totalTime;

const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    
    const percentRemaining = (timeLeft / totalTime) * 100;
    setProgress(percentRemaining);
}

function switchMode() {
    isBreak = !isBreak;
    if (isBreak) {
        timerTitle.textContent = "Break Time!";
        totalTime = parseInt(breakInput.value) * 60;
    } else {
        timerTitle.textContent = "Pomodoro";
        totalTime = parseInt(pomodoroInput.value) * 60;
    }
    timeLeft = totalTime;
    updateDisplay();
}

function startTimer() {
    isTimerRunning = true;
    startPauseBtn.textContent = 'Pause';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            switchMode();
            startTimer(); 
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    startPauseBtn.textContent = 'Start';
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    isBreak = false;
    timerTitle.textContent = "Pomodoro";

    timeLeft = totalTime;
    updateDisplay();
}

startPauseBtn.addEventListener('click', () => {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        totalTime = (isBreak ? parseInt(breakInput.value) : parseInt(pomodoroInput.value)) * 60;
        if(timeLeft > totalTime || (!isTimerRunning && timeLeft === 0)){
            timeLeft = totalTime;
        }
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

pomodoroInput.addEventListener('change', () => {
    if (!isTimerRunning && !isBreak) {
        resetTimer();
    }
});

breakInput.addEventListener('change', () => {
    if (!isTimerRunning && isBreak) {
        totalTime = parseInt(breakInput.value) * 60;
        timeLeft = totalTime;
        updateDisplay();
    }
});


resetTimer();
