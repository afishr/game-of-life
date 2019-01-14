const GRID_WIDTH = 1280,
	GRID_HEIGHT = 720,
	GRID_ROWS = 36,
	GRID_COLS = 64,
	GAME_SPEED = 100;

let isPlaying = false,
	interval = null;

const root = document.getElementById('root'),
	table = createTable(GRID_ROWS, GRID_COLS),
	grid = createGrid(GRID_ROWS, GRID_COLS),
	nextGrid = createGrid(GRID_ROWS, GRID_COLS);
createControls();


function createTable(rows, cols) {
	const table = document.createElement('table');
	table.className = 'grid';

	for (let i = 0; i < rows; i++) {
		const row = document.createElement('tr');

		row.className = 'row';

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('td');

			cell.className = 'cell';
			cell.width = GRID_WIDTH / cols;
			cell.height = GRID_HEIGHT / rows;

			row.appendChild(cell);
		}

		table.appendChild(row);
	}

	table.addEventListener('click', event => {
		const aim = event.target;
		let col = aim.cellIndex,
			row = aim.parentNode.rowIndex,
			isAlive = grid[row][col];

		if (!aim.classList.contains('cell'))
			return;

		grid[row][col] = Number(!isAlive)
		aim.classList.toggle('alive', !isAlive);
	});

	root.appendChild(table);
	return table;
}

function createControls() {
	const startButton = document.createElement('button'),
		resetButton = document.createElement('button'),
		randomButton = document.createElement('button'),
		container = document.createElement('div');

	startButton.className = 'icon-play';
	resetButton.className = 'icon-reset';
	randomButton.className = 'icon-shuffle';
	container.className = 'controls';

	startButton.addEventListener('click', event => {
		if (!isPlaying) {
			isPlaying = true;
			startButton.className = 'icon-pause';
			interval = setInterval(play, GAME_SPEED);
		} else {
			isPlaying = false;
			startButton.className = 'icon-play';
			clearInterval(interval);
		}
	});

	resetButton.addEventListener('click', event => {
		isPlaying = false;
		startButton.className = 'icon-play';
		clearInterval(interval);

		resetGrid(GRID_ROWS, GRID_COLS);
		updateTable(GRID_ROWS, GRID_COLS);
	});

	randomButton.addEventListener('click', event => {
		isPlaying = false;
		startButton.className = 'icon-play';
		clearInterval(interval);

		randomizeGrid(GRID_ROWS, GRID_COLS);
		updateTable(GRID_ROWS, GRID_COLS);
	});

	container.append(startButton, resetButton, randomButton);
	root.appendChild(container);
}

function createGrid(rows, cols) {
	let grid = [];

	for (let i = 0; i < rows; i++) {
		grid[i] = [];

		for (let j = 0; j < cols; j++)
			grid[i][j] = 0;

	}

	return grid;
}

function randomizeGrid(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = Math.round(Math.random());
		}
	}
}

function updateTable(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cell = table.rows[i].cells[j];

			cell.classList.toggle('alive', !!grid[i][j]);
		}
	}
}

function resetGrid(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = 0;
		}
	}
}

function play() {
	computeNext(GRID_ROWS, GRID_COLS);
	updateTable(GRID_ROWS, GRID_COLS);
}

function computeNext(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			applyRules(i, j);
		}
	}

	copyGrid(GRID_ROWS, GRID_COLS);
}

function copyGrid(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = nextGrid[i][j];
			nextGrid[i][j] = 0;
		}
	}
}

function applyRules(row, col) {
	let neighbours = countNeighbours(row, col);

	if (grid[row][col]) {
		if (neighbours < 2) {
			// dies
			nextGrid[row][col] = 0;
		} else if (neighbours === 2 || neighbours === 3) {
			// lives
			nextGrid[row][col] = 1;
		} else if (neighbours > 3) {
			// dies
			nextGrid[row][col] = 0;
		}

	} else {
		if (neighbours === 3) {
			// revives
			nextGrid[row][col] = 1;
		}
	}
}

function countNeighbours(row, col) {
	let counter = 0;

	// top left
	if (row - 1 >= 0 && col - 1 >= 0)
		if (grid[row-1][col-1] === 1)
			counter++;

	// top mid
	if (row - 1 >= 0)
		if (grid[row-1][col] === 1)
			counter++;

	// top right
	if (row - 1 >= 0 && row + 1 < GRID_ROWS)
		if (grid[row-1][col+1] === 1)
			counter++;

	// center left
	if (col - 1 >= 0)
		if (grid[row][col-1] === 1)
			counter++;

	// center right
	if (col + 1 < GRID_COLS)
		if (grid[row][col+1] === 1)
			counter++;

	// bottom left
	if (row + 1 < GRID_ROWS && col - 1 >= 0)
		if (grid[row+1][col-1] === 1)
			counter++;

	// bottom mid
	if (row + 1 < GRID_ROWS)
		if (grid[row+1][col] === 1)
			counter++;

	// bottom right
	if (row + 1 < GRID_ROWS && col + 1 < GRID_COLS)
		if (grid[row+1][col+1] === 1)
			counter++;

	return counter;
}
