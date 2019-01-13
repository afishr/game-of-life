const GRID_WIDTH = 1280,
	GRID_HEIGHT = 1280,
	GRID_ROWS = 36,
	GRID_COLS = 64,
	GAME_SPEED = 100;

let isPlaying = false;

const root = document.getElementById('root'),
	table = createTable(GRID_ROWS, GRID_COLS);

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
			cell.height = GRID_HEIGHT / cols;

			row.appendChild(cell);
		}

		table.appendChild(row);
	}

	root.appendChild(table);
	return table;
}

table.addEventListener('click', event => {
	if (!event.target.classList.contains('cell'))
		return;
	event.target.classList.toggle('alive');
});
