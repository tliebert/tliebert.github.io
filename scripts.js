//player factory function. Duplicate from Players.makePlayer. 

const makePlayer = function(name, token, dbt) {
    const playerName = name;
    const playerToken = token;
    const databaseToken = dbt;
    return {playerName, playerToken, databaseToken}
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
            return (false)
        }

        else if (!player1name || !player2name) {
            alert("please enter a real name!")
            return (false)
        }

        else {
            players.makePlayer(player1name, token1Value, "x")
            players.makePlayer(player2name, token2Value, "o")
            player1header.textContent = player1name;
            player2header.textContent = player2name;
            return true 
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

    const playerIconClass = {
        "x": "fas fa-times",
        "o": "far fa-circle",
        "heart": "far fa-heart",
        "cowboy": "fas fa-hat-cowboy-side",
    }

    const makePlayer = function(name, token, dbt) {
        playerList.push({name, token, dbt})
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

    const returnIconToken = function(databaseToken){
        let extractedObject = playerList.find(player => {
            for (let key in player) {
                if (player[key] === databaseToken) {
                    return true
                }
                else {
                    continue
                } 
        }
    })
    return playerIconClass[extractedObject["token"]]
}

    const switchActive = function(){
        if (activePlayer === "x") {
            activePlayer = "o"
        }
        else {
            activePlayer = "x"
        }
        console.log(`now active player is ${activePlayer}`)
    };

    const resetPlayers = function() {

    }

    return {switchActive, makePlayer, getActivePlayer, getPlayerList, resetPlayers, returnIconToken, playerIconClass}
})()

// DOM Communication and render logic 

const domCommunicator = (function() {

    const boardContainer = document.getElementById("boardContainer");

    function addNode(el, indexInArray) {
        if (!el) {
            let emptyNode = document.createElement("div");
            appendNodeToContainer(emptyNode, boardContainer, indexInArray)
            addListener(emptyNode);
        }
        else {
            let filledNode = document.createElement("div");
            let childToAppend = document.createElement("i")
            let token = players.returnIconToken(el)            
            childToAppend.setAttribute('class', token)
            filledNode.appendChild(childToAppend);
            appendNodeToContainer(filledNode, boardContainer, indexInArray);
        }

    }

    const renderBoard = function(){
        let board = gameBoard.getBoardArray()
        console.log(`rendering this board ${board}`)
        removeChildren(boardContainer)
        board.forEach(addNode); // wants a board array, implemented as an event listener 
    }

    const removeChildren = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    const resetBoard = function() {
        // this function should point to the game controller, which will the communicate
        // with gameBoard. 
        gameBoard.resetBoard()
        renderBoard()
    }

    const removeInputs = function() {
        const form1 = document.getElementById("form1container");
        const form2 = document.getElementById("form2container");
        console.log(players.getPlayerList())
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

    const appendNodeToContainer = function(node, container, index) {
        node.classList.add("squareBox");
        node.setAttribute("data-square", index)
        container.appendChild(node);
    }

    function addListener(node) {
        node.addEventListener("click", squareClickProcessor);
    }

    function squareClickProcessor(event) {
        let squareNumber = event.target.getAttribute("data-square")
        console.log(`clicked square is ${squareNumber}`)
        gameController.logMove(squareNumber)
    }

    function showWinner(winnerDatabaseToken) {
        let winMessageContainer = document.createElement("div")
        winMessageContainer.textContent = "hey you won hello yes" 
        let winMessage = document.createElement("i");

        //Dry this out. This function happens elsewhere
        console.log(winnerDatabaseToken)
        let winnerToken = players.returnIconToken(winnerDatabaseToken)
        console.log(winnerToken)
        winMessage.className += winnerToken;
        // take either the database token or the winner token. 

        winMessageContainer.appendChild(winMessage)

        let winbox = document.querySelector("#winMessageBox")
        winbox.appendChild(winMessageContainer)
        console.log("im trying to show the winner!")

        removeChildren(boardContainer);
    }

    // event listeners for main form - initializes the render on click. 

    const startGameButton = document.querySelector("button#start");
    const newGameButton = document.querySelector("button#newgame")

    startGameButton.addEventListener("click", sendToController)
    newGameButton.addEventListener("click", resetBoard)

    return {
        renderBoard, showWinner, removeInputs
    }
})()

function sendToController(event) {
    console.log(event)
    gameController.startGameEventHandler(event)
}

let dummyTestBoard = ["x","x","x","x","x","x","x","x","x"]

const gameController = (function() {

    function startGameEventHandler(event) {
        let resultOfSubmissionAttempt = playerForm.checkInputsAndSubmit(event)
        console.log(resultOfSubmissionAttempt)
        if (resultOfSubmissionAttempt) {
            domCommunicator.renderBoard()
            domCommunicator.removeInputs()
        }
        else {
            alert("you need to not mess up the inputs")
        }
    }

    function logMove(square) {
        let activeToken = players.getActivePlayer();
        gameBoard.addMove(square, activeToken)
        domCommunicator.renderBoard()
        let currentBoard = gameBoard.getBoardArray()
        let possibleWinner = checkWin(currentBoard)
        if (!(typeof possibleWinner === "undefined" || possibleWinner === "undefined")) {
            domCommunicator.showWinner(possibleWinner);
        }
        players.switchActive()
    }

    function getPlayerMoves(board) {
        return board.reduce((accum, val, index) => {
            if (accum[val]) {
                accum[val] += index.toString()
            }
            else if (val) {
                accum[val] = index.toString()
            }
            return accum
            }, {}
        )
    }
                   
    function checkWin(board) {

        let playerMoves = getPlayerMoves(board)

        console.log("player moves is", playerMoves)

        let winningPlayer;

        const winningCombos = [
            "012",
            "036",
            "345",
            "678",
            "147",
            "258",
            "048",
            "246"
        ]

        winningCombos.some(checkSingleWinCombo)

        // takes each combo, splits into an array, then takes each 
        // key in player moves, an object defined above which collects
        // every number from x or o player in a single object property 

        function checkSingleWinCombo(combo) {
            let seq = combo.split("")
            for (let key in playerMoves) {

                // recieving ["0","1", "2"] for example 
                
                if (seq.every(num => playerMoves[key].includes(num))) {
                    console.log("winningplayer updated to", key, typeof key)
                    winningPlayer = key;
                    return true; 
                }

                //is this necessary? 

                else {
                    continue 
                }
            } 
        
        }

        return winningPlayer

    }

    return {logMove, checkWin, getPlayerMoves, startGameEventHandler}
})()