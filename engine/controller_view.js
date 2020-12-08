import Game from "./game.js";

let game = new Game(4);

$(".reset").on("click", handleResetButtonPress);

function renderGame() {
    $(".score").replaceWith(`<p class="score subtitle"><strong>Score: </strong>${game.gameState.score}</p>`)

    if (game.gameState.won) {
        $(".message").replaceWith(`<div class="message notification is-primary is-light">
        You Won! 
        <br> 
        Press the Reset Button To Play Again!</div>`);
    } else if (game.gameState.over) {
        $(".message").replaceWith(`<div class="message notification is-danger is-light">
        You Lost!
        <br>
        Press the Reset Button to Start Over!</div>`);
    }

    for (let i=0; i < game.gameState.board.length; i++){
        if (game.gameState.board[i] == 0) {
            $(`.${i+1}`).replaceWith(`<td class="${i+1}"><br></td>`);
        } else {
            $(`.${i+1}`).replaceWith(`<td class="${i+1}">${game.gameState.board[i]}</td>`);
        }
    }
}

renderGame();

function handleResetButtonPress() {
    $(".message").replaceWith(`<p class = "message"></p>`);
    game.setupNewGame();
    renderGame();
}
    
$(document).on("keydown", function(event) {
    event.preventDefault();
    if (event.keyCode == '38') {
        game.move('up');
        renderGame() 
    }
    if (event.keyCode == '40') {
        game.move('down');
        renderGame()
    }
    if (event.keyCode == '39') {
        game.move('right');
        renderGame()
    }
    if (event.keyCode == '37') {
        game.move('left');
        renderGame()
    }
});