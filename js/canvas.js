import { DrawableArray } from "./drawables.js";

const drawables = new DrawableArray(document.getElementById('canvas'));

export function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawables.resize(window.innerWidth, window.innerHeight);
    drawables.draw();
}

export function clearCanvas() {
    const canvasContext = drawables.canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

export function addDrawable(drawable) {
    drawables.add(drawable);
}

export function removeDrawable(drawable) {
    drawables.remove(drawable);
}

export function draw() {
    drawables.draw();
}

