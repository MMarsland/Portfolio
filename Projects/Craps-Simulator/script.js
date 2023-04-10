let game;
let possablePoints = [4, 5, 6, 8, 9, 10];


class Game
{
    constructor(players)
    {
        this.players = players;
        this.rollHistory = new Array();
        this.currentPlayer = players[0];
        this.point = new Point();
    }

    rollDice()
    {
        var roll1 = Math.floor(Math.random() * 6) + 1;
        var roll2 = Math.floor(Math.random() * 6) + 1;
        var roll = new Roll(roll1, roll2);
        return roll;
    }

    resolveDiceRoll()
    {
        console.log("Rolling Dice");
        
        var roll = this.rollDice();
        this.addRollToRollHistory(roll);
        console.log("The Shooter Rolled A "+roll.total);
        //Handle Point
        console.log("About to handle roll");
        this.point.handleRoll(roll.total);
        //Resolve Bets
        for (var player of this.players)
        {
            for (var i = player.bets.length-1; i >= 0; i--)
            { 
                player.bets[i].resolve(roll);
            }
        }

        console.log(game.currentPlayer.bets);
        console.log(game.currentPlayer.money);

    }

    addRollToRollHistory(roll)
    {
        this.rollHistory.push(roll);

        var player = game.currentPlayer;

        var historyItem = document.createElement("DIV");
        historyItem.setAttribute("class", "rollHistoryItem");
        var die1 = document.createElement("DIV");
        die1.setAttribute("style", "background-image: url('images/"+roll.roll1+".png')");
        var die2 = document.createElement("DIV");
        die2.setAttribute("style", "background-image: url('images/"+roll.roll2+".png')");
        var total = document.createElement("H1");
        total.appendChild(document.createTextNode(roll.total));
        historyItem.appendChild(die1);
        historyItem.appendChild(die2);
        historyItem.appendChild(total);
        document.getElementById("rollHistory").insertBefore(historyItem, document.getElementById("rollHistory").firstChild);

    }
    log(message, important=false)
    {
        var logItem = document.createElement("P");
        var text = document.createTextNode(message);
        var boldText = document.createElement("STRONG");
        boldText.appendChild(text);
        if (important)
        {
            logItem.appendChild(boldText);
        }
        else
        {
            logItem.appendChild(text);
        }
        document.getElementById("log").insertBefore(logItem, document.getElementById("log").firstChild);
    }
}

class Player
{
	//Default Constructor
	constructor(name, money) 
	{
		this.money = money; // The players current money!
		this.name = name; // The players name
		this.bets = new Array(); //An array of all the bet objects that belong to the player
		this.wager = 5; // The amount of money to bet for each click
		this.isShooter = false; // If they are the current shooter
		this.location = ""; // Position at the table 
    }

    info()
    {
        alert(this.name);
        alert(this.money);
    }
    deleteBet(bet) 
    {
        removeFromArray(this.bets, bet); 
    }
    addBet(bet)
    {
        this.bets.push(bet);
    }

    addMoney(money){
        this.money += money;
        document.getElementById("money").innerText = this.money;
    }
    removeMoney(money)
    {
        this.money -= money;
        document.getElementById("money").innerText = this.money;
    }
}

class Roll
{
    constructor (roll1, roll2)
    {
        this.roll1 = roll1;
        this.roll2 = roll2;
        this.total = roll1 + roll2;
        this.hardWay = roll1 == roll2;
    }
}

class Point
{
    constructor()
    {
        this.number = null;
        this.point = null;
    }

    turnPointOn(number)
    {
        console.log("Setting number to: "+number);
        this.number = number;
        //Move the point to ...
        var point = document.createElement("DIV");
        point.setAttribute("class", "point");
        point.setAttribute("id", "pointOn"+number);
        point.setAttribute("data-type", "point");
        this.point = point;
        document.getElementById("boardArea").appendChild(point);
    }

    turnPointOff(number)
    {
        //Delete Ui item
        this.number = null;
        console.log(this.point);
        this.point.remove();

    }
    handleRoll(number)
    {
        console.log("handling roll");
        console.log("Point is on "+this.number);
        if (this.number == null)
        {
            if (possablePoints.includes(number))
            {
                console.log("Turning point on");
                this.turnPointOn(number);
            }
        }
        else if (this.number == number || number == 7)
        {
            game.log((number == 7)? "SEVEN OUT!" : "The shooter has hit the point!", true);
            
            this.turnPointOff();
        }
    }
}

class GenericBet
{
	constructor(value, player)
	{
        this.identifier = "";
        this.player = player;
		this.value = value;
		this.odds = 0;
		this.working = true;
		this.oddsWorking = true;
        this.betMultiplier = 0;
        this.oddsMultiplier = 0;
		this.winningRolls = new Array();
        this.losingRolls = new Array();
        this.uiItem = null;
        this.returnOnWin = false;
        this.contextMenu = null;
    }

    takeOdds()
    {

    }

    layOdds()
    {

    }

    resolve(roll)
    {
        if (this.winningRolls.includes(roll.total))
        {   // Pay the bet if it was working, pay the odds if they were working.
            if (this.working)
            {
                var winnings;
                console.log(this.value + " * "+this.betMultiplier+" = "+ this.value * this.betMultiplier);
                console.log(this.player);
                this.player.addMoney(this.value * this.betMultiplier); 
                winnings = this.value * this.betMultiplier;
                if (this.oddsWorking)
                {
                    this.player.addMoney(this.odds + this.odds * this.oddsMultiplier); 
                    winnings += this.odds * this.oddsMultiplier;
                }
                game.log(this.player.name+" won $"+winnings+"!");
                if (this.returnOnWin)
                {
                    this.uiItem.remove();
                    this.player.addMoney(this.value + this.odds);
                    this.player.deleteBet(this);
                }
            }
        } 
        else if (this.losingRolls.includes(roll.total)) 
        {   //Delete the bet (Return odds of they were not working)
            if (this.working)
            {
                if (!this.oddsWorking)
                {
                    this.player.addMoney(this.odds);
                }
                this.player.deleteBet(this);
                this.uiItem.remove();
            }

        }
        //Nothing Happens.
    }
}

class PlaceBet extends GenericBet
{
    constructor(value, player)
    {
        super(value, player);
    }
}

class PlaceBetOn4 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(4);
            this.losingRolls.push(7);
            this.betMultiplier = 9/5;
            this.identifier = "placeBetOn4";
        }
    }
}

class PlaceBetOn5 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(5);
            this.losingRolls.push(7);
            this.betMultiplier = 7/5;
            this.identifier = "placeBetOn5";
        }
    }
}

class PlaceBetOn6 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(6);
            this.losingRolls.push(7);
            this.betMultiplier = 7/6;
            this.identifier = "placeBetOn6";
        }
    }
}

class PlaceBetOn8 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(8);
            this.losingRolls.push(7);
            this.betMultiplier = 7/6;
            this.identifier = "placeBetOn8";
        }
    }
}

class PlaceBetOn9 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(9);
            this.losingRolls.push(7);
            this.betMultiplier = 7/5;
            this.identifier = "placeBetOn9";
        }
    }
}

class PlaceBetOn10 extends PlaceBet
{
    constructor(value, player)
    {
        super(value, player)
        {
            this.winningRolls.push(10);
            this.losingRolls.push(7);
            this.betMultiplier = 9/5;
            this.identifier = "placeBetOn10";
        }
    }
}

class PrePointPassLineBet extends GenericBet
{
    constructor(value, player) 
    {
        super(value, player );
        this.betMultiplier = 2;
        this.winningRolls = [7, 11];
        this.losingRolls = [2, 3, 12];
        this.identifier = "prePointPassLineBet";
    }
    
    resolve(roll)
    {
        super.resolve(roll);
        if (possablePoints.includes(roll.total))
        {
            var bet = new PostPointPassLineBet(this.value, this.player, roll.total);
            this.player.addBet(bet);
            
            var chips = document.createElement("DIV");
            chips.setAttribute("class", "chips");
            chips.setAttribute("style", "top: 365px; left: 420px;");
            chips.setAttribute("data-type", "postPointPassLineBet");
            bet.uiItem = chips;
            document.getElementById("boardArea").appendChild(chips);

            this.uiItem.remove();
            this.player.deleteBet(this);
            
        }
    }
}

class PostPointPassLineBet extends GenericBet
{
    constructor(value, player, point) 
    {
        super(value, player);
        this.winningRolls.push(point);
        this.losingRolls.push(7);
        this.betMultiplier = 1;
        this.identifier = "postPointPassLineBet";
        this.returnOnWin = true;
    }
}

class FieldBet extends GenericBet
{
    constructor(value, player) 
    {
        super(value, player);
        this.winningRolls = [2,3,4,9,10,11,12];
        this.losingRolls = [5,6,7,8];
        this.betMultiplier = 1;
        this.identifier = "fieldBet";
        this.returnOnWin = true;
    }

    resolve(roll)
    {
        if (roll.total == 2 || roll.total == 12){
            this.player.addMoney(this.bet.value * this.betMultiplier);
        }
        super.resolve(roll);
    }
}





function startGame()
{
    //alert("Starting Game!");

    var player1 = new Player("Trevor", 500);

    game = new Game([player1]);

    document.getElementById("name").innerText = game.players[0].name;
    document.getElementById("money").innerText = game.players[0].money;

    document.getElementById("rollDiceButton").addEventListener("click", function() {
        game.resolveDiceRoll();
    });
}


//Generic Application Functions
function removeFromArray(array, element)
{
    var index = array.indexOf(element);
    array.splice(index, 1);
}

function getCoords(position)
{
    var topDist = position.substring(position.indexOf(":")+2, position.indexOf(";")-2);
    var secondHalf = position.substring(position.indexOf(";")+2);
    console.log(secondHalf);
    var leftDist = secondHalf.substring(secondHalf.indexOf(":")+2, secondHalf.indexOf(";")-2);
    console.log(topDist);
    console.log(leftDist);
    return [topDist, leftDist];
}

function addBetContextMenu(bet, chips)
{
    var contextMenu = document.createElement("DIV");
    contextMenu.setAttribute("class", "contextMenu hidden");
    var position = chips.getAttribute("style");
    var coords = getCoords(position);
    contextMenu.setAttribute("style", "top: "+coords[0]+"px; left: "+ (+coords[1] + +40) +"px;");
    

    addItemsToContextMenu(bet, chips, contextMenu);
    document.getElementById("boardArea").appendChild(contextMenu);
    bet.contextMenu = contextMenu;

    chips.addEventListener("contextmenu", openContextMenu);
    contextMenu.addEventListener("mouseleave", closeContextMenu);
}

function addItemsToContextMenu(bet, chips, contextMenu)
{
    var remove = document.createElement("DIV");
    remove.setAttribute("class", "contextMenuItem");
    remove.setAttribute("style", "position: absolute; bottom: 0px;");
    remove.innerText = "Remove Bet";
    remove.addEventListener("click", function(){
        console.log("Running Remove");
        bet.player.addMoney(bet.value);
        bet.player.deleteBet(bet);
        bet.uiItem.remove();
        bet.contextMenu.remove();
        contextMenu.classList.add("hidden");
    });
    contextMenu.appendChild(remove);
    var addOdds = document.createElement("DIV");
    addOdds.setAttribute("class", "contextMenuItem");
    addOdds.setAttribute("style", "position: absolute; top: 0px; background: orange;");
    addOdds.innerText = "Add Odds";
    contextMenu.appendChild(addOdds);


}

function openContextMenu(evt)
{
    console.log("Opening Context Menu");
    evt.preventDefault();
    for (bet of game.players[0].bets)
    {
        if (bet.uiItem == evt.target)
        {
            bet.contextMenu.classList.remove("hidden");
        }
    }
}

function closeContextMenu(evt)
{
    console.log("Closing Context Menu");
    for (bet of game.players[0].bets)
    {
        if (bet.contextMenu == evt.target)
        {
            bet.contextMenu.classList.add("hidden");
        }
    }
}

function placeBetOn4() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn4(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 235px;");
    chips.setAttribute("data-type", "placeBetOn4");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placeBetOn5() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn5(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 314px;");
    chips.setAttribute("data-type", "placeBetOn5");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placeBetOn6() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn6(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 393px;");
    chips.setAttribute("data-type", "placeBetOn6");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placeBetOn8() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn8(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 472px;");
    chips.setAttribute("data-type", "placeBetOn8");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
    bet.contextMenu.classList.add("hidden");
}

function placeBetOn9() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn9(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 551px;");
    chips.setAttribute("data-type", "placeBetOn9");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placeBetOn10() 
{
    var player = game.currentPlayer;
    var bet = new PlaceBetOn10(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 110px; left: 630px;");
    chips.setAttribute("data-type", "placeBetOn10");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placePassLineBetOnBottom() 
{
    var player = game.currentPlayer;
    var bet = new PrePointPassLineBet(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 365px; left: 420px;");
    chips.setAttribute("data-type", "prePointPassLineBet");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}

function placeFieldBet()
{
    var player = game.currentPlayer;
    var bet = new FieldBet(player.wager, player);
    player.addBet(bet);
    player.removeMoney(player.wager);

    var chips = document.createElement("DIV");
    chips.setAttribute("class", "chips");
    chips.setAttribute("style", "top: 269px; left: 500px;");
    chips.setAttribute("data-type", "fieldBet");
    addBetContextMenu(bet, chips);
    bet.uiItem = chips;
    document.getElementById("boardArea").appendChild(chips);
}







