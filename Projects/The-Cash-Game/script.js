var node1;
var node2;
var node3;
var node4;
var node5;
var node6;
var node7;
var node8;
var node9;
var node10;
var node11;

var app;

var menu_screen;
var game_screen;
var game_board;
var example_game_screen;
var victory_screen;
var current_screen;
var connection_svg;
var moves = 0;
var nodes = [];
var grid = [[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
var connectionSVGS = new Set();

function startApp()
{
    app = new App();
    menu_screen = document.getElementById("menu-screen");
    game_screen = document.getElementById("game-screen");
    game_board = document.getElementById("game-board");
    connection_svg = document.getElementById("connection-svg");
    example_game_screen = document.getElementById("example-game-screen");
    victory_screen = document.getElementById("victory-screen");
    app.loadMenuScreen();
}

function startGameFromMenu()
{
    changeScreen(game_screen);
    app.game.startGame(document.getElementById("number-of-dots-selector").value, document.getElementById("difficulty-selector").value);
}

function launchExampleGame()
{
    app.startExampleGame();
}

function checkVictory()
{
    var victory = true;
    for (var nodeIndex in nodes){ let node = nodes[nodeIndex];
        if (node.value < 0){
            victory = false;
        }
    }

    if (victory)
    {
        changeScreen(victory_screen);
        document.getElementById("victory-text-p").innerText = moves;
    }
}

function changeScreen(new_screen)
{
    current_screen = current_screen ? current_screen : menu_screen;
    current_screen.style.display = "none";
    current_screen = new_screen;
    current_screen.style.display = "block";
}

function callGive(id)
{
    for (let i=0; i<nodes.length; i++)
    {
        let node = nodes[i];
        if (node.id == id)
        {
            node.give();
        }
    }
}

function callTake(id)
{
    for (let i=0; i<nodes.length; i++)
    {
        let node = nodes[i];
        if (node.id == id)
        {
            node.take();
        }
    }
}

function getNode(id)
{
    console.log("Getting node");
    for (let i=0; i<nodes.length; i++)
    {
        let node = nodes[i];
        console.log(node);
        if (node.id == id)
        {
            console.log(node);
            return node;
        }
    }
}

class Node
{
    constructor(id)
    {
        this.value = null;
        this.connectedNodes = [];
        this.id = id;
        this.x = null;
        this.y = null;
    }

    connectNodes()
    {
        while(this.connectionNums.length != 0)
        {
            switch (this.connectionNums[0])
            {
                case 1:
                    this.connectedNodes.push(node1);
                    break;
                case 2:
                    this.connectedNodes.push(node2);
                    break;
                case 3:
                    this.connectedNodes.push(node3);
                    break;
                case 4:
                    this.connectedNodes.push(node4);
                    break;
                case 5:
                    this.connectedNodes.push(node5);
                    break;
                case 6:
                    this.connectedNodes.push(node6);
                    break;
                case 7:
                    this.connectedNodes.push(node7);
                    break;
                case 8:
                    this.connectedNodes.push(node8);
                    break;
                case 9:
                    this.connectedNodes.push(node9);
                    break;
                case 10:
                    this.connectedNodes.push(node10);
                    break;
                case 11:
                    this.connectedNodes.push(node11);
                    break;
            }
            this.connectionNums.shift();
        }
    }

    connectTo(id)
    {  
        if (!this.connectedNodes.includes(getNode(id)))
        {
            this.connectedNodes.push(getNode(id));
            getNode(id).connectTo(this.id);
        }
    }

    placeNode()
    {
        for (let i=100000; i>=0; i--)
        {
            let x = Math.floor(Math.random() * 12);
            let y = Math.floor(Math.random() * 4);
            if (grid[y][x] == 0)
            {
                this.x = x;
                this.y = y;
                grid[y][x] = 1;
                break;
            }
            if (i == 0)
            {
                alert("I HAVE FAILED!");
            }
        }
        
    }
    
    displayNode()
    {
        game_board.innerHTML += '<div class="node" style="left: '+this.x*100+'px; top: '+this.y*100+'px"><div class="leftHalf" onclick="callTake('+this.id+');"></div><div class="rightHalf" onclick="callGive('+this.id+');"></div><p class="value" id="'+this.id+'"></div>';
    }

    give()
    {
        moves++;
        for (var connectionIndex in this.connectedNodes){ var connectedNode = this.connectedNodes[connectionIndex];
            connectedNode.increaseValue();
            this.decreaseValue();
        }
        checkVictory();
    }

    take()
    {
        moves++;
        for (var connectionIndex in this.connectedNodes){ var connectedNode = this.connectedNodes[connectionIndex];
            connectedNode.decreaseValue();
            this.increaseValue();
        }
        checkVictory();
    }

    displayValue()
    {
        console.log("Displaying Value");
        console.log(this.id);
        switch (this.id)
        {
            case 0:
                document.getElementById("0").innerText = this.value;
                break;
            case 1:
                document.getElementById("1").innerText = this.value;
                break;
            case 2:
                document.getElementById("2").innerText = this.value;
                break;
            case 3:
                document.getElementById("3").innerText = this.value;
                break;
            case 4:
                document.getElementById("4").innerText = this.value;
                break;
            case 5:
                document.getElementById("5").innerText = this.value;
                break;
            case 6:
                document.getElementById("6").innerText = this.value;
                break;
            case 7:
                document.getElementById("7").innerText = this.value;
                break;
            case 8:
                document.getElementById("8").innerText = this.value;
                break;
            case 9:
                document.getElementById("9").innerText = this.value;
                break;
        }
    }

    increaseValue()
    {
        this.value++;
        this.displayValue();
    }

    decreaseValue()
    {
        this.value--;
        this.displayValue();
    }
}

class App
{
    constructor()
    {
        this.game = new Game();
    }

    loadMenuScreen()
    {       
        changeScreen(menu_screen);
    }

    startExampleGame()
    {
        changeScreen(example_game_screen);
        node1 = new Node(4, [5, 9], 1);
        node2 = new Node(-2, [6, 7], 2);
        node3 = new Node(2, [4, 5], 3);
        node4 = new Node(8, [3, 6], 4);
        node5 = new Node(-1, [1, 3, 7], 5);
        node6 = new Node(1, [2, 4, 8], 6);
        node7 = new Node(3, [2, 5, 10], 7);
        node8 = new Node(-4, [6, 11], 8);
        node9 = new Node(-5, [1, 11], 9);
        node10 = new Node(0, [7, 11], 10);
        node11 = new Node(-3, [8, 9, 10], 11);

        nodes = [node1,node2,node3,node4,node5,node6,node7,node8,node9,node10,node11];
        for (var nodeIndex in nodes){ let node = nodes[nodeIndex];
            node.connectNodes();
            node.presentValue();
        }
    }
}

class Game
{
    constructor(numberOfDots, difficulty)
    {
        this.numberOfDots = numberOfDots;
        this.difficulty = difficulty;
        this.nodes = [];
        this.randomnessFactor = Math.floor(Math.random() * 4) + 1;
        this.genius = null;
    }

    startGame(num_of_dots, difficulty)
    {
        this.numberOfDots = num_of_dots;
        this.difficulty = difficulty;
        console.log("Starting The Cash Game on "+difficulty+" with "+num_of_dots+" dots!");  

        this.createNodes();
        this.connectNodes();
        this.giveValuesToNodes();
        this.placeNodes();

        this.displayNodes();
        this.displayConnections();
    }

    createNodes()
    {
        for (let i=0; i< this.numberOfDots; i++)
        {
            nodes[i] = new Node(i);
        }
    }

    connectNodes()
    {
        if (this.randomnessFactor > 0)
        {
            for (let i=0; i<nodes.length-1; i++)
            {
                nodes[i].connectTo(i+1); //Make a line
                connectionSVGS.add([i, i+1]);
            }
            this.genius = 0;
        } 
        
    }

    giveValuesToNodes()
    {
        var integers = this.getRandomIntegers();
        for (var i=0; i<nodes.length; i++)
        {   let node = nodes[i];
            node.value = integers[i];
        }
    }

    placeNodes()
    {
        for (let i=0; i<nodes.length; i++)
        {
            nodes[i].placeNode();
        }
    }

    displayNodes()
    {
        for (let i=0; i<nodes.length; i++)
        {
            nodes[i].displayNode();
            nodes[i].displayValue();
        }
    }

    displayConnections()
    {
        console.log("Displaying Connections");
        for (let connection of connectionSVGS)
        {
            console.log(connection);
            console.log(connection[0]);
            let node1 = getNode(connection[0]);
            let node2 = getNode(connection[1]);
            let node3 = getNode(0);
            console.log(node3);
            console.log(node1);
            console.log(node2);
            connection_svg.innerHTML += '<polyline points="'+node1.x*100+','+node1.y*100+' '+node2.x*100+','+node2.y*100+'" style="fill:none;stroke:black;stroke-width:6"></polyline>';
        } 
    }

    getRandomIntegers()
    {
        var integers = [];
        var hasNegative = false;
        for (var i=0;i<this.numberOfDots;i++)
        {
            let val = Math.floor(Math.random() * 21) - 9;
            if (val < 0) { hasNegative = true; }
            integers[i] = val;
        }
        if (hasNegative)
        {
            switch (this.difficulty)
            {
                case "easy":
                    if (this.valuesSum(integers) == 4)
                        return integers;
                    break;
                case "medium":
                        if (this.valuesSum(integers) == 2)
                        return integers;
                    break;
                case "hard":
                        if (this.valuesSum(integers) == 0)
                        return integers;    
                    break;
                case "impossible":
                        if (this.valuesSum(integers) == -2)
                        return integers;    
                    break;
            }
        }
        return this.getRandomIntegers();
    }

    valuesSum(integers)
    {
        var sum = 0;
        for (let intIndex in integers)
        {
            sum += integers[intIndex];
        }
        return sum;
    }
}
































/*
class App
{
    constructor()
    {
        this.game = new Game();
    }

    loadMenuScreen()
    {       
        wrapper.innerHTML += ''
        +'<div id="menu-screen">'
        +'  <div id="title">'
        +'      <div id="title-top">The</div>'
        +'      <div id="title-bottom">Cash Game</div> '
        +'  </div>'
        +'  <button id="start-button" onclick="startGameFromMenu()">Start Game</button>'
        +'  <div id="number-of-dots-selector-box">'
        +'      Number of Dots:</br>'
        +'      <input id="number-of-dots-selector" type="number" name="num_of_dots" min="2" max="10" value="2">'
        +'  </div>'
        +'  <div id="difficulty-selector-box">'
        +'      Difficulty:</br>'
        +'      <select id="difficulty-selector">'
        +'         <option value="easy">Easy</option>'
        +'         <option value="medium">Medium</option>'
        +'         <option value="hard">Hard</option>'
        +'         <option value="impossible">Probably Impossible</option>'
        +'      </select>'
        +'  </div>'
        +'  <button id="example-button" onclick="launchExampleGame()">Play Example Game</button>'
        +'</div>';
    }

    loadGameScreen()
    {
        wrapper.innerHTML = ''
        +'<div id="game-screen">'
        +'</div>';
        this.game.prepareTree();
    }

    addNodeToScreen(node)
    {
        var gameScreen = document.getElementById("game-screen");
        gameScreen.innerHTML += '<div class="node" style="left: '+node.x+'px; top: '+node.y+'px"></div>';
        for (var connectionIndex in node.connections)
        {
            var connection = node.connections[connectionIndex];
            gameScreen.innerHTML += ''
                +'<svg height="900" width="900">'
                +'<polyline points="'+node.x+','+node.y+' '+connection.x+','+connection.y+'" style="fill:none;stroke:black;stroke-width:6"></polyline>'
                +'</svg>';
        }
    }
}

class Game
{
    constructor(numberOfDots, difficulty)
    {
        this.numberOfDots = numberOfDots;
        this.difficulty = difficulty;
        this.nodes =[];
    }

    startGame(num_of_dots, difficulty)
    {
        this.numberOfDots = num_of_dots;
        this.difficulty = difficulty;
        console.log("Starting The Cash Game on "+difficulty+" with "+num_of_dots+" dots!");  
    }

    prepareTree()
    {
        //var integers = getRandomIntegers();
        for (var i=0;i<this.numberOfDots;i++)
        {    
            if (i == 0)
            {
                this.nodes[i] = new Node().getNextNode(true);
            }
            else
            {
                this.nodes[i] = this.nodes[i-1].getNextNode();
            }
        }
    }

    getRandomIntegers()
    {
        var integers = [];
        for (var i=0;i<this.numberOfDots;i++)
        {
            integers[i] = Math.floor(Math.random() * 11) - 5;
        }
        switch (difficulty)
        {
            case "easy":
                if (this.valuesTotal(integers) == 10)
                    return integers;
                break;
            case "medium":
                    if (this.valuesTotal(integers) == 5)
                    return integers;
                break;
            case "hard":
                    if (this.valuesTotal(integers) == 0)
                    return integers;    
                break;
            case "impossible":
                    if (this.valuesTotal(integers) == -10)
                    return integers;    
                break;
        }
        return getRandomIntegers();
    }

    valuesTotal(integers)
    {
        var sum = 0;
        for (intIndex in integers)
        {
            sum += integers[intIndex];
        }
        return sum;
    }
}

class Node
{
    constructor(value, connections, location)
    {
        this.value = (value != null) ? value : 0;
        this.connections = (connections != null) ? connections : [];
        this.location = (location != null) ? location : [];
        if (location != null)
        {
            this.x = location[0];
            this.y = location[1];
        }
    }

    getNextNode(first)
    {
        var newNode;
        if (first)
        {
            newNode = new Node(null, null, [screen.width / 2 - 200, screen.height / 2]); 
        }
        else
        {
            newNode = new Node();
            var direction = Math.floor(Math.random() * 8);
            switch (direction)
            {
                case 0:
                    newNode.x = this.x;
                    newNode.y = this.y - 150;
                    break;
                case 1:
                    newNode.x = this.x + 150;
                    newNode.y = this.y - 150;
                    break;
                case 2:
                    newNode.x = this.x + 150;
                    newNode.y = this.y;
                    break;
                case 3:
                    newNode.x = this.x + 150;
                    newNode.y = this.y + 150;
                    break;
                case 4:
                    newNode.x = this.x;
                    newNode.y = this.y + 150;
                    break;
                case 5:
                    newNode.x = this.x - 150;
                    newNode.y = this.y + 150;
                    break;
                case 6:
                    newNode.x = this.x - 150;
                    newNode.y = this.y;
                    break;
                case 7:
                    newNode.x = this.x - 150;
                    newNode.y = this.y - 150;
                    break;
            }
            while (true)
            {
                for (var nodeIndex in app.game.nodes)
                {
                    var connected = Math.floor(Math.random() * 2);
                    if (connected == 0)
                    {
                        newNode.connections.push(app.game.nodes[nodeIndex]);
                        app.game.nodes[nodeIndex].connections.push(newNode)
                    }
                }
                
                if (newNode.connections != null && newNode.connections.length > 0)
                {
                    break;
                }
            }
        }   

        app.addNodeToScreen(newNode);
        return newNode;
    }
}*/


/*
    getNextNode(first)
    {
        var newNode;
        if (first)
        {
            newNode = new Node(null, null, [screen.width / 2, screen.height / 2]); 
        }
        else
        {
            newNode = new Node();
            var direction = Math.floor(Math.random() * 8);
            switch (direction)
            {
                case 0:
                    newNode.x = this.x;
                    newNode.y = this.y - 150;
                    break;
                case 1:
                    newNode.x = this.x + 150;
                    newNode.y = this.y - 150;
                    break;
                case 2:
                    newNode.x = this.x + 150;
                    newNode.y = this.y;
                    break;
                case 3:
                    newNode.x = this.x + 150;
                    newNode.y = this.y + 150;
                    break;
                case 4:
                    newNode.x = this.x;
                    newNode.y = this.y + 150;
                    break;
                case 5:
                    newNode.x = this.x - 150;
                    newNode.y = this.y + 150;
                    break;
                case 6:
                    newNode.x = this.x - 150;
                    newNode.y = this.y;
                    break;
                case 7:
                    newNode.x = this.x - 150;
                    newNode.y = this.y - 150;
                    break;
            }
            while (true)
            {
                for (var nodeIndex in app.game.nodes)
                {
                    var connected = Math.floor(Math.random() * 2);
                    if (connected == 0)
                    {
                        newNode.connections.push(app.game.nodes[nodeIndex]);
                        app.game.nodes[nodeIndex].connections.push(newNode)
                    }
                }
                
                if (newNode.connections != null && newNode.connections.length > 0)
                {
                    break;
                }
            }
        }   

        app.addNodeToScreen(newNode);
        return newNode;
        */