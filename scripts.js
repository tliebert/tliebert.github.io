//player factory function 

const makePlayer = function(name, token) {
    const playerName = name;
    const playerToken = token;
    return {playerName, playerToken}
}

// form entry

const playerForm = (function(){
    const resetForm = function (){}
    const submitForm = function (){}
})()

// gameBoard module 

const gameBoard = (function() {
    let boardArray = Array.from({length:9}, () => undefined);

    const addMove = function(squareNumber) {
        boardArray[squareNumber] = players.getActive().token;
        players.switchActive();
        gameController.renderBoard();
    }

    return {
        boardArray, addMove
    }
})()

//Player creation and active player control 

const players = (function(){
    let playerList = [];

    const playerIconHTML = {
        x: `<i class="fas fa-times"></i>`,
        o: `<i class="far fa-circle"></i>`,
        heart: `<i class="far fa-heart"></i>`,
        cowboy: `<i class="fas fa-hat-cowboy-side"></i>`,
    }

    let activePlayer = playerList[0]

    const getActive = function() {
        return activePlayer
    }

    const switchActive = function(){
        if (activePlayer === playerList[0]) {
            activePlayer = playerList[1];
        }
        else {
            activePlayer = playerList[0];
        }
        return activePlayer
    };

    const makePlayer = function(name, token) {
        playerList.push({name, token})
    }

    const returnActiveTokenIcon = function () {

    }

    return {switchActive, makePlayer, getActive, returnActiveTokenIcon, playerList}
})()

//

const scoreboard = (function() {
    const textInputs = document.querySelectorAll('input')
    return {
        textInputs
    }
    
})()

// main game controller 

const gameController = (function() {

    const boardContainer = document.getElementById("boardContainer");

    const renderBoard = function(){
        removeChildren(boardContainer)
        gameBoard.boardArray.forEach(addNode);
    }

    const removeChildren = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    const addNode = function(el, indexInArray) {
        if (!el) {
            let emptyNode = document.createElement("div");
            appendNodeToContainer(emptyNode, boardContainer, indexInArray)
        }
        else {
            let filledNode = document.createElement("div");
            filledNode.textContent = players.playerIconHTML[(players.getActive().token)]
            appendNodeToContainer(filledNode, boardContainer, indexInArray);
        }

    }

    const appendNodeToContainer = function(node, container, index) {
        node.setAttribute("data-square", index);
        node.classList.add("squareBox");
        addListener(node);
        container.appendChild(node);
    }

    const addListener = function(node) {
        const selectedSquare = node.getAttribute("data-square");
        node.addEventListener("click", gameBoard.addMove.bind(gameBoard, selectedSquare));
    }


    return {renderBoard}
})()

gameController.renderBoard()

