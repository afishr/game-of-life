const GRID_WIDTH = 1280,
	GRID_HEIGHT = 720,
	GRID_ROWS = 100,
	GRID_COLS = 100,
	GAME_SPEED = 100;

let isPlaying = false,
	currentRole = 1,
	currentGeneration = 0,
	generations = [],
	resetEnviroments = [],
	randomEnviroments = [],
	quitEnviroments = [],
	interval = null;

const root = document.getElementById('root'),
	table = createTable(GRID_ROWS, GRID_COLS),
	grid = createGrid(GRID_ROWS, GRID_COLS),
	environment = createGrid(GRID_ROWS, GRID_COLS),
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

		if (grid[row][col] === 0) {
			if (currentRole === 1) {
				aim.classList.add('alive');
			} else if (currentRole === 2) {
				aim.classList.add('super-cell');
			} else if (currentRole === 3) {
				aim.classList.add('flemish-cell');
			} else if (currentRole === 4) {
				aim.classList.add('antisocial-cell');
			} else if (currentRole === 5) {
				aim.classList.add('clone-cell');
			}
			grid[row][col] = currentRole;
		} else {
			aim.classList.remove("alive", "super-cell", "flemish-cell", "antisocial-cell", "clone-cell");
			grid[row][col] = 0;
		}
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
			grid[i][j] = Math.round(Math.random() * 12);
		}
	}
	// quit zone
	setEnvironment(1, [[1, 20], [10, 15], [1, 40]]);
	// reset zone
	setEnvironment(2, [[1, 1], [10, 10], [1, 20]]);
	// anarchy zone
	setEnvironment(3, [[30, 50], [20, 10], [50, 20]]);
	// random zone
	setEnvironment(4, [[30, 30], [40, 60], [60, 20]]);
	// imperial/fertile zone
	setEnvironment(5, [[70, 30], [70, 10], [800, 20]]);
}

function setEnvironment(type, polygon) {
	const env = createGrid(GRID_ROWS, GRID_COLS);
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (inside([i, j], polygon)) {
				environment[i][j] = type;
				env[i][j] = type;
			}
		}
	}
	// for reset zone
	if (type === 2) {
		resetEnviroments.push(env);
	}

	//for random zone
	if (type === 4) {
		randomEnviroments.push(env);
	}

	//for quit zone
	if (type === 1) {
		quitEnviroments.push(env);
	}
}

function updateTable(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cell = table.rows[i].cells[j];
			cell.className = '';
			cell.classList.add('cell');
			if (grid[i][j] === 1) {
				cell.classList.add('alive');
			} else if (grid[i][j] === 2) {
				cell.classList.add('super-cell');
			} else if (grid[i][j] === 3) {
				cell.classList.add('flemish-cell');
			} else if (grid[i][j] === 4) {
				cell.classList.add('antisocial-cell');
			} else if (grid[i][j] === 5) {
				cell.classList.add('clone-cell');
			} else {
				cell.classList.remove('alive');
			}
			if (environment[i][j] === 1) {
				cell.classList.add('quit-life');
			} else if (environment[i][j] === 2) {
				cell.classList.add('reset-zone');
			} else if (environment[i][j] === 3) {
				cell.classList.add('anarchy-zone');
			} else if (environment[i][j] === 4) {
				cell.classList.add('random-zone');
			} else if (environment[i][j] === 5) {
				cell.classList.add('imperial-zone');
			}
		}
	}
}

function resetGrid(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = 0;
		}
	}
	generations = [];
	currentGeneration = 0;
}

function play() {
	computeNext(GRID_ROWS, GRID_COLS);
	updateTable(GRID_ROWS, GRID_COLS);
}

function computeNext(rows, cols) {
	currentGeneration++;
	if (currentGeneration % 5 === 1) {
		generations[0] = grid;
	} else if (currentGeneration % 5 === 2) {
		generations[1] = grid;
	} else if (currentGeneration % 5 === 3) {
		generations[2] = grid;
	} else if (currentGeneration % 5 === 4) {
		generations[3] = grid;
	} else {
		generations[4] = grid;
	}

	checkResetEnvironments();
	if (currentGeneration % 5 === 0) {
		checkRandomEnvironment();
	}
	if (currentGeneration > 4) {
		checkQuitEnvironment();
	}
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
	let neighbours;
	// 0 - died cell
	// 1 - simple cell
	// 2 - super cell
	// 3 - flemish cell
	// 4 - antisocial cell
	// 5 - clone cell

	if (grid[row][col] === 2) {
		neighbours = countNeighbours(row, col, 'flemish', [1, 2, 3, 4, 5]);
	} else if (grid[row][col] === 4) {
		neighbours = countNeighbours(row, col, '', [1, 2, 3, 4, 5]);
	} else {
		// allow super && flemish cell neighbour
		neighbours = countNeighbours(row, col, '', [1, 4, 5]);
	}

	if (grid[row][col] !== 0) {
		if (grid[row][col] === 2) {
			if (environment[row][col] === 3) {
				// anarchy zone && super cell
				if (neighbours > 2) {
					nextGrid[row][col] = 0;
				} else {
					nextGrid[row][col] = 2;
				}
			} else if (environment[row][col] === 5) {
				//for imperial zone && super cell
				if (neighbours < 1) {
					nextGrid[row][col] = 0;
				} else {
					nextGrid[row][col] = 2;
				}
			} else {
				//simple zone/rules && super cell
				if (neighbours < 2) {
					nextGrid[row][col] = 0;
				} else {
					nextGrid[row][col] = 2;
				}
			}
		} else if (grid[row][col] === 4) {
			if (environment[row][col] === 3) {
				// anarchy zone && antisocial cell
				if (neighbours > 0) {
					nextGrid[row][col] = grid[row][col];
				} else {
					nextGrid[row][col] = 0;
				}
			} else if (environment[row][col] === 5) {
				// imperial zone && antisocial cell
				if (neighbours < 1) {
					nextGrid[row][col] = grid[row][col];
				} else {
					nextGrid[row][col] = 0;
				}
			} else {
				//simple zone && antisocial cell
				if (neighbours === 0) {
					nextGrid[row][col] = grid[row][col];
				} else {
					nextGrid[row][col] = 0;
				}
			}
		} else {
			// simple, flemish, clone cell
			if (environment[row][col] === 3) {
				//anarchy zone
				if (neighbours > 2) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				} else if (neighbours === 2) {
					// lives
					nextGrid[row][col] = grid[row][col];
				} else if (neighbours < 2) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				}
			} else if (environment[row][col] === 5) {
				//imperial zone
				if (neighbours < 1) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				} else if (neighbours === 2 || neighbours === 3 || neighbours === 4) {
					// lives
					nextGrid[row][col] = grid[row][col];
				} else if (neighbours > 4) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				}
			} else {
				//simple zone
				if (neighbours < 2) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				} else if (neighbours === 2 || neighbours === 3) {
					// lives
					nextGrid[row][col] = grid[row][col];
				} else if (neighbours > 3) {
					// dies
					if (grid[row][col] === 5) {
						if (row + 2 < GRID_ROWS) {
							if (grid[row + 2][col] === 0) {
								nextGrid[row + 2][col] = grid[row][col];
							}
							nextGrid[row][col] = 0;
						}
					} else {
						nextGrid[row][col] = 0;
					}
				}
			}
		}
	} else {
		if (neighbours === 3) {
			// revives
			nextGrid[row][col] = 1;
		}
	}
}

function countNeighbours(row, col, type, neighbours) {
	let counter = 0;
	for (let i = 1; i < neighbours.length; i++) {
		// top left
		if (row - 1 >= 0 && col - 1 >= 0)
			if (grid[row - 1][col - 1] === i)
				counter++;

		// top mid
		if (row - 1 >= 0)
			if (grid[row - 1][col] === i)
				counter++;

		// top right
		if (row - 1 >= 0 && row + 1 < GRID_ROWS)
			if (grid[row - 1][col + 1] === i)
				counter++;

		// center left
		if (col - 1 >= 0)
			if (grid[row][col - 1] === i)
				counter++;

		// center right
		if (col + 1 < GRID_COLS)
			if (grid[row][col + 1] === i)
				counter++;

		// bottom left
		if (row + 1 < GRID_ROWS && col - 1 >= 0)
			if (grid[row + 1][col - 1] === i)
				counter++;

		// bottom mid
		if (row + 1 < GRID_ROWS)
			if (grid[row + 1][col] === i)
				counter++;

		// bottom right
		if (row + 1 < GRID_ROWS && col + 1 < GRID_COLS)
			if (grid[row + 1][col + 1] === i)
				counter++;

		// flemish cell
		if (type === 'flemish') {
			if (row - 1 >= 0 && col + 1 < GRID_COLS)
				if (grid[row - 1][col + 2] === i)
					counter++;

			if (col + 1 < GRID_COLS)
				if (grid[row][col + 2] === i)
					counter++;

			if (row + 1 < GRID_ROWS && col + 1 < GRID_COLS)
				if (grid[row + 1][col + 2] === i)
					counter++;

			if (col - 1 < GRID_COLS && row + 2 < GRID_ROWS)
				if (grid[row + 2][col - 1] === i)
					counter++;

			if (row + 2 < GRID_ROWS)
				if (grid[row + 2][col] === i)
					counter++;

			if (col + 1 < GRID_COLS && row + 2 < GRID_ROWS)
				if (grid[row + 2][col + 1] === i)
					counter++;

			if (col + 2 < GRID_COLS && row + 2 < GRID_ROWS)
				if (grid[row + 2][col + 2] === i)
					counter++;
		}
	}

	return counter;
}

function inside(point, vs) {
	var x = point[0], y = point[1];

	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
}

function checkResetEnvironments() {
	resetEnviroments.map(el => {
		const info = getEnvInfo(el, 2);
		let length = info[0];
		let liveCell = info[1];
		if ((liveCell * 100) / length > 80 && currentGeneration > 10) {
			resetEnvironment(el, 2);
		}
	})
}

function checkRandomEnvironment() {
	randomEnviroments.map(el => {
		let count = 0;
		const randomElement = Math.round(Math.random() * getEnvInfo(el, 4)[0]);
		for (let i = 0; i < GRID_ROWS; i++) {
			for (let j = 0; j < GRID_COLS; j++) {
				if (el[i][j] === 4) {
					count++;
					if (count === randomElement) {
						grid[i][j] === 0 ? grid[i][j] = 1 : grid[i][j] = 0;
					}
				}
			}
		}
	});
}

function checkQuitEnvironment() {
	quitEnviroments.map(el => {
		for (let i = 0; i < GRID_ROWS; i++) {
			for (let j = 0; j < GRID_COLS; j++) {
				if (el[i][j] === 1) {
					if (grid[i][j] > 0 && grid[i][j] < 6 &&
						generations[0][i][j] === generations[1][i][j] &&
						generations[0][i][j] === generations[2][i][j] &&
						generations[0][i][j] === generations[3][i][j] &&
						generations[0][i][j] === generations[4][i][j]) {
						grid[i][j] = 0;
					}
				}
			}
		}
	})
}

function getEnvInfo(env, value) {
	let returnInfo = [0, 0];
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (env[i][j] === value) {
				// length
				returnInfo[0]++;
				if (grid[i][j] > 0) {
					// active cells
					returnInfo[1]++;
				}
			}
		}
	}
	return returnInfo;
}

function resetEnvironment(el, value) {
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (el[i][j] === value) {
				grid[i][j] = 0;
			}
		}
	}
}

function renderRoles(arr) {
	const roles = document.getElementById("roles");
	let html = '';
	for (let i = 0; i < arr.length; i++) {
		html += `<div class="role" onclick="setCurrentRole(${arr[i][0]})">${arr[i][1]}</div>`;
	}
	roles.innerHTML = html;
}

function setCurrentRole(role) {
	currentRole = role;
}

function initControls() {
	const roles = [[0, "Died"], [1, "Simple"], [2, "Super"], [3, "Flemish"], [4, "Antisocial"], [5, "Clone"]];
	renderRoles(roles);
}

initControls();
