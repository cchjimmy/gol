(() => {
  // src/main.ts
  var canvas = document.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var clearButton = document.querySelector("#clear");
  var pauseButton = document.querySelector("#pause");
  var speedRange = document.querySelector("#speed");
  var speedSpan = document.querySelector("span");
  var rules = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0]
  ];
  var w = 100;
  var h = 100;
  var scale = 5;
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
  var board = [];
  for (let i = 0; i < h; ++i) {
    board[i] = [];
    for (let j = 0; j < w; ++j) {
      board[i][j] = 0;
    }
  }
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
    board[y][x] = 1;
  };
  clearButton.onclick = () => clearBoard(board);
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
    draw(board, ctx2);
    ctx2.fillStyle = "#FF0000";
    ctx2.fillRect(x, y, 1, 1);
    if (!pause && time > stepSpeed) {
      board = stepSlidingWindow(board, rules);
      last = performance.now();
    }
    requestAnimationFrame(() => loop(ctx2));
  }
  if (ctx)
    loop(ctx);
  function stepSlidingWindow(board2, rules2) {
    const h2 = board2.length;
    const w2 = board2[0].length;
    const out = new Array(h2);
    for (let i = 0; i < h2; ++i) {
      out[i] = new Array(w2);
      let neighbours = 0;
      let yStart = i - 1;
      yStart = yStart < 0 ? 0 : yStart;
      let yEnd = i + 1;
      yEnd = yEnd >= h2 ? h2 - 1 : yEnd;
      for (let k = yStart; k <= yEnd; ++k) {
        for (let l = 0; l < 2; ++l) {
          neighbours += board2[k][l];
        }
      }
      for (let j = 0; j < w2; ++j) {
        let state = board2[i][j];
        out[i][j] = rules2[state][neighbours - state];
        let canAdd = j + 2 < w2;
        let canSub = j - 1 >= 0;
        for (let m = yStart; m <= yEnd; ++m) {
          canAdd && (neighbours += board2[m][j + 2]);
          canSub && (neighbours -= board2[m][j - 1]);
        }
      }
    }
    return out;
  }
  function draw(board2, ctx2, aliveColor = "#FFFF00") {
    const h2 = board2.length;
    const w2 = board2[0].length;
    let oldStyle = ctx2.fillStyle;
    ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    ctx2.fillStyle = aliveColor;
    ctx2.beginPath();
    for (let i = 0; i < h2; ++i) {
      for (let j = 0; j < w2; ++j) {
        if (!board2[i][j])
          continue;
        ctx2.rect(j, i, 1, 1);
      }
    }
    ctx2.fill();
    ctx2.fillStyle = oldStyle;
  }
  function clamp(x2, min, max) {
    return Math.min(Math.max(x2, min), max);
  }
  function clearBoard(board2) {
    for (let i = 0; i < board2.length; ++i) {
      for (let j = 0; j < board2[i].length; ++j) {
        board2[i][j] = 0;
      }
    }
  }
})();
