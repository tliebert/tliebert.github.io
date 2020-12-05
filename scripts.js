//player factory function 

const makePlayer = function(name, token) {
    const playerName = name;
    const playerToken = token;
    return {playerName, playerToken}
}

// gameBoard module 

const gameBoard = (function() {
    let boardArray = Array.from({length:9}, () => undefined)
    const addMove = function(squareNumber) {
        boardArray[squareNumber] = x;
    }
    return {
        boardArray, addMove
    }
})()

//demo players

// main game controller 

const gameController = (function() {

    const boardContainer = document.getElementById("boardContainer");

    const renderBoard = function(){
        console.log(gameBoard.boardArray)
        gameBoard.boardArray.forEach(addNode);
    }

    const appendNodeToContainer = function(node, container, index) {
        node.setAttribute("data-square", index);
        node.classList.add("squareBox");
        container.appendChild(node);
    }

    const addEvent = function(node) {
        const selectedSquare = node.dataset.dataSquare;
        const playerToken = 
        node.addEventListener("click", gameBoard.addMove.bind(gameBoard, selectedSquare))
    }

    const addNode = function(el, indexInArray) {
        if (!el) {
            let emptyNode = document.createElement("div");
            appendNodeToContainer(emptyNode, boardContainer, indexInArray)
        }
        else {
            let filledNode = document.createElement("div");
            filledNode.textContent = el;
            appendNodeToContainer(filledNode, boardContainer, indexInArray);
        }

    }
    return {renderBoard}
})()

gameController.renderBoard()

