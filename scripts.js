//player factory function 

const makePlayer = function(name, token) {
    const playerName = name;
    const playerToken = token;
    return {playerName, playerToken}
}

// gameBoard module 

const gameBoard = (function() {
    let boardArray = Array.from({length:9}, () => undefined)
    const addMove = function(squareNumber, token) {
        boardArray[squareNumber] = token;
    }
    return {
        boardArray, addMove
    }
})()

// main game controller 

const gameController = (function() {
    const boardContainer = document.getElementById("boardContainer");
    const renderBoard = function(){
        console.log(gameBoard.boardArray)
        gameBoard.boardArray.forEach(nodeMaker);
    }
    const nodeMaker = function(el, index) {
        if (!el) {
            console.log("here now")
            let emptyNode = document.createElement("div");
            emptyNode.setAttribute("data-square", index);
            emptyNode.classList.add("squareBox");
            boardContainer.appendChild(emptyNode);
        }
        else {
            let filledNode = document.createElement("div");
            filledNode.setAttribute("data-square", index);
            filledNode.classList.add("squareBox")
            filledNode.textContent = el;
            filledNode.appendChild(filledNode);
        }

    }
    return {renderBoard}
})()

gameController.renderBoard()
