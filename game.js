// Основные переменные игры
let clicks = 0;
let totalClicks = 0;
let clickPower = 1;
let cps = 0;
let currentBackground = 0;
let rouletteSpins = 0;
let achievementsEarned = 0;
let clickers = 0;
let clickersBoost = 0;
let maxClicks = 50000;
let inventoryUpgrades = 1;
let activeSkin = null;
let currentTheme = 'light';

// Система сохранения
const saveGame = () => {
    const gameData = {
        clicks,
        totalClicks,
        clickPower,
        cps,
        currentBackground,
        rouletteSpins,
        achievementsEarned,
        clickers,
        clickersBoost,
        maxClicks,
        inventoryUpgrades,
        activeSkin,
        currentTheme,
        clickUpgrades: {},
        autoClickers: {},
        skins: {},
        achievements: {}
    };

    // Сохраняем улучшения
    for (const key in clickUpgrades) {
        gameData.clickUpgrades[key] = {
            owned: clickUpgrades[key].owned,
            cost: clickUpgrades[key].cost
        };
    }

    for (const key in autoClickers) {
        gameData.autoClickers[key] = {
            owned: autoClickers[key].owned,
            cost: autoClickers[key].cost
        };
    }

    // Сохраняем скины
    for (const key in skins) {
        gameData.skins[key] = {
            owned: skins[key].owned
        };
    }

    // Сохраняем достижения
    for (const key in achievements) {
        gameData.achievements[key] = {
            earned: achievements[key].earned
        };
    }

    localStorage.setItem('clickerSave', JSON.stringify(gameData));
};

const loadGame = () => {
    const savedData = localStorage.getItem('clickerSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        
        // Загружаем основные данные
        clicks = gameData.clicks || 0;
        totalClicks = gameData.totalClicks || 0;
        clickPower = gameData.clickPower || 1;
        cps = gameData.cps || 0;
        currentBackground = gameData.currentBackground || 0;
        rouletteSpins = gameData.rouletteSpins || 0;
        achievementsEarned = gameData.achievementsEarned || 0;
        clickers = gameData.clickers || 0;
        clickersBoost = gameData.clickersBoost || 0;
        maxClicks = gameData.maxClicks || 50000;
        inventoryUpgrades = gameData.inventoryUpgrades || 1;
        activeSkin = gameData.activeSkin || null;
        currentTheme = gameData.currentTheme || 'light';

        // Загружаем улучшения
        if (gameData.clickUpgrades) {
            for (const key in gameData.clickUpgrades) {
                if (clickUpgrades[key]) {
                    clickUpgrades[key].owned = gameData.clickUpgrades[key].owned || 0;
                    clickUpgrades[key].cost = gameData.clickUpgrades[key].cost || clickUpgrades[key].baseCost;
                }
            }
        }
        
        if (gameData.autoClickers) {
            for (const key in gameData.autoClickers) {
                if (autoClickers[key]) {
                    autoClickers[key].owned = gameData.autoClickers[key].owned || 0;
                    autoClickers[key].cost = gameData.autoClickers[key].cost || autoClickers[key].baseCost;
                }
            }
        }
        
        // Загружаем скины
        if (gameData.skins) {
            for (const key in gameData.skins) {
                if (skins[key]) {
                    skins[key].owned = gameData.skins[key].owned || false;
                    if (gameData.activeSkin && gameData.activeSkin.id == key) {
                        activeSkin = skins[key];
                    }
                }
            }
        }
        
        // Загружаем достижения
        if (gameData.achievements) {
            for (const key in gameData.achievements) {
                if (achievements[key]) {
                    achievements[key].earned = gameData.achievements[key].earned || false;
                    if (achievements[key].earned) {
                        achievements[key].effect();
                    }
                }
            }
        }
        
        // Применяем тему
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${currentTheme}-theme`);
        
        // Обновляем фон
        updateBackground(currentBackground);
    }
};

// Фоны
const backgrounds = [
    { cost: 0, image: 'https://via.placeholder.com/1920x1080/f0f0f0/cccccc?text=Стандартный+фон' },
    { cost: 100000, image: 'background1.jpg' },
    { cost: 250000, image: 'background2.jpg' },
    { cost: 500000, image: 'background3.jpg' },
    { cost: 1000000, image: 'background4.jpg' },
    { cost: 2500000, image: 'background5.jpg' },
    { cost: 5000000, image: 'background6.jpg' },
    { cost: 10000000, image: 'background7.jpg' },
    { cost: 25000000, image: 'background8.jpg' },
    { cost: 50000000, image: 'background9.jpg' },
    { cost: 100000000, image: 'background10.jpg' }
];

// Цвета текста
const textColors = [
    { name: "Стандартный", color: "#333", cost: 0 },
    { name: "Красный", color: "#F44336", cost: 50000 },
    { name: "Синий", color: "#2196F3", cost: 50000 },
    { name: "Зеленый", color: "#4CAF50", cost: 50000 },
    { name: "Фиолетовый", color: "#9C27B0", cost: 100000 },
    { name: "Оранжевый", color: "#FF9800", cost: 100000 },
    { name: "Золотой", color: "#FFD700", cost: 500000 },
    { name: "Радужный", color: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)", cost: 1000000 }
];

// Цвета интерфейса
const uiColors = [
    { name: "Стандартный", color: "#4CAF50", cost: 0 },
    { name: "Синий", color: "#2196F3", cost: 100000 },
    { name: "Красный", color: "#F44336", cost: 100000 },
    { name: "Фиолетовый", color: "#9C27B0", cost: 250000 },
    { name: "Золотой", color: "#FFD700", cost: 500000 }
];

// Улучшения кликов
const clickUpgrades = {
    1: { name: "Улучшенный палец", power: 1, baseCost: 50, cost: 50, owned: 0, description: "Увеличивает силу клика на 1" },
    2: { name: "Золотой палец", power: 5, baseCost: 250, cost: 250, owned: 0, description: "Увеличивает силу клика на 5" },
    3: { name: "Платиновый палец", power: 20, baseCost: 1000, cost: 1000, owned: 0, description: "Увеличивает силу клика на 20" },
    4: { name: "Алмазный палец", power: 50, baseCost: 5000, cost: 5000, owned: 0, description: "Увеличивает силу клика на 50" },
    5: { name: "Легендарный палец", power: 100, baseCost: 25000, cost: 25000, owned: 0, description: "Увеличивает силу клика на 100" }
};

// Автокликеры
const autoClickers = {
    1: { name: "Автокликер", power: 1, baseCost: 50, cost: 50, owned: 0, description: "Добавляет 1 клик/сек" },
    2: { name: "Жирный кликер", power: 5, baseCost: 250, cost: 250, owned: 0, description: "Добавляет 5 клик/сек" },
    3: { name: "Хуй большой кликер", power: 20, baseCost: 1000, cost: 1000, owned: 0, description: "Добавляет 20 клик/сек" },
    4: { name: "Ультра мега кликер", power: 50, baseCost: 5000, cost: 5000, owned: 0, description: "Добавляет 50 клик/сек" },
    5: { name: "Гей кликер", power: 300, baseCost: 25000, cost: 25000, owned: 0, description: "Добавляет 300 клик/сек" },
    6: { name: "Теракт кликер", power: 1500, baseCost: 100000, cost: 100000, owned: 0, description: "Добавляет 1,500 клик/сек" },
    7: { name: "Пидор кликер", power: 7500, baseCost: 500000, cost: 500000, owned: 0, description: "Добавляет 7,500 клик/сек" },
    8: { name: "Родной кликер", power: 30000, baseCost: 2500000, cost: 2500000, owned: 0, description: "Добавляет 30,000 клик/сек" },
    9: { name: "Семья кликер", power: 150000, baseCost: 10000000, cost: 10000000, owned: 0, description: "Добавляет 150,000 клик/сек" },
    10: { name: "Динаху кликер", power: 750000, baseCost: 50000000, cost: 50000000, owned: 0, description: "Добавляет 750,000 клик/сек" }
};

// Скины для кнопки
const skins = {
    1: {
        id: 1,
        name: "Золотой клик",
        cost: 20000,
        owned: false,
        description: "+50 CPS каждые 200 кликов",
        image: "skin1.jpg",
        effect: function() {
            if(clicks % 200 === 0 && clicks > 0) {
                cps += 50;
                updateDisplay();
            }
        }
    },
    2: {
        id: 2,
        name: "Ракета кликов",
        cost: 100000,
        owned: false,
        description: "Раз в 5 минут: 1,000-100,000 кликов",
        image: "skin2.jpg",
        effect: function() {
            if(Date.now() - (this.lastEffectTime || 0) > 300000) { // 5 минут
                this.lastEffectTime = Date.now();
                const bonus = Math.floor(Math.random() * 99000) + 1000;
                clicks = Math.min(clicks + bonus, maxClicks);
                showBonusPopup(`+${formatNumber(bonus)} кликов от Ракеты!`);
            }
        }
    },
    3: {
        id: 3,
        name: "Лихорадка кликов",
        cost: 5000000,
        owned: false,
        description: "Раз в 15 минут: 30 сек ×5 кликов, потом ×0.2",
        image: "skin3.jpg",
        effect: function() {
            if(!this.active && Date.now() - (this.lastEffectTime || 0) > 900000) { // 15 минут
                this.lastEffectTime = Date.now();
                this.active = true;
                const originalPower = clickPower;
                clickPower *= 5;
                showBonusPopup("Лихорадка кликов! ×5 силы на 30 сек!");
                
                setTimeout(() => {
                    clickPower = Math.floor(originalPower * 0.2);
                    showBonusPopup("Усталость... ×0.2 силы");
                    
                    setTimeout(() => {
                        clickPower = originalPower;
                        this.active = false;
                        showBonusPopup("Сила кликов восстановилась");
                    }, 30000);
                }, 30000);
            }
        }
    },
    4: {
        id: 4,
        name: "Кликерсный буст",
        cost: 25000000,
        owned: false,
        description: "+0.05x к бусту Кликерсов",
        image: "skin4.jpg",
        effect: function() {
            // Эффект применяется при расчете буста
        }
    },
    5: {
        id: 5,
        name: "Легендарный кликер",
        cost: 100000000,
        owned: false,
        description: "Все автокликеры ×1.5",
        image: "skin5.jpg",
        effect: function() {
            // Эффект применяется при расчете автокликеров
        }
    }
};

// Достижения
const achievements = {
    1: { 
        name: "Первые шаги", 
        description: "Сделать 100 кликов", 
        condition: () => totalClicks >= 100,
        reward: "+10% к силе клика",
        earned: false,
        effect: () => { clickPower = Math.floor(clickPower * 1.1); }
    },
    2: { 
        name: "Тысячник", 
        description: "Сделать 1,000 кликов", 
        condition: () => totalClicks >= 1000,
        reward: "+20% к силе клика",
        earned: false,
        effect: () => { clickPower = Math.floor(clickPower * 1.2); }
    },
    3: { 
        name: "Автоматизация", 
        description: "Купить первое улучшение", 
        condition: () => Object.values(autoClickers).some(upgrade => upgrade.owned > 0) || 
                         Object.values(clickUpgrades).some(upgrade => upgrade.owned > 0),
        reward: "+5 ко всем автокликерам",
        earned: false,
        effect: () => { 
            for (const key in autoClickers) {
                autoClickers[key].power += 5;
            }
        }
    },
    4: { 
        name: "Богач", 
        description: "Накопить 50,000 кликов", 
        condition: () => clicks >= 50000,
        reward: "Разблокирует рулетку",
        earned: false,
        effect: () => {}
    },
    5: { 
        name: "Скорострел", 
        description: "Достичь 1,000 кликов в секунду", 
        condition: () => cps >= 1000,
        reward: "+50% к скорости автокликеров",
        earned: false,
        effect: () => { 
            for (const key in autoClickers) {
                autoClickers[key].power = Math.floor(autoClickers[key].power * 1.5);
            }
        }
    },
    6: { 
        name: "Коллекционер", 
        description: "Купить 3 скина", 
        condition: () => Object.values(skins).filter(skin => skin.owned).length >= 3,
        reward: "+1 к силе всех кликов",
        earned: false,
        effect: () => { 
            clickPower += 1;
            for (const key in clickUpgrades) {
                clickUpgrades[key].power += 1;
            }
        }
    },
    7: { 
        name: "Азартный", 
        description: "Сыграть в рулетку 10 раз", 
        condition: () => rouletteSpins >= 10,
        reward: "+10% шанс на победу в рулетке",
        earned: false,
        effect: () => {}
    }
};

// Рулетка
const rouletteTypes = {
    normal: { 
        name: "Обычная",
        cost: 50000, 
        cooldown: 180000, // 3 минуты
        onCooldown: false,
        outcomes: [
            { multiplier: 0, chance: 30 },
            { multiplier: 1.5, chance: 50 },
            { multiplier: 3, chance: 15 },
            { multiplier: 5, chance: 5 }
        ]
    },
    epic: { 
        name: "Эпическая",
        cost: 250000, 
        cooldown: 180000,
        onCooldown: false,
        outcomes: [
            { multiplier: 0, chance: 25 },
            { multiplier: 1.5, chance: 50 },
            { multiplier: 3, chance: 20 },
            { multiplier: 5, chance: 5 }
        ]
    },
    legendary: { 
        name: "Легендарная",
        cost: 1000000, 
        cooldown: 180000,
        onCooldown: false,
        outcomes: [
            { multiplier: 0, chance: 20 },
            { multiplier: 1.5, chance: 45 },
            { multiplier: 3, chance: 25 },
            { multiplier: 5, chance: 10 }
        ]
    }
};

// Элементы DOM
const clickerButton = document.getElementById('main-clicker');
const counterDisplay = document.getElementById('counter');
const cpsDisplay = document.querySelector('.cps');
const totalClicksDisplay = document.getElementById('total-clicks');
const totalUpgradesDisplay = document.getElementById('total-upgrades');
const clickPowerDisplay = document.getElementById('click-power');
const achievementsEarnedDisplay = document.getElementById('achievements-earned');
const achievementsTotalDisplay = document.getElementById('achievements-total');
const rouletteSpinsDisplay = document.getElementById('roulette-spins');
const clickersAmountDisplay = document.getElementById('clickers-amount');
const clickersBoostDisplay = document.getElementById('clickers-boost');
const maxClicksDisplay = document.getElementById('max-clicks');
const activeSkinDisplay = document.getElementById('active-skin');

// Инициализация игры
const initGame = () => {
    loadGame();
    renderClickUpgrades();
    renderAutoUpgrades();
    renderAchievements();
    renderBackgroundOptions();
    renderTextColors();
    renderUIColors();
    renderSkins();
    updateDisplay();
    
    // Автокликеры
    setInterval(gameTick, 1000);
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGame, 10000);
};

// Игровой цикл
const gameTick = () => {
    // Проверяем активные эффекты скинов
    if(activeSkin && activeSkin.effect) {
        activeSkin.effect();
    }
    
    // Стандартные автокликеры
    let totalAutoClicks = 0;
    for (const key in autoClickers) {
        totalAutoClicks += autoClickers[key].power * autoClickers[key].owned;
    }
    
    // Применяем буст от Кликерсов
    clickersBoost = clickers * 0.1;
    if(activeSkin && activeSkin.id === 4) {
        clickersBoost += clickers * 0.05;
    }
    
    // Применяем буст от Легендарного кликера
    if(activeSkin && activeSkin.id === 5) {
        totalAutoClicks *= 1.5;
    }
    
    totalAutoClicks *= (1 + clickersBoost);
    clicks = Math.min(clicks + totalAutoClicks, maxClicks);
    totalClicks += totalAutoClicks;
    cps = totalAutoClicks;
    
    checkAchievements();
    updateDisplay();
};

// Обработчик клика
clickerButton.addEventListener('click', function() {
    clicks += clickPower;
    totalClicks += clickPower;
    checkClickLimit();
    checkAchievements();
    updateDisplay();
});

// Покупка улучшения клика
const buyClickUpgrade = (upgradeId) => {
    const upgrade = clickUpgrades[upgradeId];
    if (clicks >= upgrade.cost) {
        clicks -= upgrade.cost;
        upgrade.owned += 1;
        clickPower += upgrade.power;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateDisplay();
        renderClickUpgrades();
        checkAchievements();
        saveGame();
    }
};

// Покупка автокликера
const buyAutoUpgrade = (upgradeId) => {
    const upgrade = autoClickers[upgradeId];
    if (clicks >= upgrade.cost) {
        clicks -= upgrade.cost;
        upgrade.owned += 1;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateDisplay();
        renderAutoUpgrades();
        checkAchievements();
        saveGame();
    }
};

// Обмен на Кликерсы
const convertToClickers = () => {
    if (clicks >= 100000000) {
        clicks -= 100000000;
        clickers++;
        updateDisplay();
        saveGame();
    } else {
        alert("Недостаточно кликов! Нужно 100,000,000");
    }
};

// Покупка скина
const buySkin = (skinId) => {
    const skin = skins[skinId];
    if (!skin.owned && clicks >= skin.cost) {
        clicks -= skin.cost;
        skin.owned = true;
        activeSkin = skin;
        updateDisplay();
        renderSkins();
        checkAchievements();
        saveGame();
        
        // Применяем скин к кнопке
        if (skin.image) {
            clickerButton.style.backgroundImage = `url('${skin.image}')`;
        }
    }
};

// Улучшение инвентаря
const upgradeInventory = () => {
    const cost = inventoryUpgrades * 50000;
    if (clicks >= cost) {
        clicks -= cost;
        maxClicks += 50000;
        inventoryUpgrades++;
        updateDisplay();
        saveGame();
    }
};

// Проверка лимита кликов
const checkClickLimit = () => {
    if (clicks > maxClicks) {
        clicks = maxClicks;
    }
};

// Рулетка
const spinRoulette = (type) => {
    const roulette = rouletteTypes[type];
    if (clicks >= roulette.cost && !roulette.onCooldown) {
        clicks -= roulette.cost;
        rouletteSpins++;
        
        // Анимация вращения
        const rouletteResult = document.getElementById('roulette-result');
        rouletteResult.textContent = "Крутим...";
        rouletteResult.style.color = "#2196F3";
        
        const spinDuration = 2000; // 2 секунды анимации
        const startTime = Date.now();
        
        const spinInterval = setInterval(() => {
            const randomOutcome = getRandomOutcome(roulette.outcomes);
            rouletteResult.textContent = `Возможно: ${randomOutcome.multiplier}x`;
        }, 100);
        
        setTimeout(() => {
            clearInterval(spinInterval);
            
            // Учитываем достижение для увеличения шансов
            const achievementBonus = achievements[7].earned ? 10 : 0;
            const adjustedOutcomes = roulette.outcomes.map(outcome => {
                if (outcome.multiplier > 0) {
                    return { ...outcome, chance: outcome.chance + achievementBonus };
                }
                return outcome;
            });
            
            const result = getRandomOutcome(adjustedOutcomes);
            applyRouletteResult(result.multiplier, type);
            
            // Включаем КД
            roulette.onCooldown = true;
            startCooldownTimer(type);
            
            saveGame();
        }, spinDuration);
    }
};

const getRandomOutcome = (outcomes) => {
    const total = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0);
    let random = Math.random() * total;
    
    for (const outcome of outcomes) {
        if (random < outcome.chance) {
            return outcome;
        }
        random -= outcome.chance;
    }
    
    return outcomes[0];
};

const applyRouletteResult = (multiplier, type) => {
    const rouletteResult = document.getElementById('roulette-result');
    let rewardText = "";
    let rewardColor = "";
    
    if (multiplier === 0) {
        rewardText = "Ничего не выиграно";
        rewardColor = "#F44336";
    } else {
        const base = rouletteTypes[type].cost;
        const reward = Math.floor(base * multiplier);
        clicks += reward;
        rewardText = `Выиграно: ${formatNumber(reward)} кликов (${multiplier}x)`;
        rewardColor = "#4CAF50";
        showBonusPopup(`+${formatNumber(reward)} кликов!`);
    }
    
    rouletteResult.textContent = rewardText;
    rouletteResult.style.color = rewardColor;
    checkClickLimit();
    updateDisplay();
};

const startCooldownTimer = (type) => {
    const roulette = rouletteTypes[type];
    const cooldownElement = document.getElementById(`${type}-cooldown`);
    const button = document.getElementById(`${type}-roulette`);
    
    button.disabled = true;
    cooldownElement.innerHTML = '<div class="cooldown-progress"></div>';
    const progress = cooldownElement.querySelector('.cooldown-progress');
    
    let remaining = roulette.cooldown;
    const interval = setInterval(() => {
        remaining -= 100;
        const percent = (remaining / roulette.cooldown) * 100;
        progress.style.width = `${percent}%`;
        
        if (remaining <= 0) {
            clearInterval(interval);
            roulette.onCooldown = false;
            button.disabled = false;
            cooldownElement.innerHTML = '';
        }
    }, 100);
};

// Смена фона
const changeBackground = (bgId) => {
    const bg = backgrounds[bgId];
    if (clicks >= bg.cost && currentBackground !== bgId) {
        if (currentBackground !== 0 || bgId === 0) {
            clicks -= bg.cost;
        }
        currentBackground = bgId;
        updateBackground(bgId);
        updateDisplay();
        saveGame();
    }
};

const updateBackground = (bgId) => {
    document.body.style.backgroundImage = `url('${backgrounds[bgId].image}')`;
};

// Смена цвета текста
const changeTextColor = (colorIndex) => {
    const color = textColors[colorIndex];
    if (clicks >= color.cost) {
        clicks -= color.cost;
        document.body.style.color = color.color;
        updateDisplay();
        saveGame();
    }
};

// Смена цвета интерфейса
const changeUIColor = (colorIndex) => {
    const color = uiColors[colorIndex];
    if (clicks >= color.cost) {
        clicks -= color.cost;
        // Здесь нужно применить цвет к интерфейсу
        // Например, изменить цвет кнопок, границ и т.д.
        updateDisplay();
        saveGame();
    }
};

// Переключение темы
const toggleTheme = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${currentTheme}-theme`);
    saveGame();
};

// Проверка достижений
const checkAchievements = () => {
    let earnedCount = 0;
    for (const key in achievements) {
        if (!achievements[key].earned && achievements[key].condition()) {
            achievements[key].earned = true;
            achievements[key].effect();
            achievementsEarned++;
            earnedCount++;
            showAchievementPopup(achievements[key].name);
        }
    }
    
    if (earnedCount > 0) {
        renderAchievements();
    }
};

// Всплывающие уведомления
const showAchievementPopup = (name) => {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.textContent = `Достижение получено: ${name}!`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
};

const showBonusPopup = (text) => {
    const popup = document.createElement('div');
    popup.className = 'bonus-popup';
    popup.textContent = text;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
};

// Форматирование чисел
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Обновление отображения
const updateDisplay = () => {
    counterDisplay.textContent = formatNumber(clicks) + ' кликов';
    cpsDisplay.textContent = 'Кликов в секунду: ' + formatNumber(cps);
    totalClicksDisplay.textContent = formatNumber(totalClicks);
    clickPowerDisplay.textContent = formatNumber(clickPower);
    maxClicksDisplay.textContent = formatNumber(maxClicks);
    clickersAmountDisplay.textContent = formatNumber(clickers);
    clickersBoostDisplay.textContent = (clickersBoost * 100).toFixed(1) + '%';
    rouletteSpinsDisplay.textContent = formatNumber(rouletteSpins);
    activeSkinDisplay.textContent = activeSkin ? activeSkin.name : "Нет";
    
    // Общее количество улучшений
    let totalUpgrades = 0;
    for (const key in clickUpgrades) {
        totalUpgrades += clickUpgrades[key].owned;
    }
    for (const key in autoClickers) {
        totalUpgrades += autoClickers[key].owned;
    }
    totalUpgradesDisplay.textContent = totalUpgrades;
    
    // Достижения
    achievementsEarnedDisplay.textContent = achievementsEarned;
    achievementsTotalDisplay.textContent = Object.keys(achievements).length;
    
    // Обновление кнопок рулетки
    for (const type in rouletteTypes) {
        const button = document.getElementById(`${type}-roulette`);
        if (button) {
            button.disabled = clicks < rouletteTypes[type].cost || rouletteTypes[type].onCooldown;
        }
    }
    
    // Обновление кнопки улучшения инвентаря
    const inventoryCost = inventoryUpgrades * 50000;
    document.getElementById('inventory-cost').textContent = formatNumber(inventoryCost);
    document.getElementById('current-max').textContent = formatNumber(maxClicks);
};

// Рендер улучшений кликов
const renderClickUpgrades = () => {
    const container = document.getElementById('click-upgrades');
    container.innerHTML = '';
    
    for (const key in clickUpgrades) {
        const upgrade = clickUpgrades[key];
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <div class="upgrade-title">${upgrade.name}</div>
            <div class="upgrade-power">+${upgrade.power} к клику</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">${formatNumber(upgrade.cost)} кликов</div>
            <div class="upgrade-owned">Куплено: ${upgrade.owned}</div>
        `;
        upgradeElement.onclick = () => buyClickUpgrade(key);
        upgradeElement.disabled = clicks < upgrade.cost;
        container.appendChild(upgradeElement);
    }
};

// Рендер автокликеров
const renderAutoUpgrades = () => {
    const container = document.getElementById('auto-upgrades');
    container.innerHTML = '';
    
    for (const key in autoClickers) {
        const upgrade = autoClickers[key];
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <div class="upgrade-title">${upgrade.name}</div>
            <div class="upgrade-power">+${formatNumber(upgrade.power)} клик/сек</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">${formatNumber(upgrade.cost)} кликов</div>
            <div class="upgrade-owned">Куплено: ${upgrade.owned}</div>
        `;
        upgradeElement.onclick = () => buyAutoUpgrade(key);
        upgradeElement.disabled = clicks < upgrade.cost;
        container.appendChild(upgradeElement);
    }
};

// Рендер скинов
const renderSkins = () => {
    const container = document.getElementById('skins-container');
    container.innerHTML = '';
    
    for (const key in skins) {
        const skin = skins[key];
        const skinElement = document.createElement('div');
        skinElement.className = 'skin-card';
        skinElement.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}" class="skin-image">
            <h3>${skin.name}</h3>
            <p>${skin.description}</p>
            <p>Цена: ${formatNumber(skin.cost)} кликов</p>
            <button class="skin-button" id="skin${key}-btn" ${skin.owned ? 'disabled' : ''}>
                ${skin.owned ? 'Куплено' : 'Купить'}
            </button>
        `;
        skinElement.onclick = () => buySkin(key);
        container.appendChild(skinElement);
    }
};

// Рендер фонов
const renderBackgroundOptions = () => {
    const container = document.getElementById('background-options');
    container.innerHTML = '';
    
    backgrounds.forEach((bg, index) => {
        const option = document.createElement('div');
        option.className = 'background-option';
        option.innerHTML = `
            <div class="bg-preview" style="background-image: url('${bg.image}')"></div>
            <p>${index === 0 ? 'Стандартный' : 'Фон ' + index}</p>
            <p>${index === 0 ? 'Бесплатно' : formatNumber(bg.cost) + ' кликов'}</p>
        `;
        option.onclick = () => changeBackground(index);
        option.disabled = clicks < bg.cost || currentBackground === index;
        container.appendChild(option);
    });
};

// Рендер цветов текста
const renderTextColors = () => {
    const container = document.getElementById('text-colors');
    container.innerHTML = '';
    
    textColors.forEach((color, index) => {
        const option = document.createElement('div');
        option.className = 'color-option';
        option.style.backgroundColor = color.color;
        option.title = `${color.name} - ${color.cost === 0 ? 'Бесплатно' : formatNumber(color.cost) + ' кликов'}`;
        option.onclick = () => changeTextColor(index);
        container.appendChild(option);
    });
};

// Рендер цветов интерфейса
const renderUIColors = () => {
    const container = document.getElementById('ui-colors');
    container.innerHTML = '';
    
    uiColors.forEach((color, index) => {
        const option = document.createElement('div');
        option.className = 'color-option';
        option.style.backgroundColor = color.color;
        option.title = `${color.name} - ${color.cost === 0 ? 'Бесплатно' : formatNumber(color.cost) + ' кликов'}`;
        option.onclick = () => changeUIColor(index);
        container.appendChild(option);
    });
};

// Рендер достижений
const renderAchievements = () => {
    const container = document.getElementById('achievements-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const key in achievements) {
        const achievement = achievements[key];
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.earned ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-title">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-reward">Награда: ${achievement.reward}</div>
            ${achievement.earned ? '<div class="achievement-status">Получено!</div>' : ''}
        `;
        container.appendChild(achievementElement);
    }
};

// Переключение вкладок
const openTab = (tabName) => {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // При переключении на вкладку достижений - рендерим их
    if (tabName === 'achievements') {
        renderAchievements();
    }
};

// Запуск игры при загрузке страницы
window.onload = initGame;