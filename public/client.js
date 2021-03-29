/* global ko moment _ */

// client-side js
// run by the browser each time your view template is loaded

function Card(number, board) {
  this.color = "card" + number + board.theme;
  this.content = ko.observable(this.color + " hidden");
  this.hidden = true;
  this.paired = false;
   
  var self = this;
    
  function clearBoard() {
    board.hideTimeout = null;
    board.secondCard.clicked(board.secondCard, null, true);
    board.firstCard.clicked(board.firstCard, null, true);
    board.message("2 Aynı Kartı Seçmeyi dene!");
  }
   
  this.clicked = function (element, event, force) {
    
    if (board.startTime() === null) {
      board.startTime(moment());
      board.elapsedInterval = setInterval(function () {
        board.elapsed(moment().subtract(board.startTime()).format("ss"));
      }, 800);
    }
    
    force = force === undefined ? false : force;
    
    if (self.paired) {
      return;
    }
    if (!force && !self.hidden && board.shownCount === 1) {
      return;
    }
    if (!force && board.shownCount === 2) {
      if (board.hideTimeout) {
        clearTimeout(board.hideTimeout);
        clearBoard();
      }
    }

    if (self.hidden) {
      self.hidden = false;
      self.content(self.color);
      board.shownCount += 1;
       
      if (board.shownCount === 1) {
        board.firstCard = self;
        board.message("Tamam.");
      }
      if (board.shownCount === 2) {
        board.secondCard = self;
        if (self.color === board.firstCard.color) {
          self.content(self.color + " paired");
          self.paired = true;
          board.firstCard.content(board.firstCard.color + " paired");
          board.firstCard.paired = true;
          board.shownCount = 0;
          board.pairsLeft -= 1;
          if (board.pairsLeft === 0) {
            clearInterval(board.elapsedInterval);
            board.elapsedInterval = null;
            board.message("Sen kazandın Hemde " +
            "<span class=\"time\">" + board.elapsed() + " Saniyede</span>!<br/>" +
            "Yeniden Denenemek için Sayfayı Yenile");
          } else {
            board.message("Süpersin! Yeniden Dene");
          }
        } else {
          board.message("Yeniden Dene!");
          board.hideTimeout = setTimeout(clearBoard, 5000);
        }
      }
    } else {
      self.hidden = true;
      self.content(self.color + " hidden");
      board.shownCount -= 1;
      if (board.firstCard === self) {
        board.firstCard = board.secondCard;
        board.secondCard = null;
      }
      if (board.secondCard === self) {
        board.secondCard = null;
      }
    }
  };
}
 
function generateCards(board) {
  var cards = [];
  for (var i = 0; i < 16; i++) {
    cards.push(new Card((Math.floor(i / 2) + 1), board));
  }
  return _.shuffle(cards);
}
 
function BoardModel(theme) {
  this.theme = theme;
  
  this.startTime = ko.observable(null);
  this.cards = ko.observableArray(generateCards(this));
  this.shownCount = 0;
  this.firstCard = null;
  this.secondCard = null;
  this.message = ko.observable("Resim Seçilmedi");
  this.pairsLeft = 8;
  
  this.hideTimeout = null;
  this.elapsedInterval = null;
  
  this.elapsed = ko.observable("00.0");
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
 
$(function() {
  var theme = getParameterByName("theme");
  window.model = new BoardModel(theme);
  ko.applyBindings(window.model);
});
