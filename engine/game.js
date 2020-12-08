
export default class Game {
    
    constructor(size) {
        this.size = size;
        this.moveListeners = [];
        this.winListeners = [];
        this.loseListeners = [];
        this.gameState = {
            board: new Array((this.size)*(this.size)).fill(0),
            score: 0,
            won: false,
            over: false
        }
        this.setupNewGame();
    }

    // Initializes or resets game with two random tiles added to the otherwise empty board.
    setupNewGame() {
        this.gameState.board.fill(0);
        this.addRandomTile();
        this.addRandomTile();
        this.gameState.score=0;
        this.gameState.won = false;
        this.gameState.over = false;
    };

    loadGame(gameState) {
        this.gameState = gameState;
    };

    addRandomTile() {
        let rand_num = Math.floor(Math.random() * (this.size*this.size));
        let added = false;

        // add random tile to board with value 90% chance of being a 2 and 10% chance of being a 4
        for (let i = rand_num; i>=0; i--){
            if (this.gameState.board[i] == 0 && added==false){
                if ((Math.floor(Math.random()*10)) < 9) {
                    this.gameState.board[i] = 2;
                } else  {
                    this.gameState.board[i] = 4;
                }
                added=true;
            }
        }
        if (added==false) {
            for (let i = rand_num; i<this.gameState.board.length; i++) {
                if (this.gameState.board[i] == 0 && added==false){
                    if ((Math.floor(Math.random()*10)) < 9) {
                        this.gameState.board[i] = 2;
                    } else  {
                        this.gameState.board[i] = 4;
                    }
                    added=true;
                }
            }
        }
    };

    

    move(direction) {
        let prevBoard = this.gameState.board;
        let game_array = [];
        let game_array_copy = [];
        let reversed = false;
        
        if(direction == "up" || direction == "down") {
            for(let i = 0; i < this.size; i++) {
                game_array[i] = [];
                for(let j = 0; j < this.size; j++) {
                    game_array[i][j] = this.gameState.board[(j*this.size) + i];
                }
            }
            if(direction == "up") {
                for(let i = 0; i < this.size; i++){
                    game_array[i].reverse();
                }
                reversed = true;
            }
        } else if (direction == "left" || direction == "right") {
            for(let i = 0; i < this.size; i++) {
                game_array[i] =  this.gameState.board.slice(i*this.size, (i+1)*this.size);
            }
            if(direction == "left") {
                for(let i = 0; i < this.size; i++){
                    game_array[i].reverse();
                }
                reversed = true;
            }
        }
        
        for(let i = 0; i < this.size; i++) {
            game_array[i] = this.slide(game_array[i]);
            game_array[i] = this.collapse(game_array[i]);
            game_array[i] = this.slide(game_array[i]);
        }
        
        if(reversed) {
            for(let i = 0; i < this.size; i++){
                game_array[i].reverse();
            }
        }

        // copy game state into game_array_copy
        if(direction == "up" || direction == "down") {
            for(let i = 0; i < this.size; i++) {
                for(let j = 0; j < this.size; j++) {
                    game_array_copy.push(game_array[j][i]);
                }
            }
        } else if (direction == "left" || direction == "right") {
            for (let i = 0; i < this.size; i++) {
                game_array_copy = game_array_copy.concat(game_array[i]);
            }
        }
  
        // save this game state board
        this.gameState.board = game_array_copy;

        // place a random tile, if move made was "legal"
        if (this.gameState.board != prevBoard) { 
            this.addRandomTile();
        }

        // check for 2048 on the board, mark game as 'won' accordingly
        for (let i = 0; i < this.gameState.board.length; i++) {
          if (this.gameState.board[i] >= 2048) {
            this.gameState.won = true;
          } 
        }

        if (this.checkGameOver(game_array_copy) && !this.gameState.won) {
          this.loseListeners.forEach(callback => callback(this.gameState));
        }

        if(this.gameState.won) {
          this.winListeners.forEach(callback => callback(this.gameState));
        }
        
        for (let i = 0; i < this.moveListeners.length; i++) {
          this.moveListeners.forEach(callback => callback(this.gameState));
        }
      }


    slide(row) {
        let array = row.filter(val => val);
        let empty = this.size - array.length;
        let empties_array = Array(empty).fill(0);
        array = empties_array.concat(array);
        return array;
    };

    collapse(row) {
        for (let i = this.size-1; i >= 1; i--) {
            let current = row[i];
            let prev = row[i - 1];
            if (current == prev) {
                //collapse the tiles into one
                row[i] = current + prev;
                row[i-1] = 0;
                //update the score
                this.gameState.score += (current + prev);

                //check for win
                if ((current + prev) >= 2048) {
                    this.gameState.won = true;
                }
            }
        }
        return row;
    }

    // for testing purposes
    toString() {
        let s='';
        for (let i = 0; i < this.gameState.board.length; i++){
            if (i & this.size == 0) {
                s+= '\n'
            }
            s+= this.gameState.board[i] + ' '
        }
        s+= '\n' + 'Score: ' + this.gameState.score + '\n'
        s+= '\n' + 'Won: ' + this.gameState.won + '| Over: ' + this.gameState.over
        return s;
    }

    onMove(callback) {
        this.moveListeners.push(callback);
    }

    onWin(callback) {
        this.winListeners.push(callback);
    }

    onLose(callback) {
        this.loseListeners.push(callback);
    }

    getGameState(){
        return this.gameState;
    }


    checkGameOver(arr) {
        if (this.gameState.win == true) {
            this.gameState.over = true;
            return true;
        }
        for (let i = 0; i < (this.size*this.size)-this.size; i++) {

            // mark game as not over if there are any collapses (i.e. two same value tiles) left anywhere on top rows of board 
            if ( ((i+1) % this.size) != 0 ) { 
                if(arr[i] == arr[i+1]) {
                    return false;
                }
            }

            if(arr[i] == arr[i+this.size]) {
                return false;
            }

            // mark game as not over if there is any room for slides on board (i.e. empty spaces left on board)
            if(arr[i] == 0 || arr[i+this.size] == 0) {
                return false;
            }
            
        }

         // mark game as not over if there are any collapses left on last row of board
        for (let i = (this.size*this.size)-this.size; i < (this.size*this.size)-1; i++) {
            if(arr[i] == arr[i+1]) {
                return false;
            }
        }
        this.gameState.over = true;
        return true;
    }

}

