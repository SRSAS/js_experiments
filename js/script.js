'use strict'

import { Array2D } from "./drawables.js";
import { onResize, clearCanvas, addDrawable, draw } from "./canvas.js";

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const emptyColor = '#525777';
const sandColor = '#dfa8e8';

const array = new Array2D(0, 0, 5, 0, window.innerHeight, canvasContext, 0, emptyColor, true, false);
addDrawable(array);

function generateRandomCells(row, rowRange) {
    const colsUsed = []
    const rowsUsed = []
    const numOfCells = Math.floor(Math.random() * array.cols / 4);

    for (let i = 0; i < numOfCells; i++) {
        let cellRow = row - (rowRange / 2) + Math.floor(Math.random() * rowRange);
        let cellCol = Math.floor(Math.random() * array.cols);
        while (cellCol in colsUsed && cellRow in rowsUsed) {
            cellCol = Math.floor(Math.random() * array.cols);
            cellRow = row - (rowRange / 2) + Math.floor(Math.random() * rowRange);
        }
        colsUsed.push(cellCol);
        rowsUsed.push(cellRow);
        array.setAt(cellRow, cellCol, sandColor);
    }
}

let elapsedTimeUpdate = 0;
let elapsedTimeGenerate = 0;
let startTime = 0;
const millisToUpdateSand = 10;
const millisToGenerateSandMax = 700;
const millisToGenerateSandMin = 300;
let millisToGenerateSand = Math.floor(Math.random() * (millisToGenerateSandMax - millisToGenerateSandMin) + millisToGenerateSandMin);
function update(time) {
    console.log(millisToGenerateSand);
    if (!startTime) {
        startTime = time;
    }

    const deltaTime = time - startTime
    startTime = time;

    elapsedTimeUpdate += deltaTime;
    elapsedTimeGenerate += deltaTime;

    if (elapsedTimeUpdate >= millisToUpdateSand) {
        array.sandEffect(emptyColor);
        elapsedTimeUpdate -= millisToUpdateSand;
    }

    if (elapsedTimeGenerate >= millisToGenerateSand) {
        generateRandomCells(array.rows, 5);
        elapsedTimeGenerate -= millisToGenerateSand;
        millisToGenerateSand = Math.floor(Math.random() * (millisToGenerateSandMax - millisToGenerateSandMin) + millisToGenerateSandMin);
    }

    clearCanvas();
    draw();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
