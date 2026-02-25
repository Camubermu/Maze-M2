// Generación del laberinto DFS (permitido: derecha, izquierda, abajo)
export function generateMaze(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        row: i, col: j,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      };
    }
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function dfs(cell){
    cell.visited = true;
    let dirs = [];
    if (cell.col < cols-1) dirs.push('right');
    if (cell.col > 0)     dirs.push('left');
    if (cell.row < rows-1)dirs.push('down');
    shuffle(dirs).forEach(dir=>{
      let next;
      if (dir==='right') next = grid[cell.row][cell.col+1];
      if (dir==='left')  next = grid[cell.row][cell.col-1];
      if (dir==='down')  next = grid[cell.row+1][cell.col];
      if (!next.visited){
        if (dir==='right'){ cell.walls.right=false; next.walls.left=false; }
        if (dir==='left'){  cell.walls.left=false;  next.walls.right=false; }
        if (dir==='down'){  cell.walls.bottom=false;next.walls.top=false; }
        dfs(next);
      }
    });
  }

  dfs(grid[0][0]);
  return grid;
}
