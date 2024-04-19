(function () {
  const canvas = <HTMLCanvasElement>document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const rules = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
  ];

  const w = 100;
  const h = 100;

  const scale = 5;

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w * scale}px`;
  canvas.style.height = `${h * scale}px`;
  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";
  canvas.style.background = "#000000";

  canvas.style.touchAction = "none";

  let board: number[][] = [];

  for (let i = 0; i < h; ++i) {
    board[i] = [];
    for (let j = 0; j < w; ++j) {
      board[i][j] = 0;
    }
  }

  let isPointerDown = false;

  let x: number;
  let y: number;

  window.onpointerdown = (e) => {
    isPointerDown = true;
  };

  window.onpointerup = () => {
    isPointerDown = false;
  };

  window.onpointermove = (e: PointerEvent) => {
    let computedStyleCanvas = getComputedStyle(canvas);
    let canvasTop = (innerHeight - parseFloat(computedStyleCanvas.height)) / 2;
    let canvasLeft = (innerWidth - parseFloat(computedStyleCanvas.width)) / 2;

    x = (e.x - canvasLeft) / scale;
    y = (e.y - canvasTop) / scale;

    x = Math.round(x);
    y = Math.round(y);

    x = clamp(x, 0, w - 1);
    y = clamp(y, 0, h - 1);

    if (!isPointerDown) return;

    board[y][x] = 1;
  };

  // glider(board, 0, 0);

  setInterval(() => {
    board = stepSlidingWindow(board, rules);
  }, 150);

  function loop() {
    if (ctx) {
      draw(board, ctx);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(x, y, 1, 1);
    }
    requestAnimationFrame(loop);
  }

  loop();
})();

function step(board: number[][], rules: number[][]): number[][] {
  const h = board.length;
  const w = board[0].length;
  const out: number[][] = new Array(h);
  for (let i = 0; i < h; ++i) {
    out[i] = new Array(w);
    for (let j = 0; j < w; ++j) {
      let neighbours = 0;
      for (let k = i - 1; k < i + 2; ++k) {
        for (let l = j - 1; l < j + 2; ++l) {
          if (k == i && l == j) continue;
          if (k >= 0 && k < h && l >= 0 && l < w) {
            neighbours += board[k][l];
          }
        }
      }
      out[i][j] = rules[board[i][j]][neighbours];
      // console.log(`x: ${j}, y: ${i}, neighbours: ${neighbours}`);
    }
  }
  return out;
}

function stepSlidingWindow(board: number[][], rules: number[][]): number[][] {
  const h = board.length;
  const w = board[0].length;
  const out: number[][] = new Array(h);
  for (let i = 0; i < h; ++i) {
    out[i] = new Array(w);
    let neighbours = 0;
    let yStart = i - 1;
    yStart = yStart < 0 ? 0 : yStart;
    let yEnd = i + 1;
    yEnd = yEnd >= h ? h - 1 : yEnd;
    for (let k = yStart; k <= yEnd; ++k) {
      for (let l = 0; l < 2; ++l) {
        neighbours += board[k][l];
      }
    }
    for (let j = 0; j < w; ++j) {
      let state = board[i][j];
      // console.log(`x: ${j}, y: ${i}, neighbours: ${neighbours - state}`);
      out[i][j] = rules[state][neighbours - state];
      let canAdd = j + 2 < w;
      let canSub = j - 1 >= 0;
      for (let m = yStart; m <= yEnd; ++m) {
        canAdd && (neighbours += board[m][j + 2]);
        canSub && (neighbours -= board[m][j - 1]);
      }
    }
  }
  return out;
}

function draw(
  board: number[][],
  ctx: CanvasRenderingContext2D,
  aliveColor: string = "#FFFF00",
): void {
  const h = board.length;
  const w = board[0].length;

  let oldStyle = ctx.fillStyle;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = aliveColor;
  ctx.beginPath();
  for (let i = 0; i < h; ++i) {
    for (let j = 0; j < w; ++j) {
      let state = board[i][j];
      if (!state) continue;
      ctx.rect(j, i, 1, 1);
    }
  }
  ctx.fill();
  ctx.fillStyle = oldStyle;
}

function glider(board: number[][], x: number, y: number): void {
  board[y][x + 1] = 1;
  board[y + 1][x + 2] = 1;
  board[y + 2][x] = 1;
  board[y + 2][x + 1] = 1;
  board[y + 2][x + 2] = 1;
}

function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}
