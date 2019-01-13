const GRID_WIDTH = 1280,
	GRID_HEIGHT = 720,
	GRID_ROWS = 36,
	GRID_COLS = 64,
	GAME_SPEED = 100;

let isPlaying = false;

const root = document.getElementById('root'),
	table = createTable(GRID_ROWS, GRID_COLS);
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
		if (!event.target.classList.contains('cell'))
			return;
		event.target.classList.toggle('alive');
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
		} else {
			isPlaying = false;
			startButton.className = 'icon-play';
		}
	});

	resetButton.addEventListener('click', event => {
		isPlaying = false;
		startButton.className = 'icon-play';
	});

	randomButton.addEventListener('click', event => {
		isPlaying = false;
		startButton.className = 'icon-play';
	});


	container.append(startButton, resetButton, randomButton);
	root.appendChild(container);
}
