console.log("Hello from the dark side, we have cookies :D")

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let selectedDifficultyText = '';
    let difficultyLevel = localStorage.getItem('difficultyLevel') || 1;
    let canvasWidth = localStorage.getItem('canvasWidth') || getCanvasWidth(difficultyLevel);
    
    function getCanvasWidth(difficultyLevel) {
      switch (difficultyLevel) {
        case 1:
          return 936;
        case 2:
          return 768;
        case 3:
          return 480;
        case 4:
          return 360;
        default:
          return 936;
      }
    }
  
    const difficultyButton = document.getElementById('difficultyButton');
  
    updateDifficulty(difficultyLevel, canvasWidth);
  console.log("ausgewählte Schwierigkeit: " + difficultyLevel);
  function updateDifficulty(level, width) {
    difficultyLevel = level;
    canvasWidth = width;
  
    localStorage.setItem('difficultyLevel', difficultyLevel);
    localStorage.setItem('canvasWidth', canvasWidth);
  
    switch (difficultyLevel) {
      case 1:
        difficultyDisplay.textContent = 'Easy';
        selectedDifficulty = 1;
        selectedDifficultyText = 'Easy';
        break;
      case 2:
        difficultyDisplay.textContent = 'Medium';
        selectedDifficulty = 2;
        selectedDifficultyText = 'Medium';
        break;
      case 3:
        difficultyDisplay.textContent = 'Hardcore';
        selectedDifficulty = 3;
        selectedDifficultyText = 'Hardcore';
        break;
      case 4:
        difficultyDisplay.textContent = 'Insane';
        selectedDifficulty = 4;
        selectedDifficultyText = 'Insane';
        break;
      default:
        difficultyDisplay.textContent = '';
        selectedDifficultyText = '';
        break;
    }
  
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
  }
  
  
  difficultyButton.addEventListener('click', function() {
    const newDifficulty = parseInt(prompt(' Wählen Sie den Schwierigkeitsgrad (1-4).\n Nach Wahl der Schwierigkeit einmal "Neu laden" klicken:'), 10);
    if (newDifficulty >= 1 && newDifficulty <= 4) {
      switch (newDifficulty) {
        case 1:
          updateDifficulty(1, 936);
          break;
        case 2:
          updateDifficulty(2, 768);
          break;
        case 3:
          updateDifficulty(3, 480);
          break;
        case 4:
          updateDifficulty(4, 360);
          break;

      }
    } else {
      alert('Ungültige Eingabe!');
    }
    location.reload()
  });
  
  updateDifficulty(difficultyLevel, canvasWidth);
  
  function saveHighscore(playerName, score1, difficultyLevel) {
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
  
    const highscoreEntry = {
      playerName: playerName,
      score: score1,
      selectedDifficulty: difficultyLevel,
    }
  
    highscores.push(highscoreEntry);
  
    highscores.sort((a, b) => b.score - a.score); 
    highscores.splice(5); 
  
    localStorage.setItem('highscores', JSON.stringify(highscores));
  
    updateHighscoreTable();
  }
  
  
          
      const screenWidth = canvas.clientWidth;
      const screenHeight = canvas.clientHeight;
    
      let gameStarted = false;
      let animationFrameHandle = 0;
    
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }
    
      const pipes = [];
      const pipeCount = 3;
      for (let i = 0; i < pipeCount; i++) {
        pipes.push({
          x: screenWidth + i * (screenWidth + 50) / pipeCount,
          width: 50,
          holeHeight: 150,
          level: getRandomInt(1, 7),
          speed: -3,
        draw() {
          const [upperHeight, lowerHeight] = this.getPipeHeights();
          const heights = this.getPipeHeights();
  
          ctx.fillStyle = "green";
          ctx.fillRect(this.x, 0, this.width, heights[0]);
          ctx.fillRect(this.x - 10, heights[0] - 20, this.width + 20, 20);
          ctx.fillRect(this.x, screenHeight - heights[1], this.width, heights[1]);
          ctx.fillRect(this.x - 10, screenHeight - heights[1], this.width + 20, 20);
        },
        update() {
          this.x += this.speed;
          if (this.x < -this.width) {
            this.x = screenWidth;
            this.level = getRandomInt(1, 7);
          }
        },
        getPipeHeights() {
          const upperHeight = 100 + 40 * this.level;
          const lowerHeight = screenHeight - (upperHeight + this.holeHeight);
  
          return [upperHeight, lowerHeight];
        },
        getPipes() {
          const [upperHeight, lowerHeight] = this.getPipeHeights();
  
          return [{
              x1: this.x,
              y1: 0,
              x2: this.x + this.width,
              y2: upperHeight
            },
            {
              x1: this.x,
              y1: screenHeight - lowerHeight,
              x2: this.x + this.width,
              y2: screenHeight
            }
          ];
        }
      });
    }
  
    const bird = {
      x: 150,
      y: 200,
      speed: 0,
      radius: 20,
      gravity: 0.4,
      flapForce: -7,
  
      checkOverlap(X1, Y1, X2, Y2) {
        let Xn = Math.max(X1, Math.min(this.x, X2));
        let Yn = Math.max(Y1, Math.min(this.y, Y2));
        let Dx = Xn - this.x;
        let Dy = Yn - this.y;
        return (Dx * Dx + Dy * Dy) <= this.radius * this.radius;
      },
      flap() {
        if (this.y <= 0) return;
        this.speed = this.flapForce;
      },
      update() {
        this.speed += this.gravity;
        this.y += this.speed;
      },
      draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x - 15, this.y - 5, 12, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x + 7, this.y - 5, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y - 6, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x - 20, this.y + 5, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x + 22, this.y + 10, 10, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 10, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    };
  
    document.addEventListener(
      'keydown',
      function(event) {
        if (!gameStarted) {
          gameStarted = true;
          animationFrameHandle = window.requestAnimationFrame(loop);
        }
        bird.flap();
      },
      false
    );
  
    let score = 0;
    ctx.fillStyle = 'red';
    ctx.font = "bold 48px Arial italic"
    ctx.fillText(Math.floor(score / 60), 80, 50);
  
    bird.draw();
  
    function loop() {
      ctx.clearRect(0, 0, screenWidth, screenHeight);
  
      bird.update();
      bird.draw();
  
      for (let i = 0; i < pipeCount; i++) {
        pipes[i].draw();
        pipes[i].update();
  
        const upperLowerPipe = pipes[i].getPipes();
  
        const upperPipe = upperLowerPipe[0];
        const lowerPipe = upperLowerPipe[1];
  
        if (bird.checkOverlap(upperPipe.x1, upperPipe.y1, upperPipe.x2, upperPipe.y2) ||
          bird.checkOverlap(lowerPipe.x1, lowerPipe.y1, lowerPipe.x2, lowerPipe.y2) ||
          bird.y > screenHeight) {
          window.cancelAnimationFrame(animationFrameHandle);
          animationFrameHandle = undefined;
  
          endGame();
  
          return;
        }
      }
  
      score++;
      ctx.fillStyle = 'red';
      ctx.fillText(Math.floor(score / 60), 80, 50);
  
      animationFrameHandle = window.requestAnimationFrame(loop);
    }
  
    function displayHighscore() {
      const highscoreContainer = document.getElementById('highscore-container');
      highscoreContainer.style.display = 'block';
    }
  
    function showGameOverMessage() {
      const selectedDifficulty = difficultyLevel; 
      const playerName = prompt('Game Over! Name hier eingeben oder leer lassen:');
      if (playerName !== null) {
        let score1 = Math.floor(score / 60);
        let difficultyLevel = selectedDifficulty;
        saveHighscore(playerName, score1, difficultyLevel);
      }
      const playAgain = confirm('Erneut spielen?');
      if (playAgain) {
        location.reload();
      }
    }
    
    function endGame() {
      displayHighscore();
      showGameOverMessage();
    }
  
    document.getElementById('reloadButton').addEventListener('click', function() {
      location.reload();
    });
    let highscores = [];

    function saveHighscore(playerName, score1, difficultyLevel) {
      const highscoreEntry = {
        name: playerName,
        score1: score1,
        difficultyLevel: difficultyLevel
      };
      highscores.push(highscoreEntry);
      highscores.sort((a, b) => b.score1 - a.score1);
      highscores.splice(5);
      updateHighscoreTable();
      saveHighscoresLocally();
    }  
    
      function updateHighscoreTable() {
        const highscoreTable = document.getElementById('highscore-table');
        const tbody = highscoreTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
      
        for (const highscore of highscores) {
          const newRow = document.createElement('tr');
          const nameCell = document.createElement('td');
          const scoreCell = document.createElement('td');
          const difficultyCell = document.createElement ('td');
          nameCell.textContent = highscore.name || 'Anonymous';
          scoreCell.textContent = highscore.score1;
          difficultyCell.textContent = highscore.difficultyLevel;
          newRow.appendChild(nameCell);
          newRow.appendChild(scoreCell);
          newRow.appendChild(difficultyCell);
          tbody.appendChild(newRow);

        }
      }
      
   
    function saveHighscoresLocally() {
      localStorage.setItem('highscores', JSON.stringify(highscores));
    }
    
    function loadHighscoresLocally() {
      const savedHighscores = localStorage.getItem('highscores');
      if (savedHighscores) {
        highscores = JSON.parse(savedHighscores);
        updateHighscoreTable();
      }
    }

    loadHighscoresLocally();

    document.getElementById('deleteHighscoresButton').addEventListener('click', function() {
        const confirmDelete = confirm('Möchten Sie wirklich alle Highscores löschen?');
        if (confirmDelete) {
          resetHighscores();
        }
      });
      
      function resetHighscores() {
        highscores = Array.from({ length: 5 }, () => ({ name: 'Spieler', score1: 0 , difficultyLevel: 0 }));
        updateHighscoreTable();
        saveHighscoresLocally();
      }

  });
   

