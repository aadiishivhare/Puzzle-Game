 // A* Search Algorithm for finding the best optimal solution (Shortest path between 1 and null/empty tile)
 export const astar = (start, goal) => {
  // This will calculate the manhattan distance
  const manhattanDistance = (state) => {
    let distance = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== null) {
        const goalIndex = goal.indexOf(state[i]);
        const [currentRow, currentCol] = [Math.floor(i / 4), i % 4];
        const [goalRow, goalCol] = [Math.floor(goalIndex / 4), goalIndex % 4];
        distance += Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
      }
    }
    return distance; // The approach used is Heuristic function approach -->  
                     // This function provides an informed guess about how close a particular node is to the goal.
  };

// Expands neighbors of the current state
  const neighbors = (state) => {
    const emptyIndex = state.indexOf(null);
    const possibleMoves = [
      emptyIndex - 1, // left
      emptyIndex + 1, // right
      emptyIndex - 4, // up
      emptyIndex + 4  // down
    ].filter(index => index >= 0 && index < 16);

    return possibleMoves.map(move => {
      const newTiles = [...state];
      [newTiles[emptyIndex], newTiles[move]] = [newTiles[move], newTiles[emptyIndex]];
      return newTiles;
    });
  };

  const startState = { state: start, moves: [] };
  const openSet = [startState];
  const closedSet = new Set();
  
// Keeps track of visited states to avoid cycles.
  while (openSet.length > 0) {
    openSet.sort((a, b) => manhattanDistance(a.state) - manhattanDistance(b.state));
    const current = openSet.shift();

    if (JSON.stringify(current.state) === JSON.stringify(goal)) {
      return current.moves;
    }

    closedSet.add(JSON.stringify(current.state));

    for (const neighbor of neighbors(current.state)) {
      if (!closedSet.has(JSON.stringify(neighbor))) {
        openSet.push({ state: neighbor, moves: [...current.moves, neighbor] });
      }
    }
  }

  return null;
};
