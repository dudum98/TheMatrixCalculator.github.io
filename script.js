function createMatrix() {
    var rows = parseInt(document.getElementById("rows").value);
    var cols = parseInt(document.getElementById("cols").value);

    var matrixContainer = document.getElementById("matrixContainer");
    matrixContainer.innerHTML = "";

    var table = document.createElement("table");
    table.className = "matrix-table";

    for (var i = 0; i < rows; i++) {
      var row = document.createElement("tr");

      for (var j = 0; j < cols; j++) {
        var cell = document.createElement("td");
        var input = document.createElement("input");
        input.type = "number";
        input.className = "matrix-input";
        cell.appendChild(input);
        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    matrixContainer.appendChild(table);
    matrixContainer.dataset.rows = rows;
    matrixContainer.dataset.cols = cols;
  }

  function getMatrixFromInputs() {
    var matrixContainer = document.getElementById("matrixContainer");
    var rows = parseInt(matrixContainer.dataset.rows);
    var cols = parseInt(matrixContainer.dataset.cols);
    var matrix = [];

    var inputs = matrixContainer.getElementsByClassName("matrix-input");
    var inputIndex = 0;

    for (var i = 0; i < rows; i++) {
      var row = [];

      for (var j = 0; j < cols; j++) {
        var inputValue = Number(inputs[inputIndex].value);
        row.push(isNaN(inputValue) ? 0 : inputValue);
        inputIndex++;
      }

      matrix.push(row);
    }

    return matrix;
  }

  function calculateRREF() {
    var matrix = getMatrixFromInputs();

    if (validateMatrix(matrix)) {
      var rref = calculateRREFMatrix(matrix);
      displayResult(rref);
    } else {
      displayResult("Invalid matrix format.");
    }
  }

  function calculateDeterminant() {
    var matrix = getMatrixFromInputs();

    if (validateMatrix(matrix)) {
      var determinant = calculateDeterminantMatrix(matrix);
      displayResult("Determinant: " + determinant);
    } else {
      displayResult("Invalid matrix format.");
    }
  }

  function calculateRank() {
    var matrix = getMatrixFromInputs();

    if (validateMatrix(matrix)) {
      var rank = calculateRankMatrix(matrix);
      displayResult("Rank: " + rank);
    } else {
      displayResult("Invalid matrix format.");
    }
  }

  function calculateInverse() {
    var matrix = getMatrixFromInputs();

    if (validateMatrix(matrix)) {
      var inverse = calculateInverseMatrix(matrix);
      if (inverse) {
        displayResult("Inverse:\n" + matrixToString(inverse));
      } else {
        displayResult("The matrix is not invertible.");
      }
    } else {
      displayResult("Invalid matrix format.");
    }
  }

  function validateMatrix(matrix) {
    var numRows = matrix.length;
    var numCols = matrix[0].length;

    for (var i = 1; i < numRows; i++) {
      if (matrix[i].length !== numCols) {
        return false; // Rows have different number of columns
      }
    }

    return true;
  }

  function calculateRREFMatrix(matrix) {
var numPivotRows = 0;
var numPivotColumns = 0;
var numRows = matrix.length;
var numCols = matrix[0].length;

for (var col = 0; col < numCols; col++) {
  if (numPivotRows >= numRows) {
    break;
  }

  var pivotRow = numPivotRows;

  for (var row = numPivotRows + 1; row < numRows; row++) {
    if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivotRow][col])) {
      pivotRow = row;
    }
  }

  if (Math.abs(matrix[pivotRow][col]) < Number.EPSILON) {
    continue;
  }

  var temp = matrix[numPivotRows];
  matrix[numPivotRows] = matrix[pivotRow];
  matrix[pivotRow] = temp;

  var pivotValue = matrix[numPivotRows][col];
  for (var j = 0; j < numCols; j++) {
    matrix[numPivotRows][j] /= pivotValue;
  }

  for (var row = 0; row < numRows; row++) {
    if (row !== numPivotRows) {
      var factor = matrix[row][col];
      for (var j = 0; j < numCols; j++) {
        matrix[row][j] -= factor * matrix[numPivotRows][j];
      }
    }
  }

  numPivotRows++;
  numPivotColumns++;
}

// Round decimal numbers to a specified number of decimal places
for (var row = 0; row < numRows; row++) {
  for (var col = 0; col < numCols; col++) {
    if (isDecimalNumber(matrix[row][col])) {
      matrix[row][col] = roundToDecimal(matrix[row][col], 2); // Round to 2 decimal places
    }
  }
}

return matrix;
}

// Helper function to round a decimal number to a specified number of decimal places
function roundToDecimal(number, decimalPlaces) {
const factor = Math.pow(10, decimalPlaces);
return Math.round(number * factor) / factor;
}

// Helper function to check if an element is a decimal number
function isDecimalNumber(element) {
return Number.isFinite(element) && !Number.isInteger(element);
}


  function calculateDeterminantMatrix(matrix) {
if (!isSquareMatrix(matrix)) {
  return null; // Determinant is undefined for non-square matrices
}

const n = matrix.length;

if (n === 1) {
  return matrix[0][0]; // Base case: determinant of a 1x1 matrix is its only element
}

let determinant = 0;

for (let col = 0; col < n; col++) {
  const cofactor = matrix[0][col] * calculateDeterminantMatrix(getCofactorMatrix(matrix, 0, col));
  determinant += (col % 2 === 0 ? cofactor : -cofactor); // Alternating signs
}

return determinant;
}

// Helper function to check if a matrix is square
function isSquareMatrix(matrix) {
const numRows = matrix.length;
const numCols = matrix[0].length;

return numRows === numCols;
}

// Helper function to get the cofactor matrix by excluding a given row and column
function getCofactorMatrix(matrix, row, col) {
const cofactorMatrix = [];
const n = matrix.length;

for (let i = 0; i < n; i++) {
  if (i === row) continue; // Skip the excluded row

  const cofactorRow = [];

  for (let j = 0; j < n; j++) {
    if (j === col) continue; // Skip the excluded column

    cofactorRow.push(matrix[i][j]);
  }

  cofactorMatrix.push(cofactorRow);
}

return cofactorMatrix;
}


function calculateRankMatrix(matrix) {
const rref = calculateRREFMatrix(matrix);
let rank = 0;

for (let row = 0; row < rref.length; row++) {
  let allZeroes = true;

  for (let col = 0; col < rref[row].length; col++) {
    if (rref[row][col] !== 0) {
      allZeroes = false;
      break;
    }
  }

  if (!allZeroes) {
    rank++;
  }
}

return rank;
}


function calculateInverseMatrix(matrix) {
if (!isSquareMatrix(matrix)) {
  return null; // Inverse is undefined for non-square matrices
}

const determinant = calculateDeterminantMatrix(matrix);

if (Math.abs(determinant) < Number.EPSILON) {
  return null; // Matrix is not invertible, determinant is zero
}

const n = matrix.length;
const identityMatrix = createIdentityMatrix(n);
const augmentedMatrix = augmentMatrix(matrix, identityMatrix);
const rrefMatrix = calculateRREFMatrix(augmentedMatrix);

const inverseMatrix = [];

for (let row = 0; row < n; row++) {
  const inverseRow = [];

  for (let col = n; col < 2 * n; col++) {
    const element = rrefMatrix[row][col];
    const formattedElement = roundToDecimal(element, 2); // Round to 2 decimal places
    inverseRow.push(formattedElement);
  }

  inverseMatrix.push(inverseRow);
}

return inverseMatrix;
}


// Helper function to round a decimal number to a specified number of decimal places
function roundToDecimal(number, decimalPlaces) {
const factor = Math.pow(10, decimalPlaces);
return Math.round(number * factor) / factor;
}

// Helper function to create an identity matrix of size n
function createIdentityMatrix(n) {
const identityMatrix = [];

for (let i = 0; i < n; i++) {
  const row = [];

  for (let j = 0; j < n; j++) {
    row.push(i === j ? 1 : 0);
  }

  identityMatrix.push(row);
}

return identityMatrix;
}

// Helper function to augment two matrices side by side
function augmentMatrix(matrix1, matrix2) {
const augmentedMatrix = [];

for (let i = 0; i < matrix1.length; i++) {
  augmentedMatrix.push([...matrix1[i], ...matrix2[i]]);
}

return augmentedMatrix;
}


  function matrixToString(matrix) {
    var result = "";

    for (var i = 0; i < matrix.length; i++) {
      result += matrix[i].join("\t") + "\n";
    }

    return result.trim();
  }

  function displayResult(result) {
    var resultTextarea = document.getElementById("result");

    if (typeof result === "string") {
      resultTextarea.value = result;
    } else {
      var resultStr = matrixToString(result);
      resultTextarea.value = resultStr;
    }
  }

  function clearMatrix() {
    var matrixContainer = document.getElementById("matrixContainer");
    matrixContainer.innerHTML = "";
    document.getElementById("result").value = "";
  }