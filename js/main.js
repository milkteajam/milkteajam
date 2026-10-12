// ===== 标签随机颜色：红橙黄绿青蓝 =====
const tagColors = [
    'rgba(255, 82, 82, 0.75)',
    'rgba(255, 152, 0, 0.75)',
    'rgba(255, 214, 0, 0.75)',
    'rgba(76, 175, 80, 0.75)',
    'rgba(0, 188, 212, 0.75)',
    'rgba(33, 150, 243, 0.75)',
];
document.querySelectorAll('.tag').forEach(tag => {
    tag.style.background = tagColors[Math.floor(Math.random() * tagColors.length)];
});

// ===== 浏览次数计数（localStorage，同一浏览器每次打开+1）=====
let visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10);
visitCount++;
localStorage.setItem('visitCount', visitCount);

const countEl = document.querySelector('.info-count');
countEl.textContent = visitCount.toLocaleString();

// 颜色规则：<10 默认色，10~49 白色，50~99 绿色，>=100 红色
if (visitCount >= 100) {
    countEl.style.color = 'red';
} else if (visitCount >= 50) {
    countEl.style.color = 'green';
} else if (visitCount >= 10) {
    countEl.style.color = 'white';
}

// ===== 音乐播放器 =====
const musicList = [
    "music/得吃小曲.mp3",
];

const audio = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.music-progress');
const musicTitle = document.querySelector('.music-title');
const coverImg = document.querySelector('.music-cover');

let currentIndex = 0;
let currentRotateDeg = 0;

function getFileName(path) {
    return path.split('/').pop().replace(/\.[^/.]+$/, '');
}

function checkTitleScroll() {
    const wrap = musicTitle.parentElement;
    if (musicTitle.scrollWidth > wrap.clientWidth) {
        musicTitle.classList.add('scrolling');
    } else {
        musicTitle.classList.remove('scrolling');
    }
}

function loadMusic(idx) {
    const src = musicList[idx];
    coverImg.src = `images/music${String(idx).padStart(2, '0')}.png`;
    audio.src = src;
    musicTitle.textContent = getFileName(src);
    requestAnimationFrame(checkTitleScroll);
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "暂停";
        coverImg.style.animationPlayState = "running";
    } else {
        const style = getComputedStyle(coverImg);
        const matrix = new DOMMatrix(style.transform);
        currentRotateDeg = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        if (currentRotateDeg < 0) currentRotateDeg += 360;
        coverImg.style.transform = `rotate(${currentRotateDeg}deg)`;
        coverImg.style.animationPlayState = "paused";
        playBtn.textContent = "播放";
        audio.pause();
    }
});

prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = musicList.length - 1;
    loadMusic(currentIndex);
    if (!audio.paused) {
        audio.play();
        playBtn.textContent = "暂停";
        coverImg.style.animationPlayState = "running";
    }
});

nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= musicList.length) currentIndex = 0;
    loadMusic(currentIndex);
    if (!audio.paused) {
        audio.play();
        playBtn.textContent = "暂停";
        coverImg.style.animationPlayState = "running";
    }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    }
});

progressBar.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

audio.addEventListener('ended', () => nextBtn.click());

loadMusic(currentIndex);

// ===== 日历渲染 =====
(function renderCalendar() {
    const titleEl = document.querySelector('.cal-title');
    const daysEl = document.querySelector('.calendar-days');
    const prevBtn = document.querySelector('.cal-prev');
    const nextBtn = document.querySelector('.cal-next');

    const now = new Date();
    let curYear = now.getFullYear();
    let curMonth = now.getMonth(); // 0-11

    function render(year, month) {
        titleEl.textContent = `${year}年 ${month + 1}月`;
        daysEl.innerHTML = '';

        // 当月第一天是星期几（0=周日）
        const firstDay = new Date(year, month, 1).getDay();
        // 当月总天数
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // 上个月总天数
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

        // 补齐上月末尾日期
        for (let i = firstDay - 1; i >= 0; i--) {
            const cell = document.createElement('span');
            cell.className = 'cal-day other-month';
            cell.textContent = daysInPrevMonth - i;
            daysEl.appendChild(cell);
        }

        // 当月日期
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('span');
            cell.className = 'cal-day';
            cell.textContent = d;
            // 周末高亮（周六、周日）
            const weekday = new Date(year, month, d).getDay();
            if (weekday === 0 || weekday === 6) cell.classList.add('weekend');
            // 今天高亮
            if (isCurrentMonth && d === today.getDate()) cell.classList.add('today');
            daysEl.appendChild(cell);
        }

        // 补齐下月开头日期，使总格子数为 7 的倍数
        const totalCells = firstDay + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= remaining; d++) {
            const cell = document.createElement('span');
            cell.className = 'cal-day other-month';
            cell.textContent = d;
            daysEl.appendChild(cell);
        }
    }

    prevBtn.addEventListener('click', () => {
        curMonth--;
        if (curMonth < 0) { curMonth = 11; curYear--; }
        render(curYear, curMonth);
    });

    nextBtn.addEventListener('click', () => {
        curMonth++;
        if (curMonth > 11) { curMonth = 0; curYear++; }
        render(curYear, curMonth);
    });

    render(curYear, curMonth);
})();


// =========答案之书｜紫封面版 + 鼠标移出卡片自动重置书本=========
const answerList = [
    "相信你的直觉",
    "时机尚未成熟，稍作等待",
    "大可放手一试",
    "不要强求，顺其自然",
    "这件事值得坚持下去",
    "答案就在你心底",
    "不妨再等等看",
    "会有意料之外的转机",
    "保持现状就是最好选择",
    "勇敢迈出那一步",
    "不必过度担忧",
    "建议放下执念",
    "结局会超出你的期待",
    "可以向身边人求助",
    "暂时不要行动",
    "一切皆有可能",
    "好事正在向你靠近",
    "遵从本心，不必在意他人看法"
];

const answerBtn = document.querySelector('#get-answer-btn');
const answerTextEl = document.querySelector('#answer-text');
const frontPage = document.querySelector('.front-page');
const bookCard = document.querySelector('.answer-book-card');

let isAnimating = false;

// 点击翻页
answerBtn.addEventListener('click', function(){
    if(isAnimating) return;
    isAnimating = true;

    frontPage.classList.remove('flip');
    void frontPage.offsetWidth;

    const randomIdx = Math.floor(Math.random() * answerList.length);
    answerTextEl.textContent = answerList[randomIdx];

    frontPage.classList.add('flip');

    setTimeout(()=>{
        isAnimating = false;
    },1200);
});

// ✅ 鼠标离开整个游戏卡片模块，书本自动合上重置
bookCard.addEventListener('mouseleave', function(){
    frontPage.classList.remove('flip');
});


// =========进场欢迎页面逻辑=========
const splashPage = document.querySelector('.intro-splash');

splashPage.addEventListener('click', function () {
    splashPage.classList.add('slide-up');

    setTimeout(() => {
        splashPage.style.display = 'none';
    }, 2000);
});

// =========禁用右键菜单与开发者工具快捷键=========
// 拦截右键菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 拦截查看源代码 / 开发者工具相关快捷键
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return;
    }
    // Ctrl+U 查看源代码
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        return;
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C 开发者工具
    if (e.ctrlKey && e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === 'i' || k === 'j' || k === 'c') {
            e.preventDefault();
            return;
        }
    }
    // Ctrl+S 保存页面
    if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        return;
    }
});
