(() => {
  // src/gol.ts
  function stepSlidingWindow1D(boardWidth, board2, rules2) {
    const h2 = board2.length / boardWidth;
    const w2 = boardWidth;
    const out = new Array(board2.length);
    for (let i = 0; i < h2; ++i) {
      let neighbours = 0;
      let yStart = i - 1;
      yStart = yStart < 0 ? 0 : yStart;
      let yEnd = i + 1;
      yEnd = yEnd >= h2 ? h2 - 1 : yEnd;
      for (let k = yStart; k <= yEnd; ++k) {
        for (let l = 0; l < 2; ++l) {
          neighbours += board2[k * w2 + l];
        }
      }
      for (let j = 0; j < w2; ++j) {
        let state = board2[i * w2 + j];
        out[i * w2 + j] = rules2[state][neighbours - state];
        let canAdd = j + 2 < w2;
        let canSub = j - 1 >= 0;
        for (let m = yStart; m <= yEnd; ++m) {
          canAdd && (neighbours += board2[m * w2 + j + 2]);
          canSub && (neighbours -= board2[m * w2 + j - 1]);
        }
      }
    }
    return out;
  }
  function draw1D(boardWidth, board2, ctx2, aliveColor = "#FFFF00") {
    const h2 = board2.length / boardWidth;
    const w2 = boardWidth;
    const oldStyle = ctx2.fillStyle;
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    ctx2.fillStyle = aliveColor;
    ctx2.beginPath();
    for (let i = 0; i < h2; ++i) {
      for (let j = 0; j < w2; ++j) {
        if (!board2[i * w2 + j]) {
          continue;
        }
        ;
        ctx2.fillRect(j, i, 1, 1);
      }
    }
    ctx2.fill();
    ctx2.fillStyle = oldStyle;
  }

  // src/main.ts
  var canvas = document.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var clearButton = document.querySelector("#clear");
  var pauseButton = document.querySelector("#pause");
  var speedRange = document.querySelector("#speed");
  var speedSpan = document.querySelector("span");
  var w = 100;
  var h = 100;
  var scale = 6;
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
  canvas.style.zIndex = "-1";
  var rules = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0]
  ];
  var board = new Array(w * h).fill(0);
  board[0] = 1;
  var isPointerDown = false;
  var x;
  var y;
  window.onpointerdown = () => isPointerDown = true;
  window.onpointerup = () => isPointerDown = false;
  window.onpointermove = (e) => {
    let computedStyleCanvas = getComputedStyle(canvas);
    let canvasTop = (innerHeight - parseFloat(computedStyleCanvas.height)) / 2;
    let canvasLeft = (innerWidth - parseFloat(computedStyleCanvas.width)) / 2;
    x = (e.x - canvasLeft) / scale;
    y = (e.y - canvasTop) / scale;
    x = Math.round(x);
    y = Math.round(y);
    if (!isPointerDown || x < 0 || x > w - 1 || y < 0 || y > h - 1)
      return;
    x = clamp(x, 0, w - 1);
    y = clamp(y, 0, h - 1);
    board[y * w + x] = 1;
  };
  clearButton.onclick = () => board.fill(0);
  var stepSpeed = 150;
  speedSpan.innerText = `${stepSpeed}`;
  var pause = false;
  pauseButton.onclick = () => pause = !pause;
  speedRange.onchange = (e) => {
    let speed = e.target.value;
    stepSpeed = parseFloat(speed);
    speedSpan.innerText = speed;
  };
  var last = performance.now();
  function loop(ctx2) {
    let time = performance.now() - last;
    draw1D(w, board, ctx2);
    ctx2.fillStyle = "#FF0000";
    ctx2.fillRect(x, y, 1, 1);
    if (!pause && time > stepSpeed) {
      board = stepSlidingWindow1D(w, board, rules);
      last = performance.now();
    }
    requestAnimationFrame(() => loop(ctx2));
  }
  if (ctx)
    loop(ctx);
  function clamp(x2, min, max) {
    return Math.min(Math.max(x2, min), max);
  }
})();
