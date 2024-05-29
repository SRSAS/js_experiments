export class DrawableArray {
    constructor(canvas) {
        this.drawables = [];
        this.canvas = canvas;
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    draw() {
        this.drawables.forEach(drawable => drawable.draw());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawables.forEach(drawable => drawable.resize());
    }

    add(drawable) {
        this.drawables.push(drawable);
    }

    remove(drawable) {
        const index = this.drawables.indexOf(drawable);
        if (index > -1) {
            this.drawables.splice(index, 1);
        }
    }
}

export class Drawable {
    constructor(x, y, object) {
        this.x = x;
        this.y = y;
        this.object = object;
    }

    draw() {
        this.object.draw(this.x, this.y);
    }

    resize() {
        if (this.object.resizeOnWindowResize) {
            this.object.resize();
        }
    }
}

export class Array2D {
    constructor(rows, cols, cellSize, x, y, canvasContext, padding = 0, startingValue = 0, resizeOnWindowResize = true, keepValuesOnResize = true) {
        this.array = new Array(rows * cols).fill(startingValue);
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.canvasContext = canvasContext;
        this.padding = padding;
        this.startingValue = startingValue;
        this.resizeOnWindowResize = resizeOnWindowResize;
        this.keepValuesOnResize = keepValuesOnResize;
        if (resizeOnWindowResize) {
            this.resize();
        }
    }

    at(row, col) {
        return this.array[row * this.cols + col];
    };

    forEach(func) {
        this.array.forEach(func);
    }

    forEachRowCol(func) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                func(this.at(row, col), row, col);
            }
        }
    }

    forEachInRow(func, row) {
        for (let col = 0; col < this.cols; col++) {
            func(this.at(row, col), row, col);
        }
    }

    forEachInCol(func, col) {
        for (let row = 0; row < this.rows; row++) {
            func(this.at(row, col), row, col);
        }
    }

    draw() {
        this.forEachRowCol((style, row, col) => {
            if (style) {
                const cellX = this.x + this.padding + col * (this.cellSize + this.padding);
                const cellY = this.y - (row + 1) * (this.cellSize + this.padding);
                this.canvasContext.fillStyle = style;
                this.canvasContext.fillRect(cellX, cellY, this.cellSize, this.cellSize);
            }
        });
    }

    setAt(row, col, value) {
        this.array[row * this.cols + col] = value;
    };

    setAll(value) {
        this.array.fill(value);
    };

    resize() {
        const oldArray = this.array;
        const oldRows = this.rows;
        const oldCols = this.cols;

        this.rows = Math.ceil((window.innerHeight - this.padding) / (this.cellSize + this.padding));
        this.cols = Math.ceil((window.innerWidth - this.padding) / (this.cellSize + this.padding));
        this.array = new Array(this.rows * this.cols).fill(this.startingValue);
        this.y = window.innerHeight;

        if (this.keepValuesOnResize) {
            for (let r = 0; r < oldRows; r++) {
                for (let c = 0; c < oldCols; c++) {
                    this.array[r * this.rows + c] = oldArray[r * oldRows + c];
                }
            }
        }
    };

    sandEffect(emptyValue) {
        this.forEachRowCol((cell, row, col) => {
            if (cell === emptyValue || row === 0) {
                return;
            }

            if (this.at(row - 1, col) === emptyValue) {
                this.setAt(row, col, emptyValue);
                this.setAt(row - 1, col, cell);
                return;
            }

            let rOne;
            let rTwo;

            if (Math.random() > 0.5) {
                rOne = 1;
            } else {
                rOne = -1;
            }
            rTwo = -rOne;

            if (this.at(row - 1, col + rOne) === emptyValue) {
                this.setAt(row, col, emptyValue);
                this.setAt(row - 1, col + rOne, cell);
                return;
            }

            if (this.at(row - 1, col + rTwo) === emptyValue) {
                this.setAt(row, col, emptyValue);
                this.setAt(row, col + rOne, cell);
                return;
            }
        });
    }
}

