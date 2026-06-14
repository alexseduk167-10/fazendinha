let quests = [
    { title: "Coletar madeiras", progress: 0, goal: 20, reward: 150, completed: false },
    { title: "Coletar pedras", progress: 0, goal: 20, reward: 150, completed: false },
    { title: "Plantar trigo", progress: 0, goal: 5, reward: 100, completed: false },
    { title: "Plantar cenoura", progress: 0, goal: 5, reward: 100, completed: false },
    { title: "Plantar milho", progress: 0, goal: 5, reward: 100, completed: false },
    { title: "Colher trigo", progress: 0, goal: 5, reward: 100, completed: false },
    { title: "Colher cenoura", progress: 0, goal: 5, reward: 100, completed: false },
    { title: "Colher milho", progress: 0, goal: 5, reward: 100, completed: false },
];
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;

const keys = {};

let gold = 100;
let crops = 0;
let inventoryOpen = false;
let wheatSeeds = 5;
let carrotSeeds = 0;
let cornSeeds = 0;
let oldX = 0;
let oldY = 5;
let currentSeed = "wheat";

let day = 1;
let minutes = 360;
let wood = 0;
let stone = 0;

let axeLevel = 1;
let pickaxeLevel = 1;
let wateringCanLevel = 1;

let chickens = 0;
let cows = 0;

let barnBuilt = false;
let siloBuilt = false;
const player = {
    x: 1000,
    y: 1000,
    width: 40,
    height: 40,
    speed: 4
};

const camera = {
    x: 0,
    y: 0
};

const shop = {
    x: 400,
    y: 400,
    width: 120,
    height: 120
};
const barn = {
    x: 1500,
    y: 700,
    width: 200,
    height: 150
};

function rectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

  function drawBarn(){

    if(!barnBuilt) return;

    ctx.fillStyle = "#9b5f2d";

    ctx.fillRect(
        barn.x - camera.x,
        barn.y - camera.y,
        barn.width,
        barn.height
    );
  
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    ctx.fillText(
        "CELEIRO",
        barn.x - camera.x + 40,
        barn.y - camera.y + 80
    );
  }
function buildBarn(){

    if(barnBuilt){
        showMessage("Você já possui um celeiro");
        return;
    }

    if(wood >= 100 && stone >= 50){

        wood -= 100;
        stone -= 50;

        barnBuilt = true;

        showMessage("Celeiro construído!");

    } else {
        showMessage("Precisa de 100 madeira e 50 pedra");
    }
}

function buyChicken(){

    if(!barnBuilt){
        showMessage("Construa um celeiro primeiro");
        return;
    }

    if(gold >= 150){

        gold -= 150;
        chickens++;

        showMessage("Nova galinha!");
        updateHUD();
    }
}

function buyCow(){

    if(!barnBuilt){
        showMessage("Construa um celeiro primeiro");
        return;
    }

    if(gold >= 500){
        gold -= 500;
        cows++;
        showMessage("Nova vaca!");
        updateHUD();
    }
}

const cropsList = [];
const trees = [];
const rocks = [];

let wheatPlanted = 0;
let carrotPlanted = 0;
let cornPlanted = 0;

let wheatHarvested = 0;
let carrotHarvested = 0;
let cornHarvested = 0;

for (let i = 0; i < 80; i++) {

    trees.push({
        x: Math.random() * 1900,
        y: Math.random() * 1900,
        hp: 3
    });

}
function updateQuests() {

    quests[0].progress = wood;
    quests[1].progress = stone;

    quests[2].progress = wheatPlanted;
    quests[3].progress = carrotPlanted;
    quests[4].progress = cornPlanted;

    quests[5].progress = wheatHarvested;
    quests[6].progress = carrotHarvested;
    quests[7].progress = cornHarvested;

    for (const quest of quests) {

        if (!quest.completed &&
            quest.progress >= quest.goal) {

            quest.completed = true;

            gold += quest.reward;

            showMessage("Missão concluída: " + quest.title);

            updateHUD();
        }
    }
}
function chopTree() {

    for (let i = 0; i < trees.length; i++) {

        const tree = trees[i];

        const dist = distance(
            player.x,
            player.y,
            tree.x,
            tree.y
        );

        if (dist < 80) {

            tree.hp -= axeLevel;

         if (tree.hp <= 0) {

         trees.splice(i, 1);

          wood += 5;

          updateQuests();
          updateHUD();

         showMessage("+5 Madeira");

}

            return;
        }
    }
}
for (let i = 0; i < 50; i++) {
    rocks.push({
        x: Math.random() * 1900,
        y: Math.random() * 1900,
        hp: 3
    });
}
function mineRock() {

    for (let t = 0; t < rocks.length; t++) {

        const rock = rocks[t];

        const dist = distance(
            player.x,
            player.y,
            rock.x,
            rock.y
        );

        if (dist < 80) {

            rock.hp -= pickaxeLevel;

            if (rock.hp <= 0) {

                rocks.splice(t, 1);

                stone += 5;

                updateQuests();
                updateHUD();

                showMessage("+5 Pedra");
            }

            return;
        }
    }
}
function updateHUD() {

    document.getElementById("gold").textContent = gold;

    document.getElementById("wheatSeeds").textContent = wheatSeeds;

    document.getElementById("carrotSeeds").textContent = carrotSeeds;

    document.getElementById("cornSeeds").textContent = cornSeeds;

    document.getElementById("crops").textContent = crops;

    document.getElementById("day").textContent = day;

    document.getElementById("wood").textContent = wood;

    document.getElementById("stone").textContent = stone;

    document.getElementById("chickens").textContent = chickens;

    document.getElementById("cows").textContent = cows;

    let h = Math.floor(minutes / 60);
    let m = minutes % 60;

    let hs = String(h).padStart(2, "0");
    let ms = String(m).padStart(2, "0");

    document.getElementById("time").textContent =
        `${hs}:${ms}`;
}
function drawQuests() {

    ctx.fillStyle = "rgba(11, 9, 9, 0.19)";

    ctx.fillRect(
        canvas.width - 320,
        260,
        300,
        280
    );

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    let y = 300;

    for (const quest of quests) {

        ctx.fillText(
            quest.title +
            " (" +
            quest.progress +
            "/" +
            quest.goal +
            ")",
            canvas.width - 300,
            y
        );

        y += 30;
    }
}
function showMessage(text) {

    const box = document.getElementById("mensagem");

    box.style.display = "block";

    box.textContent = text;

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {

        box.style.display = "none";

    }, 2500);
}

function distance(x1, y1, x2, y2) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    keys[key] = true;

    if (key === "1") {
        currentSeed = "wheat";
        showMessage("Selecionado: Trigo");
    }

    if (key === "2") {
        currentSeed = "carrot";
        showMessage("Selecionado: Cenoura");
    }

    if (key === "3") {
        currentSeed = "corn";
        showMessage("Selecionado: Milho");
    }

    if (key === "e") {
        buySeed();
    }

    if (e.code === "Space") {
        plantSeed();
    }

    if (key === "f") {
        harvestCrop();
    }

    if (key === "r") {
        chopTree();
    }

    if (key === "g") {
        buyChicken();
    }

    if (key === "v") {
        buyCow();
    }

    if (key === "t") {
        mineRock();
    }

    if (key === "b") {
        buildBarn();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function updatePlayer() {

    oldX = player.x;
    oldY = player.y;
    if (keys["w"]) player.y -= player.speed;

    if (keys["s"]) player.y += player.speed;

    if (keys["a"]) player.x -= player.speed;

    if (keys["d"]) player.x += player.speed;

    if (rectCollision(player, shop)) {

        player.x = oldX;
        player.y = oldY;

    }

    if (barnBuilt) {

        if (rectCollision(player, barn)) {

            player.x = oldX;
            player.y = oldY;

        }

    }
    if (player.x < 0) player.x = 0;

    if (player.y < 0) player.y = 0;

    if (player.x > WORLD_WIDTH - player.width)
        player.x = WORLD_WIDTH - player.width;

    if (player.y > WORLD_HEIGHT - player.height)
        player.y = WORLD_HEIGHT - player.height;
}

function updateCamera() {

    camera.x =
        player.x - canvas.width / 2;

    camera.y =
        player.y - canvas.height / 2;

    if (camera.x < 0) camera.x = 0;
    if (camera.y < 0) camera.y = 0;

    if (camera.x > WORLD_WIDTH - canvas.width)
        camera.x = WORLD_WIDTH - canvas.width;

    if (camera.y > WORLD_HEIGHT - canvas.height)
        camera.y = WORLD_HEIGHT - canvas.height;
} function buySeed() {

    const dist = distance(
        player.x,
        player.y,
        shop.x,
        shop.y
    );

    if (dist > 180) {
        showMessage("Chegue mais perto da loja.");
        return;
    }

    if (currentSeed === "wheat") {

        if (gold >= 10) {
            gold -= 10;
            wheatSeeds++;
            showMessage("+1 Semente de Trigo");
        }
        else {
            showMessage("Ouro insuficiente");
        }

    }

    if (currentSeed === "carrot") {

        if (gold >= 25) {
            gold -= 25;
            carrotSeeds++;
            showMessage("+1 Semente de Cenoura");
        }
        else {
            showMessage("Ouro insuficiente");
        }

    }

    if (currentSeed === "corn") {

        if (gold >= 50) {
            gold -= 50;
            cornSeeds++;
            showMessage("+1 Semente de Milho");
        }
        else {
            showMessage("Ouro insuficiente");
        }

    }

    updateHUD();
}

function plantSeed() {

    const tileX =
        Math.floor(player.x / 64) * 64;

    const tileY =
        Math.floor(player.y / 64) * 64;

    for (const crop of cropsList) {

        if (
            crop.x === tileX &&
            crop.y === tileY
        ) {
            return;
        }
    }

    if (currentSeed === "wheat") {

    if (wheatSeeds <= 0) {
        showMessage("Sem sementes de trigo");
        return;
    }

    wheatSeeds--;
    wheatPlanted++; 

    cropsList.push({
        x: tileX,
        y: tileY,
        type: "wheat",
        plantedAt: Date.now(),
        growTime: 15000,
        ready: false
    });
}

if (currentSeed === "carrot") {

    if (carrotSeeds <= 0) {
        showMessage("Sem sementes de cenoura");
        return;
    }

    carrotSeeds--;
    carrotPlanted++; 

    cropsList.push({
        x: tileX,
        y: tileY,
        type: "carrot",
        plantedAt: Date.now(),
        growTime: 25000,
        ready: false
    });
}

if (currentSeed === "corn") {

    if (cornSeeds <= 0) {
        showMessage("Sem sementes de milho");
        return;
    }

    cornSeeds--;
    cornPlanted++; 

    cropsList.push({
        x: tileX,
        y: tileY,
        type: "corn",
        plantedAt: Date.now(),
        growTime: 40000,
        ready: false
    });
}
    updateHUD();
}

function updateCrops() {

    for (const crop of cropsList) {

        if (
            !crop.ready &&
            Date.now() - crop.plantedAt >= crop.growTime
        ) {
            crop.ready = true;
        }

    }
}

function harvestCrop() {

    for (let i = 0; i < cropsList.length; i++) {

        const crop = cropsList[i];

        const dist = distance(
            player.x,
            player.y,
            crop.x,
            crop.y
        );

        if (dist < 100 && crop.ready) {

            if (crop.type === "wheat") {
                gold += 20;
                crops += 1;
                wheatHarvested++;
            }

            if (crop.type === "carrot") {
                gold += 45;
                crops += 1;
                carrotHarvested++;
            }

            if (crop.type === "corn") {
                gold += 90;
                crops += 1;
                cornHarvested++;
            }

            cropsList.splice(i, 1);

            updateQuests();
            updateHUD();

            showMessage("Colheita realizada");

            return;
        }
    }

    showMessage("Nenhuma colheita pronta");
}
function drawInventory() {

    if (!inventoryOpen) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        150,
        100,
        500,
        350
    );

    ctx.fillStyle = "white";

    ctx.font =
        "24px Arial";

    ctx.fillText(
        "INVENTÁRIO",
        300,
        140
    );

    ctx.fillText(
        "🌱 Trigo: " + wheatSeeds,
        180,
        200
    );

    ctx.fillText(
        "🥕 Cenoura: " + carrotSeeds,
        180,
        240
    );

    ctx.fillText(
        "🌽 Milho: " + cornSeeds,
        180,
        280
    );

    ctx.fillText(
        "🪵 Madeira: " + wood,
        180,
        320
    );

    ctx.fillText(
        "🪨 Pedra: " + stone,
        180,
        360
    );

}
function drawWorld() {

    ctx.fillStyle = "#5fae4b";

    ctx.fillRect(
        -camera.x,
        -camera.y,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    ctx.strokeStyle = "#4a9344";

    for (let x = 0; x < WORLD_WIDTH; x += 64) {

        ctx.beginPath();

        ctx.moveTo(
            x - camera.x,
            -camera.y
        );

        ctx.lineTo(
            x - camera.x,
            WORLD_HEIGHT - camera.y
        );

        ctx.stroke();
    }

    for (let y = 0; y < WORLD_HEIGHT; y += 64) {

        ctx.beginPath();

        ctx.moveTo(
            -camera.x,
            y - camera.y
        );

        ctx.lineTo(
            WORLD_WIDTH - camera.x,
            y - camera.y
        );

        ctx.stroke();
    }
}

function drawShop() {

    ctx.fillStyle = "#7a4f24";

    ctx.fillRect(
        shop.x - camera.x,
        shop.y - camera.y,
        shop.width,
        shop.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "20px Arial";

    ctx.fillText(
        "LOJA",
        shop.x - camera.x + 25,
        shop.y - camera.y + 65
    );
}

function drawCrops() {

    for (const crop of cropsList) {

        if (crop.type === "wheat") {

            ctx.fillStyle =
                crop.ready ? "#ffd700" : "#b88f3a";
        }

        if (crop.type === "carrot") {

            ctx.fillStyle =
                crop.ready ? "#ff7f00" : "#a35b00";
        }

        if (crop.type === "corn") {

            ctx.fillStyle =
                crop.ready ? "#ffff55" : "#999933";
        }

        ctx.fillRect(
            crop.x - camera.x,
            crop.y - camera.y,
            50,
            50
        );
    }
} function drawPlayer() {

    ctx.fillStyle = "#2563eb";

    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );

    ctx.fillStyle = "white";

    ctx.fillRect(
        player.x - camera.x + 10,
        player.y - camera.y + 8,
        6,
        6
    );

    ctx.fillRect(
        player.x - camera.x + 24,
        player.y - camera.y + 8,
        6,
        6
    );
}

function drawSelectedSeed() {

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";

    let nome = "Trigo";

    if (currentSeed === "carrot") {
        nome = "Cenoura";
    }

    if (currentSeed === "corn") {
        nome = "Milho";
    }

   const texto = "Semente Selecionada: " + nome;

ctx.fillText(
    "Semente Selecionada: " + nome,
    canvas.width / 2 - 120,
    canvas.height - 30
);
}

function drawShopHint() {

    const dist = distance(
        player.x,
        player.y,
        shop.x,
        shop.y
    );

    if (dist < 180) {

        ctx.fillStyle = "white";

        ctx.font = "12px Arial";

        ctx.fillText(
    "Pressione E para comprar sementes",
    canvas.width - 210,
    230
);
        
    }
}

function updateClock() {

    minutes += 1;

    if (minutes >= 1440) {

        minutes = 360;

        day++;

        showMessage(
            "Dia " + day + " começou"
        );
    }

    updateHUD();
}

function drawMiniMap() {

    const mapX = canvas.width - 210;
    const mapY = 10;

    const mapW = 200;
    const mapH = 200;

    ctx.fillStyle = "rgba(0,0,0,0.7)";

    ctx.fillRect(
        mapX,
        mapY,
        mapW,
        mapH
    );

    ctx.fillStyle = "green";

    ctx.fillRect(
        mapX,
        mapY,
        mapW,
        mapH
    );

    ctx.fillStyle = "brown";

    ctx.fillRect(
        mapX + (shop.x / WORLD_WIDTH) * mapW,
        mapY + (shop.y / WORLD_HEIGHT) * mapH,
        10,
        10
    );

    ctx.fillStyle = "blue";

    ctx.fillRect(
        mapX + (player.x / WORLD_WIDTH) * mapW,
        mapY + (player.y / WORLD_HEIGHT) * mapH,
        8,
        8
    );
}
function drawTrees() {
    for (const tree of trees) {

        const treeBox = {

            x: tree.x,
            y: tree.y,
            width: 40,
            height: 40

        };

        if (rectCollision(player, treeBox)) {

            player.x = oldX;
            player.y = oldY;

        }

    }
    for (const tree of trees) {

        ctx.fillStyle = "#654321";

        ctx.fillRect(
            tree.x - camera.x + 12,
            tree.y - camera.y + 20,
            16,
            25
        );

        ctx.fillStyle = "darkgreen";

        ctx.beginPath();

        ctx.arc(
            tree.x - camera.x + 20,
            tree.y - camera.y,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

function drawRocks() {

    for (const rock of rocks) {

        const rockBox = {
            x: rock.x,
            y: rock.y,
            width: 30,
            height: 30
        };

        if (rectCollision(player, rockBox)) {
            player.x = oldX;
            player.y = oldY;
        }

        ctx.fillStyle = "gray";

        ctx.fillRect(
            rock.x - camera.x,
            rock.y - camera.y,
            30,
            30
        );
    }
}

function drawHouse() {

    ctx.fillStyle = "#8B4513";

    ctx.fillRect(
        1200 - camera.x,
        900 - camera.y,
        160,
        120
    );

    ctx.fillStyle = "#AA0000";

    ctx.beginPath();

    ctx.moveTo(
        1180 - camera.x,
        900 - camera.y
    );

    ctx.lineTo(
        1280 - camera.x,
        820 - camera.y
    );

    ctx.lineTo(
        1380 - camera.x,
        900 - camera.y
    );

    ctx.fill();
}
function gameLoop() {

    updatePlayer();

    drawInventory();

    updateCamera();

    updateCrops();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawWorld();

    drawTrees();

    drawBarn();

    drawRocks();

    drawHouse();

    drawShop();

    drawCrops();

    drawPlayer();

    drawSelectedSeed();

    drawShopHint();

    drawMiniMap();

    drawQuests();

    requestAnimationFrame(
        gameLoop
    );
}

setInterval(() => {

    updateClock();

}, 1000);

updateHUD();

showMessage(
    "Bem-vindo à fazenda!"
);

gameLoop();
function saveGame() {

    const save = {

        gold,
        crops,
        wheatSeeds,
        carrotSeeds,
        cornSeeds,
        day,
        minutes,
        playerX: player.x,
        playerY: player.y

    };

    localStorage.setItem(
        "fazendaSave",
        JSON.stringify(save)
    );
}

function loadGame() {

    const save =
        localStorage.getItem(
            "fazendaSave"
        );

    if (!save) return;

    const data =
        JSON.parse(save);

    gold = data.gold;
    crops = data.crops;

    wheatSeeds = data.wheatSeeds;
    carrotSeeds = data.carrotSeeds;
    cornSeeds = data.cornSeeds;

    day = data.day;
    minutes = data.minutes;

    player.x = data.playerX;
    player.y = data.playerY;

    updateHUD();
}

loadGame();

setInterval(
    saveGame,
    5000
);
console.log("SCRIPT CARREGOU");