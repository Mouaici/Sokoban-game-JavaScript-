const gameEl = document.getElementById("game");
gameEl.style.gridTemplateColumns = `repeat(${tileMap01.width}, 32px)`;
gameEl.style.gridTemplateRows = `repeat(${tileMap01.height}, 32px)`;

let player = { x: 0, y: 0 };
let blocks = [];

/* Build the board from mapGrid */
function createBoard() {
  gameEl.innerHTML = "";
  blocks = [];

  for (let y = 0; y < tileMap01.height; y++) {
    for (let x = 0; x < tileMap01.width; x++) {
      let cell = document.createElement("div");
      let value = tileMap01.mapGrid[y][x][0];

      if (value === "W") cell.className = Tiles.Wall;
      else if (value === "G") cell.className = Tiles.Goal;
      else cell.className = Tiles.Space;

      cell.dataset.x = x;
      cell.dataset.y = y;
      gameEl.appendChild(cell);

      if (value === "P") {
        player.x = x;
        player.y = y;
      }
      if (value === "B") {
        blocks.push({ x, y });
      }
    }
  }
  renderEntities();
}

/* Render player + blocks */
function renderEntities() {
  document.querySelectorAll(".entity-player, .entity-block, .entity-block-goal")
          .forEach(e => e.remove());

  // Player
  let playerCell = document.querySelector(`[data-x="${player.x}"][data-y="${player.y}"]`);
  let p = document.createElement("div");
  p.className = Entities.Character;
  playerCell.appendChild(p);

  // Blocks
  for (let block of blocks) {
    let blockCell = document.querySelector(`[data-x="${block.x}"][data-y="${block.y}"]`);
    let b = document.createElement("div");
    if (blockCell.classList.contains(Tiles.Goal)) {
      b.className = Entities.BlockDone;
    } else {
      b.className = Entities.Block;
    }
    blockCell.appendChild(b);
  }
}

/* Movement + pushing logic */
function move(dx, dy) {
  let newX = player.x + dx;
  let newY = player.y + dy;
  let targetCell = tileMap01.mapGrid[newY][newX][0];

  // Wall?
  if (targetCell === "W") return;

  // Block?
  let block = blocks.find(b => b.x === newX && b.y === newY);
  if (block) {
    let pushX = newX + dx;
    let pushY = newY + dy;
    let pushCell = tileMap01.mapGrid[pushY][pushX][0];
    let blockHere = blocks.find(b => b.x === pushX && b.y === pushY);
    if (pushCell === "W" || blockHere) return; // blocked
    block.x = pushX;
    block.y = pushY;
  }

  player.x = newX;
  player.y = newY;
  renderEntities();
  checkWin();
}

/* Win check */
function checkWin() {
  let allDone = blocks.every(b => {
    let cell = tileMap01.mapGrid[b.y][b.x][0];
    return cell === "G";
  });
  if (allDone) {
    setTimeout(() => alert("🎉 You win!"), 100);
  }
}

/* Key controls */
document.addEventListener("keydown", e => {
  e.preventDefault();
  if (e.key === "ArrowUp") move(0, -1);
  else if (e.key === "ArrowDown") move(0, 1);
  else if (e.key === "ArrowLeft") move(-1, 0);
  else if (e.key === "ArrowRight") move(1, 0);
});

/* Start */
createBoard();
