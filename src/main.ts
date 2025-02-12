import * as gol from "./gol.ts";

const canvas = <HTMLCanvasElement>document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const clearButton = <HTMLButtonElement>document.querySelector("#clear");
const pauseButton = <HTMLButtonElement>document.querySelector("#pause");
const speedRange = <HTMLInputElement>document.querySelector("#speed");
const speedSpan = <HTMLSpanElement>document.querySelector("span");

const w = 100;
const h = 100;
let scale = 6;

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

const rules = [
	[0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 0, 0, 0, 0, 0],
];

// let board: number[][] = [];
// 
// for (let i = 0; i < h; ++i) {
// 	board[i] = [];
// 	for (let j = 0; j < w; ++j) {
// 		board[i][j] = 0;
// 	}
// }

let board: number[] = new Array(w * h).fill(0);

board[0] = 1;

let isPointerDown = false;

let x: number;
let y: number;

window.onpointerdown = () => isPointerDown = true;

window.onpointerup = () => isPointerDown = false;

window.onpointermove = (e: PointerEvent) => {
	let computedStyleCanvas = getComputedStyle(canvas);
	let canvasTop =
		(innerHeight - parseFloat(computedStyleCanvas.height)) /
		2;
	let canvasLeft =
		(innerWidth - parseFloat(computedStyleCanvas.width)) /
		2;

	x = (e.x - canvasLeft) / scale;
	y = (e.y - canvasTop) / scale;

	x = Math.round(x);
	y = Math.round(y);

	if (!isPointerDown || x < 0 || x > w - 1 || y < 0 || y > h - 1) return;
	x = clamp(x, 0, w - 1);
	y = clamp(y, 0, h - 1);
	// board[y][x] = 1;
	board[y * w + x] = 1;
};

// clearButton.onclick = () => clearBoard(board);
clearButton.onclick = () => board.fill(0);

let stepSpeed = 150;
speedSpan.innerText = `${stepSpeed}`;
let pause = false;

pauseButton.onclick = () => pause = !pause;

speedRange.onchange = (e: Event) => {
	let speed = (e.target as HTMLInputElement).value;
	stepSpeed = parseFloat(speed);
	speedSpan.innerText = speed;
}

let last = performance.now();
function loop(ctx: CanvasRenderingContext2D) {
	let time = performance.now() - last;
	gol.draw1D(w, board, ctx);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(x, y, 1, 1);
	if (!pause && time > stepSpeed) {
		board = gol.stepSlidingWindow1D(w, board, rules);
		last = performance.now();
	}
	requestAnimationFrame(() => loop(ctx));
}

if (ctx) loop(ctx);


function clamp(x: number, min: number, max: number): number {
	return Math.min(Math.max(x, min), max);
}

