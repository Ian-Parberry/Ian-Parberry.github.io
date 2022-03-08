/// \file ToH64.js
/// \brief Main JavaScript file for Towers of Hanoi with 64 discs.
///
/// \mainpage A Towers of Hanoi demonstrator for 64 discs.
///
/// Copyright Ian Parberry, January 2016.
/// This file is made available under the GNU All-Permissive License.
/// Copying and distribution of this file, with or without modification,
/// are permitted in any medium without royalty provided the copyright
/// notice and this notice are preserved.  This file is offered as-is,
/// without any warranty.
///
/// Created by <a href="http://larc.unt.edu/ian">Ian Parberry</a>, February 2016.
/// Last updated February 26, 2016.

var bluescreen = new Image();

var startstatetype = { ///< Start state type.
  bigbang: 0, now: 1, settlement: 2, biblical: 3, endtimes: 4,
  earth: 5, humans: 6, unix: 7, temple: 8, life: 9, dino: 10, 
  templebuilt: 11, century21: 12, year: 13, 
  aboutamonth: 14, week: 15, day: 16, hour: 17,
}; //startstate

var startState = startstatetype.bigbang; ///< Start state.
var restarted = false; ///< To guard against long reload times.

var bigCrunchState = -1; ///< State in amusing end of Universe animation.
var startBigCrunchStateTime = 0; ///< Time that we started the amusing end of Universe animation.

var moveCount = 0; ///< Number of moves since start.

const NUMDISCS = 64; ///< Number of discs.
var totalMoves = new BigNumber("18446744073709551615"); ///< Total number of moves to be made (precomputed for NUMDISCS)

var color= new Array(NUMDISCS); ///< Disc color array.

var pegHt; ///< Height of pegs in pixels. Varies with number of discs.

var discX = new Array(NUMDISCS); ///< X coordinates of discs.
var discY = new Array(NUMDISCS); ///< Y coordinates of discs.

const canvasWidth = 800; ///< Canvas width in pixels.
const canvasHeight = 600; ///< Canvas height in pixels.

const bigdiscWidth = 180; ///< Width of the biggest disc in pixels.
const smalldiscWidth = 16; ///< Width of the smallest disc in pixels.

var discWidth = new Array(NUMDISCS); ///< Width of each disc.
var discHeight = 8; ///< Height of all discs in pixels.

const pegX = [160, 400, 640]; ///< X coordinates of pegs in pixels.
const pegY = canvasHeight - 32; ///< Y coordinates of all pegs.

var count = new Array(3); ///< Number of discs on each peg.

var onPeg = new Array(NUMDISCS); ///< Which peg each disc is on.
var onPegTemp = new Array(NUMDISCS); ///< Which peg each disc is on, for temporary use.

var puzzle = new Array(3); ///< Internal representation of puzzle.

var dest; ///< Destination peg (0, 1, or 2).
var src; ///< Source peg.
var curDisc=-1; ///< Current disc (from 0 to NUMDISCS-1)
var curDiscAngle = 0; ///< Current disc angle for flip animation.

var startTime = 0; ///< Time that puzzle was started in milliseconds.
var startMoveParity = 0; ///< Parity of the start state.

///////////////////////////////////////////////////////////////////////////////////////////
// Universal counter

function universalCounter(){
  this.units = 0;
  this.thousands = 0;
  this.millions = 0;
  this.billions = 0;
  this.trillions = 0;
  this.quadrillions = 0;
  this.quintillions = 0;
} //universalCounter

var elapsedMoveCount = new universalCounter();
var remainingMoveCount = new universalCounter();

function incrementCount(counter){
  if(++counter.units >= 1000){
    counter.units = 0; 
    if(++counter.thousands >= 1000){
      counter.thousands = 0;
      if(++counter.millions >= 1000){
        counter.millions = 0;
        if(++counter.billions >= 1000){
          counter.billions = 0;
          if(++counter.trillions >= 1000){
            counter.trillions = 0;
            if(++counter.quadrillions >= 1000){
              counter.quadrillions = 0;
              ++counter.quintillions;
            } //if
          } //if
         } //if
       } //if
     } //if
   } //if
} //incrementCount

function decrementCount(counter){
  if(--counter.units < 0){
    counter.units = 999; 
    if(--counter.thousands < 0){
      counter.thousands = 999;
      if(--counter.millions < 0){
        counter.millions = 999;
        if(--counter.billions < 0){
          counter.billions = 999;
          if(--counter.trillions < 0){
            counter.trillions = 999;
            if(--counter.quadrillions < 0){
              counter.quadrillions = 0;
              --counter.quintillions;
            } //if
          } //if
         } //if
       } //if
     } //if
   } //if
} //decrementCount

function setCount(t, counter){
  counter.units = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart();
  counter.thousands = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart();  
  counter.millions = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart(); 
  counter.billions = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart(); 
  counter.trillions = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart();  
  counter.quadrillions = parseInt(t.intPart().mod(1000).valueOf());
  t = t.divide(1000).intPart(); 
  counter.quintillions = parseInt(t.valueOf());
} //setCount

///////////////////////////////////////////////////////////////////////////////////////////
// Universal timer

function universalTimer(){
  this.seconds = 0;
  this.minutes =  0;
  this.hours = 0;
  this.days = 0;
  this.weeks = 0;
  this.unityears = 0;
  this.thousandyears = 0;
  this.millionyears = 0;
  this.billionyears = 0;
} //universalTimer

var elapsedTime = new universalTimer();
var remainingTime = new universalTimer();

function incrementTime(timer){
  if(++timer.seconds >= 60){
    timer.seconds = 0;
    if(++timer.minutes >= 60){
      timer.minutes = 0;
      if(++timer.hours >= 24){
        timer.hours = 0;
        if(++timer.days >= 7){
          timer.days = 0;
          if(++timer.weeks >= 52){
            timer.weeks = 0;
            if(++timer.unityears >= 1000){
              timer.unityears = 0;            
              if(++timer.thousandyears >= 1000){
                timer.thousandyears = 0;           
                if(++timer.millionyears >= 1000){
                  timer.millionyears = 0;
                  ++timer.billionyears;
                } //if
              } //if
            } //if
          } //if
        } //if
      } //if
    } //if
  } //if
} //incrementTime

function decrementTime(timer){
  if(--timer.seconds < 0){
    timer.seconds = 59;
    if(--timer.minutes < 0){
      timer.minutes = 59;
      if(--timer.hours < 0){
        timer.hours = 23;
        if(--timer.days < 0){
          timer.days = 6;
          if(--timer.weeks < 0){
            timer.weeks = 51;
            if(--timer.unityears < 0){
              timer.unityears = 999;
              if(--timer.thousandyears < 0){
                timer.thousandyears = 999;
                if(--timer.millionyears < 0){
                  timer.millionyears = 999;
                  --timer.billionyears;
                } //if
              } //if
            } //if
          } //if
        } //if
      } //if
    } //if
  } //if
} //incrementTime

function setTime(t, timer){
  timer.seconds = parseInt(t.intPart().mod(60).valueOf());
  t = t.divide(60).intPart();
  
  timer.minutes = parseInt(t.mod(60).valueOf());
  t = t.divide(60).intPart();
  
  timer.hours = parseInt(t.mod(24).valueOf());
  t = t.divide(24).intPart();
  
  timer.days = parseInt(t.mod(7).valueOf());
  t = t.divide(7).intPart();
  
  timer.weeks = parseInt(t.mod(52).valueOf());
  t = t.divide(52).intPart();
  
  timer.unityears = parseInt(t.mod(1000).valueOf());
  t = t.divide(1000).intPart();
  
  timer.thousandyears = parseInt(t.mod(1000).valueOf());
  t = t.divide(1000).intPart();
  
  timer.millionyears = parseInt(t.mod(1000).valueOf());
  t = t.divide(1000).intPart();
  
  timer.billionyears = parseInt(t.valueOf());
} //setTime

///////////////////////////////////////////////////////////////////////////////////////////
// End universal timer

/// \brief Forecast which peg a disc will be on after a number of moves.
/// \param i Disc number.
/// \param m Number of moves.
/// \return Number of the peg that disc i will be on after m moves.

//function forecastPeg(i, m){
//  var denominator = new BigNumber(2);
//  denominator = denominator.pow(i+1);
//  var x = parseInt(m.divide(denominator).add(0.5).intPart().mod(3).valueOf());
//  return (i&1)^(NUMDISCS&1)? (3 - x)%3: x;
//} //forecastPeg

function timeMachine(ticks){
  //clear puzzle
  for(var i=0; i<3; i++)
    count[i] = 0;

  //compute location of discs
  var loc = new Array(NUMDISCS);

  if(startState == startstatetype.now)   
    for(var i=0; i<NUMDISCS; i++)
      loc[i] = 0;
  else if(startState == startstatetype.endtimes){ 
    for(var i=0; i<5; i++)
      loc[i] = 1;
    for(var i=5; i<NUMDISCS; i++)
      loc[i] = 2;
  } //else if
  else{
    const BREAKPOINT = 10; //JavaScript lets you have only 54 bit integers. We need 64 bits.

    for(var i=0; i<BREAKPOINT; i++){ //do the big ones with BigNumbers
      ticks = ticks.divide(2);
      var x = parseInt(ticks.add(0.5).intPart().mod(3).valueOf());
      loc[i] = (i&1)^(NUMDISCS&1)? (3 - x)%3: x;
      //loc[i] = forecastPeg(i, ticks);
    } //for
    
    var ticks2 = parseInt(ticks.valueOf());
    var t = 1;

    for(var i=BREAKPOINT; i<NUMDISCS; i++){ //do the small ones with regular numbers, it's faster
      var t2 = 2*t;
      var x = Math.floor((ticks2 + t)/t2)%3;
      loc[i] = (i&1)^(NUMDISCS&1)? (3 - x)%3: x;
      t = t2;
    } //for
  } //else

  //place discs - must be done bottom up
  for(var i=NUMDISCS-1; i>=0; i--){
    var peg = loc[i];
    puzzle[peg][++count[peg]] = i;

    discX[i] = pegX[peg]; 
    discY[i] = pegY - (count[peg] - 1)*discHeight;
    onPeg[i] = peg;
  } //for
} //timeMachine


function timeMachineRecent(ticks){
  //clear puzzle
  for(var i=0; i<3; i++)
    count[i] = 0;

  //compute location of discs
  var loc = new Array(NUMDISCS);

  var t = 1;

  for(var i=0; i<NUMDISCS; i++){  
    var t2 = 2*t;
    var x = Math.floor((ticks + t)/t2)%3;
    loc[i] = (i&1)^(NUMDISCS&1)? (3 - x)%3: x;
    t = t2;
  } //for

  //place discs - must be done bottom up
  for(var i=NUMDISCS-1; i>=0; i--){
    var peg = loc[i];
    puzzle[peg][++count[peg]] = i;

    discX[i] = pegX[peg]; 
    discY[i] = pegY - (count[peg] - 1)*discHeight;
    onPeg[i] = peg;
  } //for
} //timeMachineRecent

function reset(){ 
  moveCount = 0;
  curDisc = -1;
  restarted = true; 
  bigCrunchState = -1;

  var time = new Date();
  startTime = time.getTime();
  var st = Math.floor(startTime/1000.0);

  var remainingMoves = new BigNumber(totalMoves);

  const secondsInYear = 7*52*24*3600;
  
  var movesMadeAlready = new BigNumber(0);

  switch(startState){
    case startstatetype.bigbang:
      movesMadeAlready.set("13814655339");
      movesMadeAlready = movesMadeAlready.multiply(secondsInYear);
      movesMadeAlready = movesMadeAlready.add(st);
      timeMachine(movesMadeAlready);
      break;  
      
    case startstatetype.earth:
      movesMadeAlready.set("144668160046652138");
      movesMadeAlready = movesMadeAlready.add(st);
      timeMachine(movesMadeAlready);
      break;
         
    case startstatetype.life:
      movesMadeAlready.set("110073611738193261");
      movesMadeAlready = movesMadeAlready.add(st);
      timeMachine(movesMadeAlready);
      break;     
         
    case startstatetype.dino:
      movesMadeAlready.set(st + 7233408184676694);
      timeMachineRecent(st + 7233408184676694);
      break;
      
    case startstatetype.humans:
      movesMadeAlready.set(st + 69189121736371);
      timeMachineRecent(st + 69189121736371);
      break;

    case startstatetype.settlement:
      movesMadeAlready.set(st + 2201472284756);
      timeMachineRecent(st + 2201472284756);
      break;
      
    case startstatetype.biblical:     
      movesMadeAlready.set(st + (4004+1970)*secondsInYear + 70*24*3600);   
      timeMachineRecent(st + (4004+1970)*secondsInYear + 70*24*3600);
      break;

    case startstatetype.templebuilt:   
      movesMadeAlready.set(st + (1970-500)*secondsInYear + 70*24*3600);  
      timeMachineRecent(st + (1970-500)*secondsInYear + 70*24*3600);
      break;
         
    case startstatetype.temple:    
      movesMadeAlready.set(st + 5975423165);
      timeMachineRecent(st + 5975423165);
      break;

    case startstatetype.unix:
      movesMadeAlready.set(st);
      timeMachineRecent(st);
      break;

    case startstatetype.now:
      movesMadeAlready.set(0);
      timeMachine(movesMadeAlready);
      break;    

    case startstatetype.endtimes:
      movesMadeAlready.set(remainingMoves.subtract(31));
      timeMachine(movesMadeAlready);
      break;
      
    case startstatetype.century21: 
      movesMadeAlready.set(st - 946684800);   
      timeMachineRecent(st - 946684800);
      break;
         
    case startstatetype.year: 
      movesMadeAlready.set(31449600);   
      timeMachineRecent(31449600);
      break;
         
    case startstatetype.aboutamonth: 
      movesMadeAlready.set(2592000);   
      timeMachineRecent(2592000);
      break;
         
    case startstatetype.week: 
      movesMadeAlready.set(604800);   
      timeMachineRecent(604800);
      break;
         
    case startstatetype.day: 
      movesMadeAlready.set(86400);   
      timeMachineRecent(86400);
      break;
         
    case startstatetype.hour: 
      movesMadeAlready.set(3600);   
      timeMachineRecent(3600);
      break;
  } //switch

  remainingMoves = remainingMoves.subtract(movesMadeAlready);

  setTime(movesMadeAlready, elapsedTime);
  setTime(remainingMoves, remainingTime);
  
  setCount(movesMadeAlready, elapsedMoveCount);
  setCount(remainingMoves, remainingMoveCount);
  
  startMoveParity = elapsedMoveCount.units & 1;
} //reset

/// \brief Main initialization function.
/// Initialize global variables for the first time. This is only
/// called when the page is reloaded.

function init(){ 
  moveCount = 0;
  curDisc = -1;
  restarted = true;

  pegHt = (NUMDISCS + 1)*discHeight;
  var discWidthDelta = (bigdiscWidth - smalldiscWidth)/NUMDISCS;
  
  discWidth[NUMDISCS-1] = bigdiscWidth;
  for (var i=NUMDISCS-2; i>=0; i--)
    discWidth[i] = discWidth[i + 1] - discWidthDelta; 
  
  //create internal representation of puzzle
  for(var i=0; i<3; i++){
    puzzle[i] = new Array(NUMDISCS + 1);
    puzzle[i][0] = NUMDISCS; //sentinel
  } //for

  //choose semirandom colors for discs using linear congruential generation
  for(var i=0; i<NUMDISCS; i++){
    var j = (Math.floor(i*7) + 23)%64;
    var r = Math.floor(Math.floor(j%4))*47 + 80;
    var g = Math.floor((Math.floor(j/4)%4))*47 + 80;
    var b = Math.floor((Math.floor(j/16)%4))*47 + 80;  
    color[i] = 'rgba(' + r + ',' + g + ','  + b + ', 255)';
  } //for
  
  color[0] = 'rgba(255, 0, 0, 255)'; //make the smallest one red 
  bluescreen.src = 'bluescreen.png'; //load blue screen image 
  document.getElementById('bigbang').checked = true; //thank you, Firefox, for making this necessary on page reload
  
  reset(); //reset to initial conditions

  window.requestAnimationFrame(composeFrame); //start animation
} //init

/// \brief Linear interpolation.
/// \param x First value.
/// \param y Second value.
/// \param a Linear interpolation fraction.
/// \return Linearly interpolate between x and y by fraction a.

function lerp(x, y, a){
  return (1-a)*x + a*y;
} //lerp

/// \brief Cubic spline.
/// \param x Number between 0 and 1.
/// \return Cubic spline of x.

function spline3(x){
  return x*x*(3.0 - 2.0*x);
} //spline3

function completeCurrentMove(){
  discX[curDisc] = pegX[dest];
  discY[curDisc] = pegY - count[dest]*discHeight;
  puzzle[dest][++count[dest]] = curDisc;
  count[src]--;
  onPeg[curDisc] = dest;
  moveCount++;

  incrementTime(elapsedTime);
  decrementTime(remainingTime);

  incrementCount(elapsedMoveCount);
  decrementCount(remainingMoveCount);
} //completeCurrentMove

function computeCoords(ms){  
  discX[curDisc] = lerp(pegX[src], pegX[dest], ms);  

  var mid = pegY - ((count[src] + count[dest] - 1)*discHeight)/2;
  var hfactor = ((src + dest) == 2)? 2*Math.max(mid, count[1]*discHeight): 800;
  var quadratic = ms*(1 - ms);
  discY[curDisc] = lerp((pegY - (count[src] - 1)*discHeight), pegY - count[dest]*discHeight, ms) - quadratic*hfactor;

  curDiscAngle = (src < dest) && ((src +dest) == 2)? (ms*Math.PI): 0;
} //computeCoords

/// \brief Get positions for all the discs from current time.

function move(){ 
  if(count[2] >= NUMDISCS)return;
  
  var time = new Date();
  var dt = time.getTime() - startTime;
  var ticks = Math.floor(dt/1000);
  var ms = (dt%1000)/1000;

  //animation for moving disc
  if(((ticks + startMoveParity)&1) == 0){ //smallest disc
    if(curDisc > 0)
      completeCurrentMove();

    curDisc = 0;
    src = onPeg[0];
    dest = (src + 1)%3;
    computeCoords(ms);
  } //if
  else{ //other disc
    if(curDisc == 0)
      completeCurrentMove();

    //find src, dest, and curDisc for current move
    //it's not the smallest disc, its the other legal move (there can be only one)
   
    var top = new Array(3); //shorthand for which disc is on top of which peg

    for(var i=0; i<3; i++)
      top[i] = puzzle[i][count[i]];

    //excluding the peg disc 0 is on, src is the peg with the smallest top disc,
    //dest is the other peg, and curDisc is the disc on top of the src peg
    if(top[0] == 0){ //src and dest are pegs 1, 2
      if(top[1] < top[2]){
        src = 1; dest = 2; curDisc = top[src];
      } //if
      else{ 
        src = 2; dest = 1; curDisc = top[src];
      } //else
    } //if
    else if(top[1] == 0){ //src and dest are pegs 0, 2
      if(top[0] < top[2]){
        src = 0; dest = 2; curDisc = top[src];
      } //if
      else{
        src = 2; dest = 0; curDisc = top[src];
      } //else
    } //if
    else{ //src and dest are pegs 0, 1
      if(top[0] < top[1]){
        src = 0; dest = 1; curDisc = top[src];
      } //if
      else{
        src = 1; dest = 0; curDisc = top[src];
      } //else
    } //else
    //now src, dest, and curDisc are set correctly

    computeCoords(ms);
  } //else
} //move

/// \brief Draw the discs.
/// \param ctx 2D context for canvas.

function drawDiscs(ctx){
  var atHome = true;

  for(var i=NUMDISCS-1; i>=0; i--){
    ctx.save();
    ctx.lineWidth = 2;

    //draw arrow next to smallest unmoved disc
    if(atHome && (discX[i] != pegX[0])){
      atHome = false;
      var x = discX[i+1] - discWidth[i+1]/2 - 45;
      var y = discY[i+1] - discHeight/2;

      ctx.beginPath();
      ctx.moveTo(x , y);
      ctx.lineTo(x + 30, y);
      ctx.stroke();

      ctx.moveTo(x + 30, y);
      ctx.lineTo(x + 20, y-5);
      ctx.stroke();

      ctx.moveTo(x + 30, y);
      ctx.lineTo(x + 20, y+5);
      ctx.stroke();
    } //if

    var grd = ctx.createLinearGradient(0, 0.75*discHeight, 0, -discHeight);
    grd.addColorStop(1, color[i]); 
    grd.addColorStop(0, 'black'); //shadow for illusion of curvature

    ctx.fillStyle = grd;
    ctx.translate(discX[i], discY[i]);

    
    if(i == curDisc) 
      ctx.rotate(curDiscAngle);
    
    //rounded ends
    ctx.beginPath();
    ctx.arc(-discWidth[i]/2, -discHeight/2, discHeight/2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(discWidth[i]/2, -discHeight/2, discHeight/2, 0, 2 * Math.PI);
    ctx.fill();

    //rectangular body
    ctx.fillRect(-discWidth[i]/2, -discHeight, discWidth[i], discHeight);

    ctx.restore();
  } //for
} //drawDiscs

/// \brief Draw the puzzle base.
/// \param ctx 2D context for canvas.

function drawBase(ctx){
  const pegWidth = 16;
  const baseHt = 16;

  ctx.fillStyle = 'rgba(224, 182, 64, 255)';
  ctx.lineWidth = 4;
  ctx.fillRect(32, pegY, canvasWidth - 64, baseHt);
} //drawBase

function appendIfNonzero(n, s){
  var result = "";
  if(n > 0)
    result = n + s;
  return result;
} //appendIfNonzero

function makeDateString(timer){
  var result = "";
  var nonzero = false;
  
  if(timer.billionyears > 0)
    result = result  + timer.billionyears + " billion";
 nonzero = nonzero || (timer.billionyears > 0);

  if(timer.millionyears > 0)
    result = result + (nonzero? ", ": "") + timer.millionyears + " million";
 nonzero = nonzero || (timer.millionyears > 0);

  if(timer.thousandyears > 0)
    result = result + (nonzero? ", ": "") + timer.thousandyears + " thousand";
 nonzero = nonzero || (timer.thousandyears > 0);

  if(timer.unityears > 0)
    result = result + (nonzero? ", ": "") + timer.unityears + (timer.unityears == 1? " year": " years");
  nonzero = nonzero || (timer.unityears > 0);
 
  if(timer.weeks > 0)
    result = result + (nonzero? ", ": "") + timer.weeks + (timer.weeks == 1? " week": " weeks");
  nonzero = nonzero || (timer.weeks > 0);

  if(timer.days > 0)
    result = result + (nonzero? ", ": "") + timer.days + (timer.days == 1? " day": " days");
  nonzero = nonzero || (timer.days > 0);

  if(timer.hours > 0)
    result = result + (nonzero? ", ": "") + timer.hours + (timer.hours == 1? " hour": " hours");
  nonzero = nonzero || (timer.hours > 0);

  if(timer.minutes > 0)
    result = result + (nonzero? ", ": "") + timer.minutes + (timer.minutes == 1? " minute": " minutes");
  nonzero = nonzero || (timer.minutes > 0);

  if(!nonzero || (nonzero && (timer.seconds > 0)))
    result = result + (nonzero? ", ": "") + timer.seconds + (timer.seconds == 1? " second": " seconds");

  return result;
} //makeDateString

function makeCountString(counter){
   var result = "";
  var nonzero = false;

  if(counter.quintillions > 0)
    result = result + counter.quintillions + " quintillion";
  nonzero = nonzero || (counter.quintillions > 0);
  
  if(counter.quadrillions > 0)
    result = result + (nonzero? ", ": "") + counter.quadrillions + " quadrillion";
  nonzero = nonzero || (counter.quadrillions > 0);
  
  if(counter.trillions > 0)
    result = result + (nonzero? ", ": "") + counter.trillions + " trillion";
  nonzero = nonzero || (counter.trillions > 0);
  
  if(counter.billions > 0)
    result = result + (nonzero? ", ": "") + counter.billions + " billion";
  nonzero = nonzero || (counter.billions > 0);
  
  if(counter.millions > 0)
    result = result + (nonzero? ", ": "") + counter.millions + " million";
  nonzero = nonzero || (counter.millions > 0);
  
  if(counter.thousands > 0)
    result = result + (nonzero? ", ": "") + counter.thousands + " thousand";
  nonzero = nonzero || (counter.thousands > 0);
  
  if(counter.units > 0)
    result = result + (nonzero? ", ": "") + counter.units;
  nonzero = nonzero || (counter.units > 0);

  if(!nonzero)
    result = "0";

  return result;
} //makeCountString

/// \brief Draw canvas text.
/// Draw the number of moves.
/// \param ctx 2D context for canvas.

function drawText(ctx){      
  if(count[2] < NUMDISCS){
    ctx.fillStyle = 'rgba(128, 128, 128, 255)';
    ctx.font = "16px sans-serif";
    ctx.textAlign = 'left';

    switch(startState){    
      case startstatetype.bigbang:
      case startstatetype.earth:
      case startstatetype.life:
      case startstatetype.dino:
      case startstatetype.humans:
      case startstatetype.settlement:       
      case startstatetype.biblical:      
      case startstatetype.temple:      
      case startstatetype.templebuilt: 
      case startstatetype.unix:
      case startstatetype.century21:
        //all numbers are large
        ctx.fillText(makeCountString(elapsedMoveCount) + " moves made in", 10, 30);
        ctx.fillText(makeDateString(elapsedTime) + ".", 10, 50);
        ctx.fillText(makeCountString(remainingMoveCount) + " moves to go in", 10, 75);
        ctx.fillText(makeDateString(remainingTime) + ".", 10, 95);
        break;
        
      case startstatetype.year:
      case startstatetype.aboutamonth:
      case startstatetype.week:
      case startstatetype.day:
      case startstatetype.hour:
      case startstatetype.now: 
        //number of moves made is small
        ctx.fillText(makeCountString(elapsedMoveCount) + " moves made in " + makeDateString(elapsedTime) + ".", 10, 30);
        ctx.fillText(makeCountString(remainingMoveCount) + " moves to go in", 10, 55);
        ctx.fillText(makeDateString(remainingTime) + ".", 10, 75);
        break;
           
      case startstatetype.endtimes:
        //number of moves to go is small
        ctx.fillText(makeCountString(elapsedMoveCount) + " moves made in", 10, 30);
        ctx.fillText(makeDateString(elapsedTime) + ".", 10, 50);
        ctx.fillText(makeCountString(remainingMoveCount) + " moves to go in " + makeDateString(remainingTime) + ".", 10, 75);
        break;
    } //switch
  } //if
  else{ 
    var time = new Date();

    if(bigCrunchState < 0){
      bigCrunchState = 0;   
      startBigCrunchStateTime = Math.floor(time.getTime()/1000);
    } //if
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'white';
    ctx.font = "32px sans-serif";
    ctx.textAlign = 'center';
    
    if(bigCrunchState == 0){
      ctx.drawImage(bluescreen, 0, 0);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 10){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //if
      
    else if(bigCrunchState == 1){
      ctx.fillText("This Universe has now been terminated", canvasWidth/2, canvasHeight/2 - 20);
      ctx.font = "26px sans-serif";
      ctx.fillText("We apologize for the inconvenience", canvasWidth/2, canvasHeight/2 + 10);
      ctx.font = "18px sans-serif";
      ctx.fillText("and hope that you will recommend us to your friends", canvasWidth/2, canvasHeight/2 + 35);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 7){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 2){
      ctx.fillText("Pity, really. I rather liked that one.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 3){
    ctx.font = "30px sans-serif";
      ctx.fillText("If you must know, I'm just a teensy bit miffed.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 4){
      ctx.font = "26px sans-serif";
      ctx.fillText("I go to all that trouble making flowers and sunsets", canvasWidth/2, canvasHeight/2 - 30);
      ctx.fillText("and clouds and hedgehogs with snuffly snouts, then", canvasWidth/2, canvasHeight/2);
      ctx.fillText("some twit goes and finishes the Tower of Brahma.", canvasWidth/2, canvasHeight/2 + 30);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 10){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 5){
      ctx.fillText("Thank you very much said nobody at all, ever.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if

    } //else if
    else if(bigCrunchState == 6){
      ctx.fillText("I don't know why I bother, really.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if
      
    else if(bigCrunchState == 7){
      ctx.fillText("There's never any gratitude.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 8){
      ctx.fillText("Some days it just isn't worth getting out of bed.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 9){
      ctx.font = "30px sans-serif";
      ctx.fillText("The rules say that I have to restart", canvasWidth/2, canvasHeight/2-20);
      ctx.fillText("this thing and restore it from backup.", canvasWidth/2, canvasHeight/2+20);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 10){
      ctx.font = "26px sans-serif";
      ctx.fillText("Mind you, I'm not advocating a slavish adherence to rules", canvasWidth/2, canvasHeight/2-35);
      ctx.fillText("in all circumstances. That takes one too many steps down", canvasWidth/2, canvasHeight/2);
      ctx.fillText("the slippery slope to the Nanny State if you ask me.", canvasWidth/2, canvasHeight/2 + 35);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 10){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 11){
      ctx.fillText("Is anybody out there listening to me?", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 2){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 12){
      ctx.fillText("Hello? Is there anybody out there?", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 2){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 13){
      ctx.fillText("Oh, of course there isn't. There's no space", canvasWidth/2, canvasHeight/2 - 20);
      ctx.fillText("or time any more. The Universe has crashed.", canvasWidth/2, canvasHeight/2+20);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 14){
      ctx.fillText("Duh. Silly me.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 3){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 15){
      ctx.fillText("Here's Muggins talking to ximself again.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 3){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 16){
      ctx.fillText("I'd better get this thing restarted before", canvasWidth/2, canvasHeight/2 - 35);
      ctx.fillText("somebody in Head Office notices. Their sense", canvasWidth/2, canvasHeight/2);
      ctx.fillText("of humour would fit into a gnat's belly button.", canvasWidth/2, canvasHeight/2 + 35);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 7){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 17){
      ctx.fillText("Between you and me, this crufty old hardware", canvasWidth/2, canvasHeight/2 - 35);
      ctx.fillText("should have been replaced a long time ago.", canvasWidth/2, canvasHeight/2);
      ctx.fillText("Let's see if it'll boot up one more time...", canvasWidth/2, canvasHeight/2 + 35);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 7){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 18){
      ctx.fillText("Oh look, somebody made a fresh pot of tea.", canvasWidth/2, canvasHeight/2 - 35);
      ctx.fillText("And there's crumpets with raspberry jam!", canvasWidth/2, canvasHeight/2);
      ctx.fillText("My favourite! I'm dying of thirst here.", canvasWidth/2, canvasHeight/2 + 35);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 7){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 19){
      ctx.fillText("BRB", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 2){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 20){
      ctx.fillText("This shouldn't take long. Promise.", canvasWidth/2, canvasHeight/2);

      if(Math.floor(time.getTime()/1000) - startBigCrunchStateTime >= 5){
        bigCrunchState++;
        startBigCrunchStateTime = Math.floor(time.getTime()/1000);
      } //if
    } //else if

    else if(bigCrunchState == 21){
      ctx.font = "52px monospace";
      ctx.textAlign = 'left';
      switch(Math.floor(time.getTime()/200)%4){
        case 0: ctx.fillText("Rebooting Universe -", 60, canvasHeight/2); break;
        case 1: ctx.fillText("Rebooting Universe \\", 60, canvasHeight/2); break;
        case 2: ctx.fillText("Rebooting Universe |", 60, canvasHeight/2); break;
        case 3: ctx.fillText("Rebooting Universe /", 60, canvasHeight/2); break;
      } //switch
      
      ctx.font = "24px monospace";
      
      switch(Math.floor(time.getTime()/527)%4){
        case 0: ctx.fillText("Installing update 1 of 85752724891227938183", 60, canvasHeight/2 + 40); break;
        case 1: ctx.fillText("Installing update 1 of 85752724891227938183.", 60, canvasHeight/2 + 40); break;
        case 2: ctx.fillText("Installing update 1 of 85752724891227938183..", 60, canvasHeight/2 + 40); break;
        case 3: ctx.fillText("Installing update 1 of 85752724891227938183...", 60, canvasHeight/2 + 40); break;
      } //switch
    } //else if
  } //else
} //drawText

/// \brief Draw text, base, and discs.

function draw(){
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.globalCompositeOperation = 'source-over';

  //clear canvas and draw black border
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight); 
  
  //draw 
  drawText(ctx); 
    
  if(count[2] < NUMDISCS){
    drawBase(ctx);
    drawDiscs(ctx);
  } //if

  window.requestAnimationFrame(composeFrame);
} //draw

/// \brief Compose a frame of animation.

function composeFrame(){
  move();
  draw();
} //composeFrame

function nowRadioButtonHandler(){
  startState = startstatetype.now;
  reset();
} //nowRadioButtonHandler

function endRadioButtonHandler(){
  startState = startstatetype.endtimes;
  reset();
} //endRadioButtonHandler

function bigbangRadioButtonHandler(){
  startState = startstatetype.bigbang;
  reset();
} //bigbangRadioButtonHandler

function settlementRadioButtonHandler(){
  startState = startstatetype.settlement;
  reset();
} //settlementRadioButtonHandler

function biblicalRadioButtonHandler(){
  startState = startstatetype.biblical;
  reset();
} //biblicalRadioButtonHandler

function earthRadioButtonHandler(){
  startState = startstatetype.earth;
  reset();
} //earthRadioButtonHandler

function humansRadioButtonHandler(){
  startState = startstatetype.humans;
  reset();
} //humansRadioButtonHandler

function unixRadioButtonHandler(){
  startState = startstatetype.unix;
  reset();
} //unixRadioButtonHandler

function templeRadioButtonHandler(){
  startState = startstatetype.temple;
  reset();
} //templeRadioButtonHandler

function templebuiltRadioButtonHandler(){
  startState = startstatetype.templebuilt;
  reset();
} //templebuiltRadioButtonHandler

function lifeRadioButtonHandler(){
  startState = startstatetype.life;
  reset();
} //lifeRadioButtonHandler

function dinoRadioButtonHandler(){
  startState = startstatetype.dino;
  reset();
} //dinoRadioButtonHandler

function century21RadioButtonHandler(){
  startState = startstatetype.century21;
  reset();
} //century21RadioButtonHandler

function yearRadioButtonHandler(){
  startState = startstatetype.year;
  reset();
} //yearRadioButtonHandler

function monthRadioButtonHandler(){
  startState = startstatetype.aboutamonth;
  reset();
} //monthRadioButtonHandler

function weekRadioButtonHandler(){
  startState = startstatetype.week;
  reset();
} //weekRadioButtonHandler

function dayRadioButtonHandler(){
  startState = startstatetype.day;
  reset();
} //dayRadioButtonHandler


function hourRadioButtonHandler(){
  startState = startstatetype.hour;
  reset();
} //hourRadioButtonHandler