//player factory function 

const makePlayer = function(name, token) {
    const playerName = name;
    const playerToken = token;
    return {playerName, playerToken}
}

// form entry. 

const playerForm = (function(){

    const resetForm = function (){}

    const checkInputsAndSubmit = function() {

        const player1name = document.querySelector("#player1Name").value
        const token1Values = document.querySelectorAll("#player1icon [name=iconOptions]")
        const player2name = document.querySelector("#player2Name").value
        const token2Values = document.querySelectorAll("#player2icon [name=iconOptions]")        
        const player1header = document.getElementById("player1header")
        const player2header = document.getElementById("player2header")

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

        if (token1Value === token2Value) {
            alert("please select different tokens")
        }

        else if (!player1name || !player2name) {
            alert("please enter a real name!")
        }

        else {
            players.makePlayer(player1name, token1Value)
            players.makePlayer(player2name, token2Value)
            player1header.textContent = player1name;
            player2header.textContent = player2name;

        }

    }
    
    return{checkInputsAndSubmit, resetForm}
})()

// gameBoard module 

const gameBoard = (function() {
    let boardArray = Array.from({length:9}, () => undefined);

    const getBoardArray = function() {
        return boardArray
    }

    const resetBoard = function() {
        boardArray = Array.from({length:9}, () => undefined);
    }

    const addMove = function(squareNumber) {
        boardArray[squareNumber] = players.getActive().token;
        gameController.renderBoard();
        players.switchActive();
    }

    const checkWin = function() {

        let playerMoves = {}
        let winningPlayer = ""

        const parser = function(token, currInd) {
            if (token in playerMoves) {
                playerMoves[token].push(currInd.toString())
            }
            else if (token) {
                playerMoves[token] = []
                playerMoves[token].push(currInd.toString())
            }
        }

        boardArray.forEach(parser)

        const winningCombos = [
            "012",
            "345",
            "678",
            "036",
            "147",
            "258",
            "048",
            "246"
        ]


        for (key in playerMoves) {
            const moveFunct = function (winningSquareCombo) {
                let comboArray = winningSquareCombo.split("")
                if (comboArray.every(sqr => playerMoves[key].includes(sqr))) {
                    winningPlayer = key;
                }
            }
            winningCombos.forEach(moveFunct)
        }

        return winningPlayer

    }

    return {
        getBoardArray, addMove, resetBoard, checkWin
    }
})()

//Player creation and active player control 

const players = (function(){

    let playerList = [];
    let activePlayer = playerList[0]

    const playerIconClass = {
        "x": "fas fa-times",
        "o": "far fa-circle",
        "heart": "far fa-heart",
        "cowboy": "fas fa-hat-cowboy-side",
    }

    const getPlayerList = function() {
        return playerList
    }

    const getActive = function() {
        if (!activePlayer) {
            return playerList[0]
        }
        else {
            return activePlayer
        }
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

    const returnActiveTokenClass = function () {
        return playerIconClass[getActive().token]
    }

    return {switchActive, makePlayer, getActive, returnActiveTokenClass, getPlayerList, playerIconClass}
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
        gameBoard.getBoardArray().forEach(addNode);
    }

    const resetBoard = function() {
        gameBoard.resetBoard();
        renderBoard();
    }

    const removeChildren = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    const removeInputs = function() {
        const form1 = document.getElementById("form1container");
        const form2 = document.getElementById("form2container");
        player1token = players.playerIconClass[players.getPlayerList()[0].token]
        player2token = players.playerIconClass[players.getPlayerList()[1].token]
        let child1ToAppend = document.createElement("i")
        let child2ToAppend = document.createElement("i")
        removeChildren(form1)
        removeChildren(form2)
        form1.appendChild(child1ToAppend)
        form2.appendChild(child2ToAppend)
        child1ToAppend.setAttribute('class', `${player1token}`)
        child2ToAppend.setAttribute('class', `${player2token}`)
        document.querySelector("#player1Name").remove()
        document.querySelector("#player2Name").remove()

    }

    const addNode = function(el, indexInArray) {
        if (!el) {
            let emptyNode = document.createElement("div");
            appendNodeToContainer(emptyNode, boardContainer, indexInArray)
            addListener(emptyNode);
        }
        else {
            let filledNode = document.createElement("div");
            let childToAppend = document.createElement("i")
            childToAppend.setAttribute('class', `${players.playerIconClass[el]}`)
            filledNode.appendChild(childToAppend);
            appendNodeToContainer(filledNode, boardContainer, indexInArray);
        }

    }

    const appendNodeToContainer = function(node, container, index) {
        node.setAttribute("data-square", index);
        node.classList.add("squareBox");
        container.appendChild(node);
    }

    const addListener = function(node) {
        const selectedSquare = node.getAttribute("data-square");
        node.addEventListener("click", gameBoard.addMove.bind(players, selectedSquare));
    }

    // event listeners for main form - initializes the render on click. 

    const startGameButton = document.querySelector("button#start");
    const resetButton = document.querySelector("button#reset")

    startGameButton.addEventListener("click", playerForm.checkInputsAndSubmit);
    startGameButton.addEventListener("click", renderBoard)
    startGameButton.addEventListener("click", removeInputs)
    
    resetButton.addEventListener("click", resetBoard)

    return {renderBoard}
})()