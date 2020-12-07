//player factory function 

const makePlayer = function(name, token) {
    const playerName = name;
    const playerToken = token;
    return {playerName, playerToken}
}

// form entry. Horrifying, but will refactor later when I can actually submit a backend POST

const playerForm = (function(){
    const resetForm = function (){}
    const submitForm = function (){
        const player1name = document.querySelector("#player1Name").value
        const token1Values = document.querySelectorAll("#player1icon [name=iconOptions]")
        const player2name = document.querySelector("#player2Name").value
        const token2Values = document.querySelectorAll("#player2icon [name=iconOptions]")
        let token1Value = ""
        let token2Value = ""
        for (let i = 0; i < token1Values.length; i++) {
            if (token1Values[i].checked) {
                token1Value = token1Values[i].value
                break;
            }
        }
        for (let i = 0; i < token2Values.length; i++) {
            if (token2Values[i].checked) {
                token2Value = token2Values[i].value
                break;
            }
        }
        players.makePlayer(player1name, token1Value)
        players.makePlayer(player2name, token2Value)
    }
    
    return{submitForm, resetForm}
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

    // let playerT = {name: "Thomas", token: "x"}
    // let playerZ = {name: "T Bro", token: "o"}

    let playerList = [];

    const playerIconHTML = {
        x: `<i class="fas fa-times"></i>`,
        o: `<i class="far fa-circle"></i>`,
        heart: `<i class="far fa-heart"></i>`,
        cowboy: `<i class="fas fa-hat-cowboy-side"></i>`,
    }

    const getPlayerList = function() {
        return playerList
    }

    let activePlayer = playerList[0];

    const getActive = function() {
        let activePlayer = playerList[0];
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

    return {switchActive, makePlayer, getActive, returnActiveTokenIcon, getPlayerList}
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
            filledNode.textContent = "Clicken"
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
        node.addEventListener("click", gameBoard.addMove.bind(players, selectedSquare));
    }

    // event liseners for main form 

    const startGameButton = document.querySelector("button");
    startGameButton.addEventListener("click", playerForm.submitForm);

    return {renderBoard}
})()

gameController.renderBoard()