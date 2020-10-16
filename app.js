document.addEventListener('DOMContentLoaded', () => {
  let grid = document.querySelector('.grid');
  const remainingFlags = document.querySelector('#rem-flags');
  const result = document.querySelector('#result');
  const reset = document.querySelector('#reset');
  const newGame10 = document.querySelector('#new10');
  const newGame20 = document.querySelector('#new20');
  const newGame30 = document.querySelector('#new30');
  
  function createGame10() {
    grid.classList.add('game-10')
    createBoard(10);
  }
  
  function createGame20() {
    grid.classList.add('game-20')
    createBoard(20);
  }
  
  function createGame30() {
    grid.classList.add('game-30')
    createBoard(30);
  }
  
  // Removing listeners
  function removeLists() {
    newGame10.removeEventListener('click', createGame10);
    newGame10.classList.add('disabled');
    newGame20.removeEventListener('click', createGame20);
    newGame20.classList.add('disabled');
    // newGame30.removeEventListener('click', createGame30);
    // newGame30.classList.add('disabled');
  }
  
  // Adding listeners
  function addLists(){
    newGame10.addEventListener('click', createGame10);
    newGame10.classList.remove('disabled');
    newGame20.addEventListener('click', createGame20);
    newGame20.classList.remove('disabled');
    // newGame30.addEventListener('click', createGame30);
    // newGame30.classList.remove('disabled');
  }
  
  // reset.addEventListener('click', () => {
  //   resetBoard();
  //   setTimeout(()=>{

  //     createBoard(10);
  //   },1000)
  // });
  reset.addEventListener('click', refreshPage);


  addLists();

  // Global variables for function(s) use
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  
  function refreshPage() {
    location = location;
    return false;
  }

  // function resetBoard() {
  //   const newGrid = document.createElement('div');
  //   newGrid.classList.add('grid');
  //   newGrid.classList.add('hidden');    
  //   grid.parentNode.replaceChild(newGrid, grid);
  //   grid = document.querySelector('.grid');
  //   isGameOver = false;
  //   addLists();
  //   location = location;
  //   return false;
  // }

  // Create Board
  function createBoard(n) {
    grid.classList.remove('hidden');
    removeLists();

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
    
    // if (width === 10) alert("Welcome to a 10x10 Game!!")
    // if (width === 20) alert("Welcome to a 20x20 Game!!")
    // if (width === 10) alert("Welcome to a 10x10 Game!!")
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeft = (i % width === 0); // Left edge square
      const isRight = (i % width === width - 1); // Right edge square

      // This is valid for 10x10 game; needs work for 20x20 and 30x30
      if (squares[i].classList.contains('valid') && width === 10) {
        if (i > 0 && !isLeft && squares[i - 1].classList.contains('bomb')) total ++; // Top row, check if bomb left of spot
        if (i > 9 && !isRight && squares[i + 1 - width].classList.contains('bomb')) total ++; // Second row, check up 1, right 1
        if (i > 10 && squares[i - width].classList.contains('bomb')) total ++; // Check up 1
        if (i > 11 && !isLeft && squares[i - 1 - width].classList.contains('bomb')) total ++; //Check up 1, left 1 
        if (i < 98 && !isRight && squares[i + 1].classList.contains('bomb')) total ++; // Check right 1 
        if (i < 90 && !isLeft && squares[i - 1 + width].classList.contains('bomb')) total ++; // Check down 1, left 1
        if (i < 88 && !isRight && squares[i + 1 + width].classList.contains('bomb')) total ++; // Check down 1, right 1
        if (i < 89 && squares[i + width].classList.contains('bomb')) total ++; // Check down 1 
        squares[i].setAttribute('data', total);
      } else if (squares[i].classList.contains('valid') && width === 20) {
        // 20x20 Game
        if (i > 0 && !isLeft && squares[i - 1].classList.contains('bomb')) total ++; // Top row, check if bomb left of spot
        if (i > 19 && !isRight && squares[i + 1 - width].classList.contains('bomb')) total ++; // Second row, check up 1, right 1
        if (i > 20 && squares[i - width].classList.contains('bomb')) total ++; // Check up 1
        if (i > 21 && !isLeft && squares[i - 1 - width].classList.contains('bomb')) total ++; //Check up 1, left 1 
        if (i < 388 && !isRight && squares[i + 1].classList.contains('bomb')) total ++; // Check right 1 
        if (i < 380 && !isLeft && squares[i - 1 + width].classList.contains('bomb')) total ++; // Check down 1, left 1
        if (i < 378 && !isRight && squares[i + 1 + width].classList.contains('bomb')) total ++; // Check down 1, right 1
        if (i < 379 && squares[i + width].classList.contains('bomb')) total ++; // Check down 1 
        squares[i].setAttribute('data', total);
      } else if (squares[i].classList.contains('valid') && width === 30) {
        // 30x30 Game
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
      if (totalBombs != 0) {
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
    if (width === 20) {
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
  
        if (id < 388 && !isRight) {
          const newId = squares[parseInt(id) +1].id;
          const newSquare = document.getElementById(newId);
          leftClick(newSquare);
        }
  
        if (id < 380 && !isLeft) {
          const newId = squares[parseInt(id) - 1 + width].id;
          const newSquare = document.getElementById(newId);
          leftClick(newSquare);
        }
  
        if (id < 378 && !isRight ) {
          const newId = squares[parseInt(id) + 1 + width].id;
          const newSquare = document.getElementById(newId);
          leftClick(newSquare);
        }
  
        if (id < 379) {
          const newId = squares[parseInt(id) + width].id;
          const newSquare = document.getElementById(newId);
          leftClick(newSquare);
        }
  
      }, 10)
    } else if (width === 10) {
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