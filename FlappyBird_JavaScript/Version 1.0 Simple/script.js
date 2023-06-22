document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
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
      const playerName = prompt('Game Over! Namen eintragen oder leer lassen:');
      if (playerName !== null) {
        let score1 = Math.floor(score / 60)
        saveHighscore(playerName, score1);
      }
      const playAgain = confirm('Nochmal versuchen?');
      if (playAgain) {
        location.reload();
      }
    }
  
    function saveHighscore(playerName, score1) {
      const highscoreTable = document.getElementById('highscore-table');
      const tbody = highscoreTable.getElementsByTagName('tbody')[0];
      const newRow = document.createElement('tr');
      const nameCell = document.createElement('td');
      const scoreCell = document.createElement('td');
      nameCell.textContent = playerName || 'Anonymous';
      scoreCell.textContent = score1;
      newRow.appendChild(nameCell);
      newRow.appendChild(scoreCell);
      tbody.appendChild(newRow);
    }
  
    function endGame() {
      displayHighscore();
      showGameOverMessage();
    }
  
    document.getElementById('reloadButton').addEventListener('click', function() {
      location.reload();
    });
    let highscores = [];

    function saveHighscore(playerName, score1) {
        highscores.push({ name: playerName, score1: score1 });
        highscores.sort((a, b) => b.score1 - a.score1);
        highscores.splice(5); 
        updateHighscoreTable();
        saveHighscoresLocally();
      }

      function resetHighscores() {
        if (confirm('Möchtest du wirklich alle Highscores löschen?')) {
          highscores = [
            { name: 'Player 1', score1: 0 },
            { name: 'Player 2', score1: 0 },
            { name: 'Player 3', score1: 0 },
            { name: 'Player 4', score1: 0 },
            { name: 'Player 5', score1: 0 }
          ];
          updateHighscoreTable();
          saveHighscoresLocally();
        }
      }
      
    
      function updateHighscoreTable() {
        const highscoreTable = document.getElementById('highscore-table');
        const tbody = highscoreTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
      
        for (const highscore of highscores) {
          const newRow = document.createElement('tr');
          const nameCell = document.createElement('td');
          const scoreCell = document.createElement('td');
          nameCell.textContent = highscore.name || 'Anonymous';
          scoreCell.textContent = highscore.score1;
          newRow.appendChild(nameCell);
          newRow.appendChild(scoreCell);
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
        highscores = Array.from({ length: 5 }, () => ({ name: 'Spieler', score1: 0 }));
        updateHighscoreTable();
        saveHighscoresLocally();
      }

  });
   