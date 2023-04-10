var match;
var Testhistory = "Test";
var clocks = [];

function startApp()
{
    match = new Match();
    updateClocksSync();
}

class Match
{
    constructor ()
    {
        this.gamesPlayed = 0;
        this.currentGame = new Game();
        this.player1;
        this.player2;
        this.player1 = new Player(this, "player1");
        this.player2 = new Player(this, "player2");
        this.clock = new Clock("matchTime");
        this.servingSide = "R";
        this.updateUI();
    }

    startNewGame()
    {
        this.gamesPlayed++;
        this.currentGame = new Game();
        this.player1.resetScore();
        this.player2.resetScore();
        this.updateUI();
    }

    updateUI()
    {
        this.updateGameNum();
        this.updateGamesScore();
    }

    updateGameNum()
    {
        document.getElementById("gameNum").innerHTML = "Game "+(this.gamesPlayed+1);
    }

    updateGamesScore()
    {
        document.getElementById("matchScore").innerHTML = this.player1.games+"-"+this.player2.games;
    }
    switchServingSide()
    {
        if (this.servingSide == "R")
        {
            this.servingSide = "L";
        }
        else
        {
            this.servingSide = "R";
        }
        this.updateServeSideUI();
    }
    updateServeSideUI()
    {
        document.getElementById("player1Side").children[4].children[2].innerText = this.servingSide;
        document.getElementById("player2Side").children[4].children[2].innerText = this.servingSide;
    }
}

class Game
{
    constructor ()
    {
        this.clock = new Clock("gameTime");
    }
}

class Player 
{
    constructor(match, id)
    {
        this.match = match;
        this.id = id; 
        this.name = (id == "player1") ? "Player 1" : "Player 2";
        this.score = 0;
        this.games = 0;
        this.opponentId = (id == "player1") ? "player2" : "player1";
        this.hasServe;
    }

    win(match, loser)
    {
        this.increaseGames();
        match.startNewGame();
    }
    increaseScore()
    {
        this.score++;
        Testhistory += ":Player1IncreaseScore";
        match.switchServingSide();
        this.updateUI();
    }
    decreaseScore()
    {
        this.score--;
        Testhistory += ":Player1DecreaseScore";
        this.updateUI();
    }
    increaseGames()
    {
        this.games++;
        Testhistory += ":"+this.id+"IncreaseGames";
        this.updateUI();
    }
    decreaseGames()
    {
        this.games--;
        Testhistory += ":"+this.id+"DecreaseGames";
        this.updateUI();
    }
    setScore(score)
    {
        Testhistory += ":"+this.id+"SetScore"+this.score+"->"+score;
        this.score = score;
        this.updateUI();
    }
    setGames(games)
    {
        Testhistory += ":"+this.id+"SetGames"+this.games+"->"+games;
        this.games = games;
        this.updateUI();
    }
    resetScore()
    {
        Testhistory += ":"+this.id+"ResetScoreFrom"+this.score;
        this.score = 0;
        this.updateUI();
    }
    resetGames()
    {
        Testhistory += ":"+this.id+"ResetGamesFrom"+this.score;
        this.games = 0;
        this.updateUI();
    }


    updateUI()
    {
        this.updateScoreUI();
        this.takeServe();
    }

    takeServe()
    {
        this.hasServe = true;
        this.updateServeUI();
    }

    updateServeUI()
    {
        if(this.hasServe)
        {
            document.getElementById(this.id+"Side").children[4].style.display = "flex";
            document.getElementById(this.opponentId+"Side").children[4].style.display = "none";
        }
    }
    updateScoreUI()
    {
        document.getElementById(this.id+"Side").children[1].innerText = this.score;
    }
}

function editPlayer1()
{

}

function scorePlayer1()
{
    match.player1.increaseScore();
    if (match.player1.score >= 11 && match.player1.score - match.player2.score >=2 )
    {//Player1 win
        match.player1.win(match, match.palyer2);
    }
}
function decreaseScorePlayer1()
{
    match.player1.decreaseScore();
}

function letCallPlayer1()
{

}

function otherPlayer1()
{

}


function editPlayer2()
{
    
}

function scorePlayer2()
{
    match.player2.increaseScore();
    if (match.player2.score >= 11 && match.player2.score - match.player1.score >=2 )
    {//Player1 win
        match.player2.win(match, match.palyer1);
    }
}

function decreaseScorePlayer2()
{
    match.player2.decreaseScore();
}

function letCallPlayer2()
{

}

function otherPlayer2()
{
    
}























class Clock
{
    constructor (elementId)
    {
        this.totalSeconds = 0;
        this.paused = false;
        this.elementId = elementId;
        this.tick();
    }

    tick()
    {
        var self = this;
        if (!this.paused)
        {
            self.totalSeconds += 1;
            
            this.h = Math.floor(self.totalSeconds / 3600);
            this.m = Math.floor(self.totalSeconds / 60 % 60);
            this.s = parseInt(self.totalSeconds % 60);
            if (this.s < 10) {this.s = "0" + this.s};  // add zero in front of seconds < 10
            document.getElementById(self.elementId).innerHTML = (this.h <= 0) ? (this.m +":"+ this.s) : (this.h + ":" + this.m + ":" + this.s);
        }
    }

    pause () {
        this.paused = true;
    }
    
    resume () {
        this.paused = false;
    }
      
    toggle () {
        this.paused ? this.resume() : this.pause();
    }
      
}

function toggleClockColor()
{
    if (match.clock.paused)
    {
        document.getElementById("clockAreaCover").style = "background: red; opacity: 0.4;";
    }
    else 
    {
        document.getElementById("clockAreaCover").style = "opacity: 0.0;";
    }
}

function clockPlayPause()
{
    match.clock.toggle();
    match.currentGame.clock.toggle();
    toggleClockColor();
}

function updateClocksSync()
{
    match.clock.tick();
    match.currentGame.clock.tick();
    setTimeout(function(){updateClocksSync();}, 1000);
}

    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    var finalTranscript = '';
    var stopped = true;
    let recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
        recognition.stop(); 
        stopped = true;
      
      var current = event.resultIndex;
      // Get a transcript of what was said.
      var oldTrans = finalTranscript;
      var finalTranscript = event.results[current][0].transcript;
      
      var stopThis = (finalTranscript == oldTrans);
      
      var mobileRepeatBug = (current == 1 && finalTranscript == event.results[0][0].transcript);

      if(!mobileRepeatBug && !stopThis) {
        console.log(finalTranscript);
        if (finalTranscript == "Muhammed") finalTranscript = "Mohamed";
        if (finalTranscript.includes("Michael") || finalTranscript.includes("red") || finalTranscript.includes("one") || finalTranscript.includes("1"))
        {
            scorePlayer1();
        }
        else if (finalTranscript.includes("Mohamed") || finalTranscript.includes("mo")|| finalTranscript.includes("blue") || finalTranscript.includes("two") || finalTranscript.includes("2"))
        {
            scorePlayer2();
        }
        else if (finalTranscript.includes("pause") || finalTranscript.includes("break") || finalTranscript.includes("stop") || finalTranscript.includes("start"))
        {
            clockPlayPause();
        }
        
        document.getElementById('speechRecognitionBox').innerHTML = finalTranscript;
        
        
        setTimeout(function() {if (stopped) {recognition.start(); stopped = false;}}, 750);
        }
    }
    recognition.start();
    stopped = false;