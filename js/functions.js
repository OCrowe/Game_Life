    var GOL = function (setup) {
        var CellY = setup["startCells"].length,
            CellX = setup["startCells"][0].length,
            CellWidth = setup["CellWidth"]  = 10,
            CellHeight = setup["CellHeight"] = 10,
            startCells = setup["startCells"] || [],
            canvasId = setup["canvasId"] || "life",

      cellColour = setup["cellColour"] || true,

      CellArray = [],
      display = new GameDisplay(CellX, CellY, CellWidth, CellHeight, canvasId, cellColour),
      interval = null,
    
      init = function() {
    
        var lengthY = startCells.length,
            lengthX,
            x, y;
        for (y = 0; y < lengthY; y++) {
          lengthX = startCells[y].length;
          for (x = 0; x < lengthX; x++) {
            var state = (startCells[y][x] == 0) ? 'alive' : 'dead';

            startCells[y][x] = new Cell(x, y, state);
          }
        }
        CellArray = startCells;
        display.update(CellArray);
      },

      nextGenCells = function() {
        var CurrentGen = CellArray,
            nextGen = [],   
            lengthY = CellArray.length,
            lengthX,
            y, x;
        
        for (y = 0; y < lengthY; y++) {
          lengthX = CurrentGen[y].length;
          nextGen[y] = []; 
          
          for (x = 0; x < lengthX; x++) {
           
            var cell = CurrentGen[y][x];
            
            var rowUp = (y-1 >= 0) ? y-1 : lengthY-1; 
            var rowDown = (y+1 <= lengthY-1) ? y+1 : 0;
            var columnLeft = (x-1 >= 0) ? x-1 : lengthX - 1; 
            var columnRight = (x+1 <= lengthX-1) ? x+1 : 0; 

            var neighbours = {
              topLeft: CurrentGen[rowUp][columnLeft].clone(),
              topCenter: CurrentGen[rowUp][x].clone(),
              topRight: CurrentGen[rowUp][columnRight].clone(),
              left: CurrentGen[y][columnLeft].clone(),
              right: CurrentGen[y][columnRight].clone(),
              bottomLeft: CurrentGen[rowDown][columnLeft].clone(),
              bottomCenter: CurrentGen[rowDown][x].clone(),
              bottomRight: CurrentGen[rowDown][columnRight].clone()
            };

            var aliveCount = 0;
            var deadCount = 0;
            for (var neighbour in neighbours) {
              if (neighbours[neighbour].getState() == "dead") {
                deadCount++;
              } else {
                aliveCount++;
              }
            }
              
            var newState = cell.getState();
            if (cell.getState() == "alive") {
              if (aliveCount < 2 || aliveCount > 3) {
                newState = "dead";
              } else if (aliveCount == 2 || aliveCount == 3) {
                newState = "alive";
              }
            } else {
              if (aliveCount == 3) {
                newState = "alive";
              }
            }
            nextGen[y][x] = new Cell(x, y, newState);
            }
        }
        return nextGen;
      };
    
init();
  return {
    step: function(){
      var nextGen = nextGenCells();
      CellArray = nextGen;
      display.update(CellArray);
    },
    getCurrentGenCells: function() {
      return CellArray;
    },
    setTheInterval: function(theInterval) {
      interval = theInterval;
    },
    getInterval: function() {
      return interval;
    }
  };
};

var Cell = function(xPos, yPos, state) {
    
  return {
    xPos: xPos,
    yPos: yPos,
    state: state,
    getXPos: function() {
      return xPos;
    },
    getYPos: function() {
      return yPos;
    },
    getState: function() {
      return state;
    },
    setState: function(newState) {
      state = newState;
    },
    clone: function() {
      return new Cell(xPos, yPos, state);
    }
  };
};

var GameDisplay = function(CellX, CellY, CellWidth, CellHeight, canvasId, cellColour) {
    
  var canvas = document.getElementById(canvasId),
      ctx = canvas.getContext && canvas.getContext('2d'),
      widthPixels = CellX * CellWidth,
      heightPixels = CellY * CellHeight,
      
      updateCells = function(CellArray) {
        var lengthY = CellArray.length,
            lengthX,
            y, x;
        for (y = 0; y < lengthY; y++) {
          lengthX = CellArray[y].length;
          for (x = 0; x < lengthX; x++) {
            drawCell(CellArray[y][x]);
          }
        }
      },
      drawCell = function(cell) {
       
        var startX = cell.getXPos() * CellWidth,
            startY = cell.getYPos() * CellHeight;
          
        if (cell.getState() == "alive") {
            
          if (cellColour == true) {
            var r=Math.floor(Math.random()*256),
                g=Math.floor(Math.random()*256),
                b=Math.floor(Math.random()*256);
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          }
          ctx.fillRect(startX, startY, CellWidth, CellHeight);
        } else {
          ctx.clearRect(startX, startY, CellWidth, CellHeight);
        }
      },
      
      init = function() {
          
        canvas.width = widthPixels;
        canvas.height = heightPixels;
          
      };
    
  init();
    
  return {
      
    update: function(CellArray) {
      updateCells(CellArray);
        
    }
  };
};