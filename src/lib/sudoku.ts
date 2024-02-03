type Cell = {
  row: number;
  col: number;
  num: number;
};
type CellArray = Cell[];
type CellArray2D = Cell[][];
type CellArray3D = Cell[][][];

class Sudoku {
  constructor(N: number = 9, K: number = 0) {
    this.N = N;
    this.K = K;
    this.SRN = Math.floor(Math.sqrt(N));
    this.matrix = Array(N)
      .fill(0)
      .map(() => Array(N).fill({ num: 0 }));
    this.generate();
  }

  N: number;
  K: number;
  SRN: number;
  matrix: CellArray2D;

  getBox(n: number): CellArray2D {
    const row = Math.floor((n - 1) / this.SRN);
    const col = (n - 1) % this.SRN;
    const box = Array(this.SRN)
      .fill(0)
      .map(() => Array(this.SRN).fill(0));
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        box[i][j] = this.matrix[row * this.SRN + i][col * this.SRN + j];
      }
    }
    return box;
  }

  getBoxes(): CellArray3D {
    let boxes: CellArray3D = [];
    for (let i = 1; i <= this.N; i++) {
      boxes.push(this.getBox(i));
    }
    return boxes;
  }

  randomGen(num: number){
    return Math.floor(Math.random() * num + 1);
  }

  unusedInBox(rowStart: number, colStart: number, num: number) {
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        if (this.matrix[i + rowStart][j + colStart].num === num) {
          return false;
        }
      }
    }
    return true;
  }

  unusedInRow(row: number, num: number) {
    for (let col = 0; col < this.N; col++) {
      if (this.matrix[row][col].num === num) {
        return false;
      }
    }
    return true;
  }

  unusedInCol(col: number, num: number) {
    for (let row = 0; row < this.N; row++) {
      if (this.matrix[row][col].num === num) {
        return false;
      }
    }
    return true;
  }

  isSafe(row: number, col: number, num: number) {
    return (
      this.unusedInRow(row, num) &&
      this.unusedInCol(col, num) &&
      this.unusedInBox(row - (row % this.SRN), col - (col % this.SRN), num)
    );
  }

  fillBox(row: number, col: number) {
    let num;
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        do {
          num = this.randomGen(this.N);
        } while (!this.isSafe(row + i, col + j, num));
        this.matrix[row + i][col + j] = {
          row: row + i,
          col: col + j,
          num
        };
      }
    }
  }
  
  fillDiagonal() {
    for (let i = 0; i < this.N; i += this.SRN) {
      this.fillBox(i, i);
    }
  }

  fillRemaining(row: number, col: number): boolean {
    // Check if we have reached the end of the matrix
    if (row === this.N - 1 && col === this.N) {
      return true;
    }

    // Move to next row if at end of current row
    if (col === this.N) {
      row++;
      col = 0;
    }
    
    // Skip if the cell is already filled
    if (this.matrix[row][col].num !== 0) {
      return this.fillRemaining(row, col + 1);
    }

    // Attempt to fill current cell with valid value
    for (let num = 1; num <= this.N; num++) {
      if (this.isSafe(row, col, num)) {
        this.matrix[row][col] = {num, row, col};
        // Try moving to next cell, returns true if already at end
        if (this.fillRemaining(row, col + 1)) {
          return true;
        }
        this.matrix[row][col] = {row, col, num: 0};
      }
    }

    // No valid value was found
    return false;
  }

  fillValues() {
    this.fillDiagonal();
    this.fillRemaining(0, this.SRN);
  }

  removeKDigits() {
    let count = this.K;
    while (count !== 0) {
      const randomRow = this.randomGen(this.N) - 1;
      const randomCol = this.randomGen(this.N) - 1;
      if (this.matrix[randomRow][randomCol].num !== 0) {
        count--;
        this.matrix[randomRow][randomCol] = {row: randomRow, col: randomCol, num: 0};
      }
    }

    return;
  }

  generate() {
    this.fillValues();
    this.removeKDigits();
  }
}

export { Sudoku };
