export function stepSlidingWindow(board: number[][], rules: number[][]): number[][] {
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

export function stepSlidingWindow1D(boardWidth: number, board: number[], rules: number[][]): number[] {
	const h = board.length / boardWidth;
	const w = boardWidth;
	const out: number[] = new Array(board.length);
	for (let i = 0; i < h; ++i) {
		let neighbours = 0;
		let yStart = i - 1;
		yStart = yStart < 0 ? 0 : yStart;
		let yEnd = i + 1;
		yEnd = yEnd >= h ? h - 1 : yEnd;
		for (let k = yStart; k <= yEnd; ++k) {
			for (let l = 0; l < 2; ++l) {
				neighbours += board[k * w + l];
			}
		}
		for (let j = 0; j < w; ++j) {
			let state = board[i * w + j];
			out[i * w + j] = rules[state][neighbours - state];
			let canAdd = j + 2 < w;
			let canSub = j - 1 >= 0;
			for (let m = yStart; m <= yEnd; ++m) {
				canAdd && (neighbours += board[m * w + j + 2]);
				canSub && (neighbours -= board[m * w + j - 1]);
			}
		}
	}
	return out;
}

export function clearBoard(board: number[][]): void {
	for (let i = 0; i < board.length; ++i) {
		for (let j = 0; j < board[i].length; ++j) {
			board[i][j] = 0;
		}
	}
}

export function draw(
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
			if (!board[i][j]) continue;
			ctx.rect(j, i, 1, 1);
		}
	}
	ctx.fill();
	ctx.fillStyle = oldStyle;
}

export function draw1D(boardWidth: number, board: number[], ctx: CanvasRenderingContext2D, aliveColor: string = "#FFFF00") {
	const h = board.length / boardWidth;
	const w = boardWidth;
	const oldStyle = ctx.fillStyle;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = aliveColor;
	ctx.beginPath();
	for (let i = 0; i < h; ++i) {
		for (let j = 0; j < w; ++j) {
			if (!board[i * w + j]) {
				continue;
			};
			ctx.fillRect(j, i, 1, 1);
		}
	}
	ctx.fill();
	ctx.fillStyle = oldStyle;
}
