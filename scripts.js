//player factory function. Duplicate from 

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

    const addMove = function(squareNumber, activeToken) {
        boardArray[squareNumber] = activeToken;
    }

    return {
        getBoardArray, addMove, resetBoard
    }
})()

//Player creation and active player control 

const players = (function(){

    const makePlayer = function(name, token) {
        playerList.push({name, token})
    }

    let playerList = [];

    const getPlayerList = function() {
        return playerList
    }

    // activePlayer / token logic 

    let activePlayer = "x"

    const getActivePlayer = function() {
            return activePlayer
    }

    const switchActive = function(){
        if (activePlayer = "x") {
            activePlayer = "o"
        }
        else {
            activePlayer = "x"
        }
        getActive()
    };

    const playerIconClass = {
        "x": "fas fa-times",
        "o": "far fa-circle",
        "heart": "far fa-heart",
        "cowboy": "fas fa-hat-cowboy-side",
    }

    const resetPlayers = function() {

    }

    return {switchActive, makePlayer, getActivePlayer, getPlayerList, resetPlayers}
})()

// DOM Communication and render logic 

const domCommunicator = (function() {

    const boardContainer = document.getElementById("boardContainer");

    const renderBoard = function(){
        removeChildren(boardContainer)
        gameBoard.getBoardArray().forEach(addNode);
    }

    const removeChildren = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    const resetBoard = function() {
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


    function renderBoard(board, playerList) {

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

    return {
        renderBoard
    }
})()

// main game controller 

//Dummy test board

let dummyTestBoard = ["x","x","x","o","o",,,,,]

// added to object reducer

const gameController = (function() {

    function logMove(square) {
        let activeToken = players.getActivePlayer();
        gameBoard.addMove(square, activeToken)
    }

    function submitForm() {

    }

    function resetGame() {

    }

    function getPlayerMoves() {
        let board = dummyTestBoard
        return board.reduce((accum, val, index) => {
            if (accum[val]) {
                accum[val] += index.toString()
            }
            else {
                accum[val] = index.toString()
            }
            console.log(accum)
            return accum
            }, {}
        )
    }
                   

    const checkWin = function(board) {

        let playerMoves = getPlayerMoves()

        let winningPlayer = ""

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

        winningCombos.forEach(checkSingleWinCombo)

        const checkSingleWinCombo = function(combo) {
            let seq = combo.split("")
            for (let key in playerMoves) {
                if (seq.every(num => movesList[key].includes(num))) {
                    return winningPlayer = key; 
                }
                else {
                    continue 
                }
            } 
        
        }

        if (winningPlayer) {
            return winningPlayer
        }

    }



    return {logMove, submitForm}
})()