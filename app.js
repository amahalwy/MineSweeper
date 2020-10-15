document.addEventListener('DOMContentLoaded', () => {
  let grid = document.querySelector('.grid');
  // grid.classList.add('hidden');
  const remainingFlags = document.querySelector('#rem-flags');
  const result = document.querySelector('#result');
  const reset = document.querySelector('#reset');
  const newGame10 = document.querySelector('#new10');
  const newGame20 = document.querySelector('#new20');
  const newGame30 = document.querySelector('#new30');
  
  let flags = 0;
  // let bombs = (width * width)/5
  let squares = [];
  let isGameOver = false;
  
  // reset.addEventListener('click', resetBoard);

  newGame10.addEventListener('click', () => {
    grid.classList.add('game-10')
    // resetBoard();
    createBoard(10);
  });
  newGame20.addEventListener('click', () => {
    grid.classList.add('game-20')
    createBoard(20);
  });
  newGame30.addEventListener('click', () => {
    grid.classList.add('game-30')
    createBoard(30);
  });

  // function resetBoard(e) {
  //   // debugger
  //   // while (grid.firstElementChild) {
  //     // grid.removeEventListener('click', function(e) {
  //       //   leftClick(square);
  //       // })
  //       //   grid.removeChild(grid.lastElementChild);
  //       // }
  //   e.preventDefault();
  //   grid.classList.add('hidden');
  //   grid.classList.remove('show');
  //   grid.classList.remove('game-10');
  //   grid.classList.remove('game-20');
  //   grid.classList.remove('game-30');
  //   grid.textContent = '';
  //   result.innerHTML = '';
  //   console.log(isGameOver)
  //   isGameOver = false;
  // }

  // Create Board
  function createBoard(n) {
    grid.classList.remove('hidden');
    grid.classList.add('game-10');
    width = n;
    bombs = (width*width)/5;
    remainingFlags.innerHTML = bombs;

    const bombsArr = Array(bombs).fill('bomb');
    const emptyArr = Array(width * width - bombs).fill('valid');
    const gameArray = emptyArr.concat(bombsArr);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5); // Random shuffle the array

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i])
      grid.appendChild(square);
      squares.push(square);

      // Left click listener
      square.addEventListener('click', () => {
        leftClick(square);
      })

      // Right click listener
      square.oncontextmenu = function(e) {
        e.preventDefault();
        addFlag(square);
      }
    }

    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeft = (i % width === 0); // Left edge square
      const isRight = (i % width === width - 1); // Right edge square
      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeft && squares[i - 1].classList.contains('bomb')) total ++; // Top row, check if bomb left of spot
        if (i > 9 && !isRight && squares[i + 1 - width].classList.contains('bomb')) total ++; // Second row, check if bomb
        if (i > 10 && squares[i - width].classList.contains('bomb')) total ++; // Check up 1
        if (i > 11 && !isLeft && squares[i - 1 - width].classList.contains('bomb')) total ++; //Check up 1, left 1 
        if (i < 98 && !isRight && squares[i + 1].classList.contains('bomb')) total ++; // Check right 1 
        if (i < 90 && !isLeft && squares[i - 1 + width].classList.contains('bomb')) total ++; // Check down 1, left 1
        if (i < 88 && !isRight && squares[i + 1 + width].classList.contains('bomb')) total ++; // Check down 1, right 1
        if (i < 89 && squares[i + width].classList.contains('bomb')) total ++; // Check down 1 
        squares[i].setAttribute('data', total);
      }
    }
  }


  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && (flags < bombs)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩';
        flags ++;
        remainingFlags.innerHTML = bombs - flags
        checkWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags --;
        remainingFlags.innerHTML = bombs - flags
      }
    }
  }

  // Left click on square
  function leftClick(square) {
    let id = square.id;
    if (isGameOver) return;
    if (
    square.classList.contains('checked') || 
    square.classList.contains('flag')
    ) return;

    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      let totalBombs = square.getAttribute('data');
      if (totalBombs != 0 ) {
        square.classList.add('checked');
        square.innerHTML = totalBombs;
        return;
      }
      check(square, id);
    }
    square.classList.add('checked');
  }


  // Check squares beside the clicked square
  function check(square, id) {
    const isLeft = (id % width === 0);
    const isRight = (id % width === width - 1);

    setTimeout(() => {
      if (id > 0 && !isLeft) {
        const newId = squares[parseInt(id) -1].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id > 9 && !isRight) {
        const newId = squares[parseInt(id) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id > 10) {
        const newId = squares[parseInt(id - width)].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id > 11 && !isLeft) {
        const newId = squares[parseInt(id) -1 - width].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id < 98 && !isRight) {
        const newId = squares[parseInt(id) +1].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id < 90 && !isLeft) {
        const newId = squares[parseInt(id) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id < 88 && !isRight ) {
        const newId = squares[parseInt(id) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

      if (id < 89) {
        const newId = squares[parseInt(id) + width].id;
        const newSquare = document.getElementById(newId);
        leftClick(newSquare);
      }

    }, 10)
  }

  function gameOver(square) {
    result.innerHTML = "BOOM!! Game over :("
    isGameOver = true;

    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = "💣'";
        square.classList.remove('bomb');
        square.classList.add('checked');
      }
    })
  }

  function checkWin() {
    let bombsFound = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        bombsFound ++;
      }
      if (bombsFound === bombs) {
        result.innerHTML = "YOU WIN!";
        isGameOver = true;
      }
    }
  }
})










// const rows = 4;
// const columns = 20;
// let mines, remaining, revealed;
// let status = document.getElementById('grid');
// status.addEventListener('click', init)
 
// let board = new Array(rows);
// let picture = new Array(rows);
// let tile = new Array(rows);
// for (let i = 0; i < board.length; i++) {
//   board[i] = new Array(columns);
//   picture[i] = new Array(columns);
//   tile[i] = new Array(columns)
// }
 
// init();
 
// function check(row, column) {
//   if (column >= 0 && row >= 0 && column < columns && row < rows)
//     return board[row][column];
// }
 
// function init() {
//   mines = 5;
//   remaining = mines;
//   revealed = 0;
//   status.innerHTML = 'Click on the tiles to reveal them';
//   for (let row = 0; row < rows; row++)
//     for (let column = 0; column < columns; column++) {
//       let index = row * columns + column;
//       tile[row][column] = document.createElement('img');
//       tile[row][column].src = 'hidden.png';
//       tile[row][column].style = 'position:absolute;height:30px; width: 30px';
//       tile[row][column].style.top = 150 + row * 30;
//       tile[row][column].style.left = 50 + column * 30;
//       tile[row][column].addEventListener('mousedown', click);
//       tile[row][column].id = index;
//       document.body.appendChild(tile[row][column]);
//       picture[row][column] = 'hidden';
//       board[row][column] = '';
//     }
 
//   let placed = 0;
//   while (placed < mines) {
//     let column = Math.floor(Math.random() * columns);
//     let row = Math.floor(Math.random() * rows);
 
//     if (board[row][column] != 'mine') {
//       board[row][column] = 'mine';
//       placed++;
//     }
//   } 
 
//   for (let column = 0; column < columns; column++)
//     for (let row = 0; row < rows; row++) {
//       if (check(row, column) != 'mine') {
//         board[row][column] =
//           ((check(row + 1, column) == 'mine') | 0) +
//           ((check(row + 1, column - 1) == 'mine') | 0) +
//           ((check(row + 1, column + 1) == 'mine') | 0) +
//           ((check(row - 1, column) == 'mine') | 0) +
//           ((check(row - 1, column - 1) == 'mine') | 0) +
//           ((check(row - 1, column + 1) == 'mine') | 0) +
//           ((check(row, column - 1) == 'mine') | 0) +
//           ((check(row, column + 1) == 'mine') | 0);
//       }
//     }
// }
 
// function click(event) {
//   let source = event.target;
//   let id = source.id;
//   let row = Math.floor(id / columns);
//   let column = id % columns;
 
//   if (event.which == 3) {
//     switch (picture[row][column]) {
//       case 'hidden':
//         tile[row][column].src = 'flag.png';
//         remaining--;
//         picture[row][column] = 'flag';
//         break;
//       case 'flag':
//         tile[row][column].src = 'question.png';
//         remaining++;
//         picture[row][column] = 'question';
//         break;
//       case 'question':
//         tile[row][column].src = 'hidden.png';
//         picture[row][column] = 'hidden';
//         break;
//     }
//     event.preventDefault();
//   }
//   status.innerHTML = 'Mines remaining: ' + remaining;
 
//   if (event.which == 1 && picture[row][column] != 'flag') {
//     if (board[row][column] == 'mine') {
//       for (let row = 0; row < rows; row++)
//         for (let column = 0; column < columns; column++) {
//           if (board[row][column] == 'mine') {
//             tile[row][column].src = 'mine.png';
//           }
//           if (board[row][column] != 'mine' && picture[row][column] == 'flag') {
//             tile[row][column].src = 'misplaced.png';
//           }
//         }
//       status.innerHTML = 'GAME OVER<br><br>Click here to restart';
//     } else
//     if (picture[row][column] == 'hidden') reveal(row, column);
//   }
 
//   if (revealed == rows * columns - mines)
//     status.innerHTML = 'YOU WIN!<br><br>Click here to restart';
// }
 
// function reveal(row, column) {
//   tile[row][column].src = board[row][column] + '.png';
//   if (board[row][column] != 'mine' && picture[row][column] == 'hidden')
//     revealed++;
//   picture[row][column] = board[row][column];
 
//   if (board[row][column] == 0) {
//     if (column > 0 && picture[row][column - 1] == 'hidden') reveal(row, column - 1);
//     if (column < (columns - 1) && picture[row][+column + 1] == 'hidden') reveal(row, +column + 1);
//     if (row < (rows - 1) && picture[+row + 1][column] == 'hidden') reveal(+row + 1, column);
//     if (row > 0 && picture[row - 1][column] == 'hidden') reveal(row - 1, column);
//     if (column > 0 && row > 0 && picture[row - 1][column - 1] == 'hidden') reveal(row - 1, column - 1);
//     if (column > 0 && row < (rows - 1) && picture[+row + 1][column - 1] == 'hidden') reveal(+row + 1, column - 1);
//     if (column < (columns - 1) && row < (rows - 1) && picture[+row + 1][+column + 1] == 'hidden') reveal(+row + 1, +column + 1);
//     if (column < (columns - 1) && row > 0 && picture[row - 1][+column + 1] == 'hidden') reveal(row - 1, +column + 1);
//   }
// }