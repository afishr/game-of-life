const GRID_WIDTH = 1280,
	GRID_HEIGHT = 720,
	globalRoles = [[0, "Died (remove element)", ""],
		[1, "Simple", "alive"],
		[2, "Super", "super-cell"],
		[3, "Flemish", "flemish-cell"],
		[4, "Antisocial", "antisocial-cell"],
		[5, "Clone", "clone-cell"]],
	globalEnv = [[0, "Simple Zone (remove zone)", ""],
		[1, "Quit Zone", "quit-life"],
		[2, "Reset Zone", "reset-zone"],
		[3, "Anarchy Zone", "anarchy-zone"],
		[4, "Random Zone", "random-zone"],
		[5, "Imperial Zone", "imperial-zone"]];
let isPlaying = false,
	currentRole = 1,
	currentEnvironment = 0,
	currentGeneration = 0,
	generations = [],
	environments = [[[], []], [[], []], [[], []], [[], []], [[], []], [[], []]],
	environmentOrder = 0,
	GRID_ROWS = 100,
	GRID_COLS = 100,
	GAME_SPEED = 100,
	interval = null;

const root = document.getElementById('root');
let table = createTable(GRID_ROWS, GRID_COLS),
	grid = createGrid(GRID_ROWS, GRID_COLS),
	environment = createGrid(GRID_ROWS, GRID_COLS),
	nextGrid = createGrid(GRID_ROWS, GRID_COLS);

function createTable(rows, cols) {
	const element = document.getElementById("root");
	element.innerHTML = '';

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
			row = aim.parentNode.rowIndex;

		if (!aim.classList.contains('cell'))
			return;

		if (grid[row][col] === 0) {
			if (currentRole > 0) {
				aim.classList.add(globalRoles[currentRole][2]);
			}
			grid[row][col] = currentRole;
		} else {
			aim.classList.remove(globalRoles[1][2], globalRoles[2][2], globalRoles[3][2], globalRoles[4][2], globalRoles[5][2]);
			grid[row][col] = 0;
		}
		let polygon = environments[currentEnvironment][1];
		if (polygon[environmentOrder]) {
			polygon[environmentOrder].push([row, col]);
		} else {
			polygon.push([[row, col]]);
		}
		if (environment[row][col] === 0) {
			if (currentEnvironment > 0) {
				aim.classList.add(globalEnv[currentEnvironment][2]);
			}
			environment[row][col] = currentEnvironment;
		} else {
			aim.classList.remove(globalEnv[1][2], globalEnv[2][2], globalEnv[3][2], globalEnv[4][2], globalEnv[5][2]);
			environment[row][col] = 0;
		}
		setEnvironment(currentEnvironment, polygon);
		renderEnvironments();
		updateTable(GRID_ROWS, GRID_COLS);
	});

	root.appendChild(table);
	setCurrentRole(1);
	setCurrentEnvironment(1);
	createControls();

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
		resetEnvironments(GRID_ROWS, GRID_COLS);
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
}

function setEnvironment(type, polygon) {
	const env = createGrid(GRID_ROWS, GRID_COLS);
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (inside([i, j], polygon[environmentOrder])) {
				environment[i][j] = type;
				env[i][j] = type;
			}
		}
	}
	if (type > 0) {
		environments[currentEnvironment][0][environmentOrder] = env;
	}
	renderEnvironments()
}

function updateTable(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cell = table.rows[i].cells[j];
			cell.className = '';
			cell.classList.add('cell');
			if (globalRoles[grid[i][j]] && globalRoles[grid[i][j]][2]) {
				cell.classList.add(globalRoles[grid[i][j]][2]);
			}
			if (globalEnv[environment[i][j]] && globalEnv[environment[i][j]][2]) {
				cell.classList.add(globalEnv[environment[i][j]][2]);
			}
		}
	}
	getPopulationDensity();
}

function resetGrid(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid[i][j] = 0;
		}
	}
	generations = [];
	environments = [[[], []], [[], []], [[], []], [[], []], [[], []], [[], []]];
	environmentOrder = 0;
	currentGeneration = 0;
	document.getElementById("generations").innerHTML = `<div class="content">${currentGeneration}</div>`;
}

function resetEnvironments(rows, cols) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			environment[i][j] = 0;
		}
	}
}

function play() {
	computeNext(GRID_ROWS, GRID_COLS);
	updateTable(GRID_ROWS, GRID_COLS);
}

function computeNext(rows, cols) {
	currentGeneration++;
	document.getElementById("generations").innerHTML = `<div class="content">${currentGeneration}</div>`;
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

	if (grid[row][col] === 3 || grid[row][col] === 2) {
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
			// revives simple cell
			nextGrid[row][col] = 1;
		}
		if (neighbours === 5) {
			// revives clone cell with probability 10%
			const type = Math.round(Math.random() * 9);
			if (type === 2) {
				nextGrid[row][col] = 5;
			}
			// revives flemish cell with probability 10%
			if (type === 3) {
				nextGrid[row][col] = 3;
			}
		}
		if (neighbours === 4) {
			// revives with probability of 20% an antisocial cell
			const type = Math.round(Math.random() * 4);
			if (type === 3) {
				nextGrid[row][col] = 4;
			}
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
	environments[2][0].map(el => {
		const info = getEnvInfo(el, 2);
		let length = info[0];
		let liveCell = info[1];
		if ((liveCell * 100) / length > 80 && currentGeneration > 10) {
			resetEnvironment(el, 2);
		}
	})
}

function checkRandomEnvironment() {
	environments[4][0].map(el => {
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
	environments[1][0].map(el => {
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

function renderRoles() {
	let arr = globalRoles;
	const roles = document.getElementById("roles");
	let html = '';
	for (let i = 0; i < arr.length; i++) {
		html += `<div class="content" onclick="setCurrentRole(${i})">${arr[i][1]}
<span class="role-indicator ${arr[i][2]}"></span></div>`;
	}
	roles.innerHTML = html;
}

function renderEnvironments() {
	let arr = globalEnv;
	const roles = document.getElementById("environments");
	let html = '';
	for (let i = 0; i < arr.length; i++) {
		html += `<div class="content" onclick="setCurrentEnvironment(${i})">${arr[i][1]}`;
		if (i > 0) {
			html += `<span class="plus-btn" onclick="addZone(${i})">+</span><span class="role-indicator ${arr[i][2]}"></span>`;
		}
		html += `</div>`;
		if (i > 0) {
			html += `<label>Order</label><select id="current-environment" onChange="setEnvironmentOrder(event, ${i})">`;
			for (let j = 0; j < environments[i][0].length; j++) {
				html += `<option value="${j}">${j}</option>`;
			}
			html += `</select><label style="margin-left: 15px; color: red;" onclick="resetEnvironmentOnChange(${i})">Remove</label>`;
		}
	}
	roles.innerHTML = html;
}

function resetEnvironmentOnChange(index) {
	currentEnvironment = globalEnv[index][0];
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (environments[currentEnvironment][0][environmentOrder][i][j] && environments[currentEnvironment][0][environmentOrder][i][j] > 0) {
				environment[i][j] = 0;
			}
		}
	}
	environments[currentEnvironment][1][environmentOrder] = [];
	environments[currentEnvironment][0][environmentOrder] = [];
	if (environmentOrder > 0) {
		environmentOrder--;
		setEnvironmentOrder(environmentOrder, index, true);
	}
	renderEnvironments();
	updateTable(GRID_ROWS, GRID_COLS);
}

function addZone(index) {
	environments[globalEnv[index][0]][0].push([]);
	environmentOrder++;
	renderEnvironments();
}

function setCurrentRole(index) {
	currentRole = globalRoles[index][0];
	document.getElementById("selected-role").innerHTML = `<div class="content">${globalRoles[index][1]}</div>`;
}

function setCurrentEnvironment(index) {
	currentEnvironment = globalEnv[index][0];
	environmentOrder = 0;
	environments[0] = [[], []];
	document.getElementById("selected-environment").innerHTML = `<div class="content">${globalEnv[index][1]}</div>`;
}

function setEnvironmentOrder(event, index, simple) {
	currentEnvironment = globalEnv[index][0];
	environmentOrder = !simple ? Number(event.target.value) : environmentOrder;
	environments[0] = [[], []];
	document.getElementById("environment-order").innerHTML = `<div class="content">${!simple ? Number(event.target.value) : environmentOrder}</div>`;
}

function initControls() {
	renderRoles();
	renderEnvironments();
}

initControls();

function setUI(type, event) {
	if (type === "width") {
		GRID_COLS = Number(event.target.value);
	} else if (type === "height") {
		GRID_ROWS = Number(event.target.value);
	} else if (type === "speed") {
		GAME_SPEED = Number(event.target.value);
	}
	table = createTable(GRID_ROWS, GRID_COLS);
	grid = createGrid(GRID_ROWS, GRID_COLS);
	environment = createGrid(GRID_ROWS, GRID_COLS);
	nextGrid = createGrid(GRID_ROWS, GRID_COLS);
}

function getPopulationDensity() {
	const element = document.getElementById("population");
	let population = 0;
	for (let i = 0; i < GRID_ROWS; i++) {
		for (let j = 0; j < GRID_COLS; j++) {
			if (grid[i][j] > 0 && grid[i][j] < 6) {
				population++;
			}
		}
	}
	population = (population * 100) / (GRID_COLS * GRID_ROWS);
	element.innerHTML = `<div class="content">${population} %</div>`;
}
