(() => {
  // src/main.ts
  (function() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;
    const rules = [
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0]
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
    let board = [];
    for (let i = 0; i < h; ++i) {
      board[i] = [];
      for (let j = 0; j < w; ++j) {
        board[i][j] = 0;
      }
    }
    let isPointerDown = false;
    let x;
    let y;
    window.onpointerdown = (e) => {
      isPointerDown = true;
    };
    window.onpointerup = () => {
      isPointerDown = false;
    };
    window.onpointermove = (e) => {
      let computedStyleCanvas = getComputedStyle(canvas);
      let canvasTop = (innerHeight - parseFloat(computedStyleCanvas.height)) / 2;
      let canvasLeft = (innerWidth - parseFloat(computedStyleCanvas.width)) / 2;
      x = (e.x - canvasLeft) / scale;
      y = (e.y - canvasTop) / scale;
      x = Math.round(x);
      y = Math.round(y);
      x = clamp(x, 0, w - 1);
      y = clamp(y, 0, h - 1);
      if (!isPointerDown)
        return;
      board[y][x] = 1;
    };
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
  function stepSlidingWindow(board, rules) {
    const h = board.length;
    const w = board[0].length;
    const out = new Array(h);
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
  function draw(board, ctx, aliveColor = "#FFFF00") {
    const h = board.length;
    const w = board[0].length;
    let oldStyle = ctx.fillStyle;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = aliveColor;
    ctx.beginPath();
    for (let i = 0; i < h; ++i) {
      for (let j = 0; j < w; ++j) {
        let state = board[i][j];
        if (!state)
          continue;
        ctx.rect(j, i, 1, 1);
      }
    }
    ctx.fill();
    ctx.fillStyle = oldStyle;
  }
  function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
  }
})();
