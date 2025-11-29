/* ====================================
   MULTI STAGE CONFIG
==================================== */
let currentStage = 1;
const CRATES = [
    "crate_22.png",
    "crate_23.png",
    "crate_24.png",
    "crate_25.png",
    "crate_26.png"
];

const STAGES = {
    1: {
        totalCoins: 1,
        playerStart: { r: 5, c: 1, dir: 1 },
        coins: [{ r: 4, c: 4 }],
        map: [
            [1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1],
            [1,0,0,2,0,0,1],
            [1,0,0,0,3,0,1],
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1],
        ]
    },

    // ⭐ Stage 2
    2: {  
        totalCoins: 1,
        playerStart: { r: 3, c: 1, dir: 1 },
        coins: [{ r: 1, c: 4 }],
        map: [
            [1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1],  
            [1,0,0,0,0,0,1],
            [1,1,1,0,1,1,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ]
    },

    // ⭐ Stage 3 – Twin Coins Maze
   3: {  
    totalCoins: 2,
    playerStart: { r: 5, c: 1, dir: 1 },
    coins: [
        { r: 2, c: 3 },
        { r: 2, c: 5 }
    ],
    map: [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,0,1,0,1],  // <-- กำแพง 3 ช่องตรงกลาง
        [1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1]
    ]
}

    /*
    // ⭐ Stage 4 – Forest of Crates
    4: {  
        totalCoins: 2,
        playerStart: { r: 5, c: 1, dir: 1 },
        coins: [
            { r: 3, c: 5 },
            { r: 1, c: 3 }
        ],
        map: [
            [1,1,1,1,1,1,1],
            [1,0,0,0,3,0,1],
            [1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ]
    },

    // ⭐ Stage 5 – If Logic Intro Maze
    5: {  
        totalCoins: 2,
        playerStart: { r: 5, c: 1, dir: 1 },
        coins: [
            { r: 1, c: 5 },
            { r: 4, c: 5 }
        ],
        map: [
            [1,1,1,1,1,1,1],
            [1,0,0,2,0,0,1],
            [1,0,1,1,1,0,1],
            [1,0,0,0,3,0,1],
            [1,0,0,1,0,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ]
    }
        */
};

let stageStats = {
    1: { commands: 0, runs: 0 },
    2: { commands: 0, runs: 0 },
    3: { commands: 0, runs: 0 }
};


/* ====================================
   GLOBAL CONFIG
==================================== */
const ROWS = 7;
const COLS = 7;
const TILE_SIZE = 64;
const PLAYER_SIZE = 48;  
const OFFSET = (TILE_SIZE - PLAYER_SIZE) / 2;

let board = [];
let commands = [];
let commandCount = 0;
let player = { row: 0, col: 0, dir: 1, el: null };

let score = 0;
let runCount = 0;
let totalCoins = 1;
let stageCoins = [];


/* ====================================
   LOAD STAGE
==================================== */
function loadStage(stage) {
    updateStageTitle(); 
    const cfg = STAGES[stage];

    totalCoins = cfg.totalCoins;

    // โหลด Map
    MAP.length = 0;
    cfg.map.forEach(r => MAP.push([...r]));

    // ตั้งค่าผู้เล่น
    player.row = cfg.playerStart.r;
    player.col = cfg.playerStart.c;
    player.dir = cfg.playerStart.dir;

    // ตั้งค่าตำแหน่งเหรียญ
    stageCoins = cfg.coins;

    // Reset UI
    score = 0;
    document.getElementById("score").textContent = `💰 เหรียญที่เก็บได้: 0`;

    // Render ใหม่ทั้งหมด
    initBoard();
    placePlayer();
    placeCoinsFromStage();
}


/* ====================================
   MAP (ตัวแปรว่างไว้ก่อน ถูกเขียนตอน loadStage)
==================================== */
let MAP = [];


/* ====================================
   INIT BOARD
==================================== */
function initBoard() {
    const boardEl = document.getElementById("board");
    boardEl.innerHTML = "";
    board = [];

    for (let r = 0; r < ROWS; r++) {
        const rowArr = [];

        for (let c = 0; c < COLS; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            tile.style.backgroundImage = `url('assets/ground_01.png')`;

            // ⭐ กำแพงแดงต้องใส่กลับเข้ามา
            if (MAP[r][c] === 1) {
                tile.style.backgroundImage = `url('assets/block_01.png')`;
            }

            // ⭐ crate แบบ random
            // ⭐ crate แบบ random
if (MAP[r][c] === 2 || MAP[r][c] === 3) {
    const randomCrate = CRATES[Math.floor(Math.random() * CRATES.length)];
    tile.style.backgroundImage = `url('assets/${randomCrate}')`;
}


            boardEl.appendChild(tile);

            rowArr.push({
                tile,
                isWall: MAP[r][c] === 1 || MAP[r][c] === 2 || MAP[r][c] === 3,

                hasCoin: false,
                coinEl: null
            });
        }

        board.push(rowArr);
    }
}


/* ====================================
   PLAYER HANDLING
==================================== */
function placePlayer() {
    player.el = document.createElement("img");
    player.el.src = "assets/player_03.png";
    player.el.classList.add("player");

    updatePlayerPosition();
    document.getElementById("board").appendChild(player.el);
}

function updatePlayerPosition() {
    player.el.style.left = player.col * TILE_SIZE + OFFSET + "px";
    player.el.style.top = player.row * TILE_SIZE + OFFSET + "px";

    const rot = { 0:"0deg", 1:"90deg", 2:"180deg", 3:"270deg" };
    player.el.style.transform = `rotate(${rot[player.dir]})`;
}


/* ====================================
   MOVEMENT
==================================== */
function moveForward() {
    let nr = player.row;
    let nc = player.col;

    if (player.dir === 0) nr--;
    if (player.dir === 1) nc++;
    if (player.dir === 2) nr++;
    if (player.dir === 3) nc--;

    if (board[nr][nc].isWall) {
        Swal.fire({
            icon: "error",
            title: "ชนกำแพง!",
            text: "ลองใหม่อีกครั้งนะ!",
        }).then(() => resetStage());
        return false;
    }

    player.row = nr;
    player.col = nc;

    updatePlayerPosition();
    checkCoin();

    return true;
}

function turnLeft() {
    player.dir = (player.dir + 3) % 4;
    updatePlayerPosition();
}

function turnRight() {
    player.dir = (player.dir + 1) % 4;
    updatePlayerPosition();
}


/* ====================================
   COINS
==================================== */
function placeCoinsFromStage() {
    stageCoins.forEach(pos => {
        const coin = document.createElement("img");
        coin.src = "assets/environment_11.png";
        coin.classList.add("coin");

        const offX = TILE_SIZE/2 - 20;
        const offY = TILE_SIZE/2 - 20;

        coin.style.left = pos.c * TILE_SIZE + offX + "px";
        coin.style.top  = pos.r * TILE_SIZE + offY + "px";

        board[pos.r][pos.c].hasCoin = true;
        board[pos.r][pos.c].coinEl = coin;

        document.getElementById("board").appendChild(coin);
    });
}

function checkCoin() {
    const tile = board[player.row][player.col];
    if (tile.hasCoin) {
        tile.hasCoin = false;
        score++;

        if (tile.coinEl) tile.coinEl.remove();

        document.getElementById("score").textContent =
            `💰 เหรียญที่เก็บได้: ${score}`;
    }
}


/* ====================================
   COMMAND SYSTEM
==================================== */
function addCommand(cmd) {
    commands.push(cmd);
     commandCount = commands.length;
    updateCommandList();
}

function updateCommandList() {
    const list = document.getElementById("command-list");
    list.innerHTML = "";

    if (commands.length === 0) {
        list.textContent = "(คลิกคำสั่งด้านบน)";
        return;
    }

    commands.forEach((cmd, i) => {
        const div = document.createElement("div");

        if (typeof cmd === "string") {
            div.textContent = `${i+1}. ${cmd}`;
        } else if (cmd.type === "repeat") {
            div.textContent = `${i+1}. repeat(${cmd.times}) { ${cmd.cmd} }`;
        }
        else if (cmd.type === "if") {
    div.textContent = `${i+1}. IF(${cmd.condition}) { ${cmd.ifCmd} } ELSE { ${cmd.elseCmd} }`;
}

        list.appendChild(div);
    });
}


function clearCommands() {
    commands = [];
    updateCommandList();
}


/* ====================================
   RUN COMMANDS
==================================== */
async function runCommands() {

    runCount++;
    document.getElementById("runCount").textContent =
        `🔁 จำนวนครั้งที่รันคำสั่ง: ${runCount}`;

    resetStage();
    await new Promise(res => setTimeout(res, 150));

    commandCount = computeRealCommandCount();  // ⭐ นับคำสั่งจริง

    for (let cmd of commands) {
        
        // ⭐ CASE 1: คำสั่งปกติ
        if (typeof cmd === "string") {
            let ok = await execSingle(cmd);
            if (!ok) return;
        }

        // ⭐ CASE 2: คำสั่งทำซ้ำ
        else if (cmd.type === "repeat") {
            for (let i = 0; i < cmd.times; i++) {
                let ok = await execSingle(cmd.cmd);
                if (!ok) return;
            }
        }

        else if (cmd.type === "if") {
    let conditionResult = false;

    if (cmd.condition === "front_is_wall") {
        conditionResult = checkFrontIsWall();
    }
    else if (cmd.condition === "front_is_not_wall") {
        conditionResult = !checkFrontIsWall();
    }

    let commandToRun = conditionResult ? cmd.ifCmd : cmd.elseCmd;

    let ok = await execSingle(commandToRun);
    if (!ok) return;
}

    }

    if (score === totalCoins) {
        stageStats[currentStage].commands = commandCount;
        stageStats[currentStage].runs = runCount;
        Swal.fire({
            icon: "success",
            title: "🎉 ผ่านด่านแล้ว!",
            html: `
                <p>✨ จำนวนครั้งที่รันคำสั่งทั้งหมด: <b>${runCount}</b></p>
                <p>🧩 จำนวนคำสั่งที่ใช้: <b>${commandCount}</b></p>
            `,
            confirmButtonColor: "#28a745"
        }).then(() => goNextStage());
    }
    else {
        Swal.fire({
            icon: "warning",
            title: "ยังไม่สำเร็จ",
            text: `เก็บเหรียญได้ ${score}/${totalCoins}`,
        });
    }
}

async function execSingle(cmd) {
    let ok = true;

    if (cmd === "forward") ok = moveForward();
    if (cmd === "left") turnLeft();
    if (cmd === "right") turnRight();

    await new Promise(res => setTimeout(res, 350));
    return ok;
}


/* ====================================
   RESET
==================================== */
function resetStage() {
    loadStage(currentStage);
}

function resetGame() {
    commands = [];
    runCount = 0;
    commandCount = 0;
    updateCommandList();
    document.getElementById("runCount").textContent = "🔁 จำนวนครั้งที่รันคำสั่ง: 0";

    resetStage();
}


/* ====================================
   NEXT STAGE
==================================== */
function goNextStage() {
    currentStage++;

    if (!STAGES[currentStage]) {
        showFinalSummary();
        return;
    }

    Swal.fire(`ไปด่านที่ ${currentStage}!`).then(() => {
        resetGame();
    });
}


/* ====================================
   BUTTONS
==================================== */
function bindButtons() {
    document.querySelectorAll(".cmd-btn").forEach(btn => {
        btn.onclick = () => addCommand(btn.dataset.cmd);
    });

    document.getElementById("btnRun").onclick = runCommands;
    document.getElementById("btnClear").onclick = clearCommands;
    document.getElementById("btnReset").onclick = resetGame;
    document.getElementById("btnRepeat").onclick = chooseRepeatCommand;
    //document.getElementById("btnIfElse").onclick = chooseIfElseCommand;


}


/* ====================================
   START GAME
==================================== */
window.onload = () => {
    bindButtons();
    loadStage(currentStage);
    updateCommandList();
};



function updateStageTitle() {
    document.getElementById("stageTitle").textContent =
        `Algorithm game – Stage ${currentStage}`;
}


function chooseRepeatCommand() {
    Swal.fire({
        title: "ทำซ้ำกี่ครั้ง?",
        input: "number",
        inputAttributes: { min: 1, step: 1 },
        inputLabel: "จำนวนรอบ",
        confirmButtonText: "ตกลง",
        showCancelButton: true
    }).then(result => {
        if (!result.value) return;

        let times = parseInt(result.value);
        if (times < 1) return;

        // ให้เลือกคำสั่งที่จะทำซ้ำ
        Swal.fire({
            title: "เลือกคำสั่งที่ต้องการทำซ้ำ",
            input: "select",
            inputOptions: {
                forward: "⬆ เดินหน้า",
                left: "↪ เลี้ยวซ้าย",
                right: "↩ เลี้ยวขวา",
            },
            confirmButtonText: "เพิ่มลงคำสั่ง",
            showCancelButton: true
        }).then(res2 => {
            if (!res2.value) return;

            commands.push({
                type: "repeat",
                times: times,
                cmd: res2.value
            });

            updateCommandList();
        });
    });
}

function computeRealCommandCount() {
    let count = 0;

    for (let cmd of commands) {

        // คำสั่งปกติ เช่น forward/left/right
        if (typeof cmd === "string") {
            count += 1;
        }

        // คำสั่ง repeat → นับเป็น block เดียว
        else if (cmd.type === "repeat") {
            count += 1;
        }

        // คำสั่ง if/else → นับเป็น block เดียว
        else if (cmd.type === "if") {
            count += 1;
        }
    }

    return count;
}




function chooseIfElseCommand() {

    Swal.fire({
        title: "เลือกเงื่อนไข IF",
        input: "select",
        inputOptions: {
            front_is_wall: "ด้านหน้ามีกำแพง",
            front_is_not_wall: "ด้านหน้าไม่มีสิ่งกีดขวาง"
        },
        confirmButtonText: "ถัดไป",
        showCancelButton: true
    }).then(result => {
        if (!result.value) return;
        let condition = result.value;

        Swal.fire({
            title: "เลือกคำสั่งในส่วน IF",
            input: "select",
            inputOptions: {
                forward: "เดินหน้า",
                left: "เลี้ยวซ้าย",
                right: "เลี้ยวขวา"
            },
            confirmButtonText: "ถัดไป",
            showCancelButton: true
        }).then(rIf => {
            if (!rIf.value) return;

            Swal.fire({
                title: "เลือกคำสั่งในส่วน ELSE",
                input: "select",
                inputOptions: {
                    forward: "เดินหน้า",
                    left: "เลี้ยวซ้าย",
                    right: "เลี้ยวขวา"
                },
                confirmButtonText: "เพิ่มคำสั่ง",
                showCancelButton: true
            }).then(rElse => {
                if (!rElse.value) return;

                // เพิ่มลง commands[]
                commands.push({
                    type: "if",
                    condition: condition,
                    ifCmd: rIf.value,
                    elseCmd: rElse.value
                });

                updateCommandList();
            });
        });
    });
}


function checkFrontIsWall() {
    let nr = player.row;
    let nc = player.col;

    if (player.dir === 0) nr--;
    if (player.dir === 1) nc++;
    if (player.dir === 2) nr++;
    if (player.dir === 3) nc--;

    return board[nr][nc].isWall;
}


function showFinalSummary() {

    let html = `
    <div style="
        font-family: 'Prompt', sans-serif; 
        text-align:left;
        margin-top: 10px;
    ">

        <div style="
            background:#e8f6ff; 
            padding:15px 20px; 
            border-radius:12px; 
            margin-bottom:18px;
            border-left:6px solid #4aa3e6;
        ">
            <h3 style="margin:0; color:#0b3c60;">📘 สรุปผลการเรียนรู้ทั้งหมด</h3>
            
        </div>

        <table style="
            width:100%; 
            border-collapse: collapse; 
            font-size:16px; 
            margin-bottom: 20px;
        ">
            <thead>
                <tr style="background:#cfe8ff; color:#003f62; text-align:center;">
                    <th style="padding:10px; border-bottom:2px solid #b5d8ff; ">ด่าน</th>
                    <th style="padding:10px; border-bottom:2px solid #b5d8ff;">จำนวนคำสั่งที่ใช้</th>
                    <th style="padding:10px; border-bottom:2px solid #b5d8ff;">จำนวนครั้งที่รัน</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let s = 1; s <= Object.keys(STAGES).length; s++) {
        
        html += `
            <tr style="background:${s % 2 === 0 ? "#f7fbff" : "#ffffff"};">
                <td style="padding:10px; text-align:center;">🏁 ด่านที่ ${s}</td>
                <td style="padding:10px; text-align:center;">
                    <span style="
                        background:#4aa3e6;
                        color:#fff;
                        padding:5px 12px;
                        border-radius:8px;
                        font-weight:bold;
                    ">${stageStats[s].commands}</span>
                </td>
                <td style="padding:10px; text-align:center;">
                    <span style="
                        background:#ffb347;
                        color:#fff;
                        padding:5px 12px;
                        border-radius:8px;
                        font-weight:bold;
                    ">${stageStats[s].runs}</span>
                </td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>

        <div style="
            padding:15px; 
            background:#e8ffe8; 
            border-left:6px solid #54c757; 
            border-radius:12px;
        ">
            <p style="font-size:18px; margin:0; color:#1a7f2e;">
                🎉 ยอดเยี่ยมมาก! คุณผ่านครบทุกด่านแล้ว
            </p>
            <p style="font-size:16px; margin:6px 0 0 0; color:#2d7a3f;">
                🧠 คุณได้เรียนรู้พื้นฐานอัลกอริทึม: <b>ลำดับ (Sequence), การทำซ้ำ (Loop), เงื่อนไข (Condition)</b>
            </p>
        </div>

    </div>
    `;

    Swal.fire({
        width: 750,
        title: "🎓 รายงานผลรวม",
        html: html,
        confirmButtonText: "ปิด",
        confirmButtonColor: "#3085d6",
    });
}

