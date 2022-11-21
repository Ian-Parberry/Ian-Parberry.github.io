/// \file ToH.js
/// \brief Main JavaScript file for Towers of Hanoi.
///
/// \mainpage A Towers of Hanoi demonstrator.
///
/// Copyright Ian Parberry, January 2016.
/// This file is made available under the GNU All-Permissive License.
/// Copying and distribution of this file, with or without modification,
/// are permitted in any medium without royalty provided the copyright
/// notice and this notice are preserved.  This file is offered as-is,
/// without any warranty.
///
/// Created by <a href="https://ianparberry.com">Ian Parberry</a>, January 2016.
/// Last updated February 24, 2016.

var motionstate = { ///< Motion state enumerated type for moving disc.
  up: 0, across: 1, down: 2, idle: 3,
}; //motionstate

var motionrestriction = { ///< Motion restrictions enumerated type for moving disc.
  none: 0, throughleft: 1, throughcenter: 2, throughright: 3, rotateright: 4, rotateleft: 5,
}; //motionrestriction

var curMotionRestriction = motionrestriction.none; ///< Current restriction on disc motion.
var showRestrictionIndicator = false; ///< Whether to show restriction indicator on screen.

var restrictionIndicatorThru = new Image(); ///< Image that shows a through peg move restriction is in place.
var restrictionIndicatorLRot = new Image(); ///< Image that shows a right rotation move restriction is in place.
var restrictionIndicatorRRot = new Image(); ///< Image that shows a left rotation move restriction is in place.

var rank = ///< Earned rank, humorous.
  ['', '', '', 
  'Acolyte', 'Not a Complete Idiot', 'Not As Dumb As You Look',
    'Quite Good, Really', 'Inhumanly Good', 'Too Much Time On Your Hands', 
    'Obsessive Compulsive', 'You Really Should Get Out More'];

var movesSinceReset = 0; ///< Number of moves since puzzle was reset.
var showMoveCount = false; ///< Whether to show movesSinceLastReset on screen.

const MAXDISCS = 10; ///< Maximum number of discs allowed.
const MINDISCS = 3; ///< Maximum number of discs allowed.

var animationState = motionstate.idle; ///< Current animation state.
var myclock = 0; ///< Time stamp for Euler integration.

const defaultNumDiscs = 6; ///< Default number of discs when first loaded.
var numDiscs; ///< Number of discs.

var pegHt; ///< Height of pegs in pixels. Varies with number of discs.

var curDisc; ///< Current disc.
var dragDisc=-1; ///< Disc currently being dragged by mouse, negative if none.

var discX = new Array(MAXDISCS); ///< X coordinates of discs.
var discY = new Array(MAXDISCS); ///< Y coordinates of discs.

var animating = true; ///< True if animating disc motion.
var userPlay = false; ///< True if the user is trying to solve the puzzle themselves.

const canvasWidth = 800; ///< Canvas width in pixels.
const canvasHeight = 600; ///< Canvas height in pixels.

const bigdiscWidth = 180; ///< Width of the biggest disc in pixels.
const smalldiscWidth = 60; ///< Width of the smallest disc in pixels.

var discWidth  = new Array(MAXDISCS); ///< Width of each disc, varies with number of discs.
var discHeight = 39; ///< Height of all discs in pixels, varies with number of discs.

const pegX = [160, 400, 640]; ///< X coordinates of pegs in pixels.
const pegY = 536; ///< Y coordinates of all pegs.
var nearestPeg = -1; ///< Index of peg closest to dragDisc in player mode, negative if none.

var floatHeight; ///< Height in pixels that disc will float up to in auto solve. Should be above pegs.

var puzzle = new Array(3); ///< Stack of discs on each peg, with a sentinel at the bottom.
var count = new Array(3); ///< Number of discs on each peg.
var onPeg = new Array(MAXDISCS); ///< Which peg each disc is on.
var onPegTemp = new Array(MAXDISCS); ///< Which peg each disc is on, for temporary use.

var srcPeg = 0; ///< Index of source peg for current move in autosolve.
var destPeg = 0; ///< Index of destination peg for current move in autosolve.

var moveArray; ///< Array of moves for autosolve. 
var requiredMoves; ///< Number of moves used by autosolve. Recomputed when number of discs changes.
var curMove; ///< Current move for autosolve, index into moveArray.
var numMoves; ///< Number of moves in moveArray.

var speed = 1.0; ///< Speed factor for animation. Changes with radio buttons. Set to at least 8.0 for jump animation.

var slideSound = new Audio('slide.wav'); ///< Sound of disc sliding on peg.
var clickSound = new Audio('click.wav'); ///< Sound of disc landing.
var winSound = new Audio('win.wav'); ///< Sound played when puzzle is complete.
var audioEnabled = true; ///< Sounds are to be played.

var colorArray = [  ///< Array of disc colors. Make sure this is large enough.
'rgba(255, 60, 60, 255)',
'rgba(44, 205, 44, 255)',
'rgba(80, 160, 255, 255)',
'rgba(255, 128, 255, 255)',
'rgba(128, 255, 255, 255)',
'rgba(255, 255, 64, 255)',
'rgba(173, 64, 255, 255)',
'rgba(198, 255, 24, 255)',
'rgba(255, 168, 64, 255)',
'rgba(200, 200, 255, 255)'];

var singleMove = false; ///< True if the animation stops after one step.

var delayTime = 0; ///< Delay to wait between moves when doing jump animation.
var startDelayTime = 0; ///< Last time we did a jump animation. step

var rainbowColors = true; ///< True for rainbow colored discs, false for alternating 2-color.

var didNotCheat = true; ///< True if the player did not cheat using autosolve.

/// \brief Towers of Hanoi solve from any initial state.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscs(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    moveDiscs(work, d - 1); //move discs 0..d-1 to work peg

    //move disc d to destination peg
    moveArray[numMoves++] = [src, dest]; //record in move array to be played later
    onPegTemp[d] = dest; //record in temporary peg array

    moveDiscs(dest, d - 1); //move discs 0..d-1 to destination peg
  } //if
} //moveDiscs

/// \brief Towers of Hanoi solve only moving discs to and from left peg.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state and only making moves to and from left peg.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscsViaLeftPeg(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    if(src == 0 || dest == 0) { //one of src or dest is the left peg
      moveDiscsViaLeftPeg(work, d - 1); //move discs 0..d-1 to work peg

      //move disc d to destination peg
      moveArray[numMoves++] = [src, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaLeftPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
    else {
      moveDiscsViaLeftPeg(dest, d - 1); //move discs 0..d-1 to dest peg

      //move disc d to work peg
      moveArray[numMoves++] = [src, work]; //record in move array to be played later
      onPegTemp[d] = work; //record in temporary peg array
    
      moveDiscsViaLeftPeg(src, d - 1); //move discs 0..d-1 back to src peg
      
      //move disc d to destination peg
      moveArray[numMoves++] = [work, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaLeftPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //else
  } //if
} //moveDiscsViaLeftPeg

/// \brief Towers of Hanoi solve only moving discs to and from center peg.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state and only making moves to and from center peg.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscsViaCenterPeg(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    if(src == 1 || dest == 1) { //one of src or dest is the center peg
      moveDiscsViaCenterPeg(work, d - 1); //move discs 0..d-1 to work peg

      //move disc d to destination peg
      moveArray[numMoves++] = [src, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaCenterPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
    else {
      moveDiscsViaCenterPeg(dest, d - 1); //move discs 0..d-1 to dest peg

      //move disc d to work peg
      moveArray[numMoves++] = [src, work]; //record in move array to be played later
      onPegTemp[d] = work; //record in temporary peg array
    
      moveDiscsViaCenterPeg(src, d - 1); //move discs 0..d-1 back to src peg
      
      //move disc d to destination peg
      moveArray[numMoves++] = [work, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaCenterPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //else
  } //if
} //moveDiscsViaCenterPeg

/// \brief Towers of Hanoi solve only moving discs to and from right peg.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state and only making moves to and from right peg.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscsViaRightPeg(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    if(src == 2 || dest == 2) { //one of src or dest is the right peg
      moveDiscsViaRightPeg(work, d - 1); //move discs 0..d-1 to work peg

      //move disc d to destination peg
      moveArray[numMoves++] = [src, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaRightPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
    else {
      moveDiscsViaRightPeg(dest, d - 1); //move discs 0..d-1 to dest peg

      //move disc d to work peg
      moveArray[numMoves++] = [src, work]; //record in move array to be played later
      onPegTemp[d] = work; //record in temporary peg array
    
      moveDiscsViaRightPeg(src, d - 1); //move discs 0..d-1 back to src peg
      
      //move disc d to destination peg
      moveArray[numMoves++] = [work, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsViaRightPeg(dest, d - 1); //move discs 0..d-1 to destination peg
    } //else
  } //if
} //moveDiscsViaRightPeg

/// \brief Towers of Hanoi solve with moves that rotate right.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state and only making moves rightwards
/// and rotated back to start.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscsRotateRight(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    if((src + 1)%3 == dest) {
      moveDiscsRotateRight(work, d - 1); //move discs 0..d-1 to work peg

      //move disc d to destination peg
      moveArray[numMoves++] = [src, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsRotateRight(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
    else {
      moveDiscsRotateRight(dest, d - 1); //move discs 0..d-1 to dest peg

      //move disc d to work peg
      moveArray[numMoves++] = [src, work]; //record in move array to be played later
      onPegTemp[d] = work; //record in temporary peg array
    
      moveDiscsRotateRight(src, d - 1); //move discs 0..d-1 back to src peg
      
      //move disc d to destination peg
      moveArray[numMoves++] = [work, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsRotateRight(dest, d - 1); //move discs 0..d-1 to destination peg
    } //else
  } //if
} //moveDiscsRotateRight

/// \brief Towers of Hanoi solve with moves that rotate left.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state and only making moves leftwards
/// and rotated back to start.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscsRotateLeft(dest, d){
  while(d>=0 && onPegTemp[d] == dest)--d; //skip large discs already on destination peg

  if(d >= 0){ 
    var src = onPegTemp[d]; //source peg
    var work = 3 - src - dest; //work peg

    if((dest + 1)%3 == src) {
      moveDiscsRotateLeft(work, d - 1); //move discs 0..d-1 to work peg

      //move disc d to destination peg
      moveArray[numMoves++] = [src, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsRotateLeft(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
    else {
      moveDiscsRotateLeft(dest, d - 1); //move discs 0..d-1 to dest peg

      //move disc d to work peg
      moveArray[numMoves++] = [src, work]; //record in move array to be played later
      onPegTemp[d] = work; //record in temporary peg array
    
      moveDiscsRotateLeft(src, d - 1); //move discs 0..d-1 back to src peg
      
      //move disc d to destination peg
      moveArray[numMoves++] = [work, dest]; //record in move array to be played later
      onPegTemp[d] = dest; //record in temporary peg array

      moveDiscsRotateLeft(dest, d - 1); //move discs 0..d-1 to destination peg
    } //else
  } //if
} //moveDiscsRotateLeft

///brief Compute the move array from the current puzzle state.

function computeMoveArray(){
  //create a temporary copy of the onPeg array
  for(var i=0; i<numDiscs; i++)
    onPegTemp[i] = onPeg[i];
  numMoves = 0;

  switch(curMotionRestriction){ //recursive solution
    case motionrestriction.none:
      moveDiscs(2, numDiscs-1);
      break;
      
    case motionrestriction.throughleft:
      moveDiscsViaLeftPeg(2, numDiscs-1); 
      break;
      
    case motionrestriction.throughcenter:
      moveDiscsViaCenterPeg(2, numDiscs-1); 
      break;
      
    case motionrestriction.throughright:
      moveDiscsViaRightPeg(2, numDiscs-1); 
      break;
      
    case motionrestriction.rotateright:
      moveDiscsRotateRight(2, numDiscs-1); 
      break;
      
    case motionrestriction.rotateleft:
      moveDiscsRotateLeft(2, numDiscs-1); 
      break;
  } //switch
  
  //get ready to execute the solution in moveArray
  curMove = 0;
  srcPeg = moveArray[curMove][0];
  destPeg = moveArray[curMove][1];
  curDisc = puzzle[srcPeg][count[srcPeg]];
} //computeMoveArray

/// \brief Reset the current time.
/// Reset the global variable myclock to the fractional part of the current time in seconds,
/// with millisecond resolution. 

function resetTime() {
  var time = new Date();
  myclock = time.getMilliseconds()/1000.0;
} //resetTime

/// \brief Reset the puzzle to its initial state.
/// Resets various global variables to encode the initial state
/// of the puzzle, with all discs correctly stacked on peg 0. 
/// Assumes that moveArray has already been computed.

function resetPuzzle(){  
  animating = false;
  userPlay = false;
  animationState = motionstate.idle;
  didNotCheat = true;
  movesSinceReset = 0;
  
  for(var i=0; i<numDiscs; i++)
    onPeg[i] = 0;
  
  //initialize internal representation of puzzle
  count[0] = numDiscs;
  count[1] = count[2] = 0;
  puzzle[0][0] = puzzle[1][0] = puzzle[2][0] = numDiscs;
  for(var i=1; i<=numDiscs; i++)
    puzzle[0][i] = numDiscs - i;
  
  //initialize x and y coordinate of discs on canvas
  for(var i=0; i<numDiscs; i++){
    discX[i] = pegX[0];
    discY[i] = pegY - (numDiscs - i - 1)*discHeight;
  } //for

  computeMoveArray();

  document.getElementById('vanilla').disabled = false;
  document.getElementById('left').disabled = false;
  document.getElementById('center').disabled = false;
  document.getElementById('right').disabled = false;
  document.getElementById('leftwards').disabled = false;
  document.getElementById('rightwards').disabled = false;
} //resetPuzzle

/// \brief Change the number of discs.
/// Change various global variables to accommodate
/// a new number of discs.
/// \param n Number of discs.

function changeNumDiscs(n){
  numDiscs = n;
  discHeight = 65 - 3*numDiscs;
  didNotCheat = true;
  movesSinceReset = 0;

  pegHt = (numDiscs + 1)*discHeight;
  floatHeight = pegY - pegHt - discHeight;
  var discWidthDelta = (bigdiscWidth - smalldiscWidth)/numDiscs;
  
  discWidth[numDiscs-1] = bigdiscWidth;
  for (var i=numDiscs-2; i>=0; i--)
    discWidth[i] = discWidth[i + 1] - discWidthDelta;
  
  //set the play and step buttons
  document.getElementById('play').disabled = false;
  document.getElementById('step').disabled = false;
  document.getElementById('play').innerHTML = "Solve";
} //changeNumDiscs

/// \brief Main initialization function.
/// Initialize global variables for the first time. This is only
/// called when the page is reloaded.

function init(){ 
  restrictionIndicatorThru.src = 'through.png'; 
  restrictionIndicatorLRot.src = 'rotateleft.png';
  restrictionIndicatorRRot.src = 'rotateright.png';

  for(var i=0; i<3; i++)
    puzzle[i] = new Array(MAXDISCS+1);

  //compute number of moves solved, one less than a power of 2
  moveArray = new Array(8*(Math.pow(2, MAXDISCS) - 1)); //extra eightfold space to be sure user hasn't screwed it up
  
  changeNumDiscs(defaultNumDiscs);
  resetPuzzle();
  
  var canvas = document.getElementById("canvas");
  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;

  
  document.getElementById('slow').checked = true;
  document.getElementById('vanilla').checked = true;

  canvas.addEventListener('touchstart', touchStart, false);
  canvas.addEventListener('touchmove', touchMove, false);
  canvas.addEventListener('touchend', touchEnd, false);

  window.requestAnimationFrame(composeFrame);
} //init

/// \brief Move the current disc up.
/// \param delta Distance to move in pixels.

function moveUp(delta){
  if(speed >= 8.0){ //jump to position
    var time = new Date();
    var now = time.getMinutes() * 60 + time.getSeconds() + time.getMilliseconds() / 1000.0;
        
    if(now - startDelayTime > delayTime){
      startDelayTime = now;    
      discX[curDisc] = pegX[destPeg];
      discY[curDisc] = pegY;
      animationState = motionstate.down;
    } //if
  } //if
  else{ //smooth animation
    discY[curDisc] -= 0.8*delta;
    if(discY[curDisc] <= floatHeight){
      discY[curDisc] = floatHeight;
      animationState = motionstate.across;
    } //if
  } //else
} //moveUp


/// \brief Move the current disc across.
/// \param delta Distance to move in pixels.

function moveAcross(delta) {
  if(pegX[destPeg] > discX[curDisc]){ //moving right
    discX[curDisc] += delta;      
    if(discX[curDisc] >= pegX[destPeg]){
      discX[curDisc] = pegX[destPeg];
      animationState = motionstate.down;
    } //if
  } //if
  else if(pegX[destPeg] < discX[curDisc]){ //moving left
    discX[curDisc] -= delta;       
    if(discX[curDisc] <= pegX[destPeg]){
      discX[curDisc] = pegX[destPeg];
      animationState = motionstate.down;
    } //if
  } //else if
  else animationState = motionstate.down;
} //moveAcross

/// \brief Move the current disc down.
/// \param delta Distance to move in pixels.

function moveDown(delta) {
  discY[curDisc] += 1.5 * delta;

  var desiredHt = pegY - discHeight * (count[destPeg] - ((destPeg == srcPeg) ? 1 : 0));

  if(discY[curDisc] >= desiredHt) {
    discY[curDisc] = desiredHt;
    movesSinceReset++;

    if(userPlay || count[2] < numDiscs) { //not yet finished
      count[srcPeg]--;
      puzzle[destPeg][++count[destPeg]] = curDisc;
      onPeg[curDisc] = destPeg;

      //play sounds
      if(audioEnabled){
        if(count[2] == numDiscs)
          winSound.play();
        else clickSound.play();
      } //if

      if(userPlay || singleMove) {
        animating = false;
        singlemove = false;
        animationState = motionstate.idle;
        if(!userPlay) {
          document.getElementById('play').innerHTML = "Solve";
          document.getElementById('play').disabled = false;
          document.getElementById('step').disabled = false;

          document.getElementById('vanilla').disabled = false;
          document.getElementById('left').disabled = false;
          document.getElementById('center').disabled = false;
          document.getElementById('right').disabled = false;
          document.getElementById('leftwards').disabled = false;
          document.getElementById('rightwards').disabled = false;
        } //if
      } //if
      else animationState = count[2] < numDiscs ? motionstate.up : motionstate.idle;

      if(audioEnabled && animationState == motionstate.up && speed < 8.0)
        slideSound.play();

      if(animationState == motionstate.idle && count[0] == numDiscs) {
        resetPuzzle();
        document.getElementById('play').disabled = false;
        document.getElementById('step').disabled = false;
      } //if 
      else if(!userPlay) {
        curMove++;
        if(count[2] < numDiscs) {
          srcPeg = moveArray[curMove][0];
          destPeg = moveArray[curMove][1];
          curDisc = puzzle[srcPeg][count[srcPeg]];
        } //if
        else { //solved
          document.getElementById('play').innerHTML = "Solve";
          document.getElementById('play').disabled = true;
          document.getElementById('step').disabled = true;
        } //else
      } //if
    } //if
    userPlay = false;
  } //if
} //moveDown

/// \brief Move the current disc.
/// Use Euler integration to move the current disc.

function move(){
  if(count[0] == numDiscs && !animating)
    didNotCheat = true;

  //compute frame time and motion delta
  var time = new Date();
  var now = time.getMilliseconds() / 1000.0;
  var dt = now - myclock;
  if(dt < 0.0)dt += 1.0;
  var delta = speed * dt * 400;
  myclock = now;

  if(delta > 0 && delta < 1000){ //time change must be reasonable
    switch(animationState){ 
      case motionstate.up: moveUp(delta); break;
      case motionstate.across: moveAcross(delta); break;
      case motionstate.down: moveDown(delta); break;
    } //switch
  } //if
} //move

/// \brief Draw the discs.
/// \param ctx 2D context for canvas.

function drawDiscs(ctx){
  for(var i=0; i<numDiscs; i++){
    ctx.save();
    ctx.lineWidth = 2;

    var grd = ctx.createLinearGradient(0, 0.75*discHeight, 0, -discHeight);
    if(rainbowColors)
      grd.addColorStop(1, colorArray[i]);
    else if(i&1)grd.addColorStop(1, 'red'); //alternating red...
    else grd.addColorStop(1, 'yellow'); //... and yellow
    grd.addColorStop(0, 'black'); //shadow for illusion of curvature

    ctx.fillStyle = grd;
    ctx.translate(discX[i], discY[i]);
    
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

/// \brief Draw the puzzle base and pegs.
/// Draw the rectangular base, and the pegs. The closest legal peg is
/// highlighted if appropriate.
/// \param ctx 2D context for canvas.

function drawBaseAndPegs(ctx){
  const pegWidth = 32;
  const baseHt = 32;

  ctx.fillStyle = 'rgba(140, 108, 58, 255)';
  ctx.lineWidth = 4;

  //draw base
  ctx.fillRect(32, pegY, canvasWidth - 64, baseHt);

  //draw pegs
  for(var i=0; i<3; i++) {
    var grd = ctx.createLinearGradient(pegX[i] - pegWidth/2, 0, pegX[i] + 2*pegWidth, 0);
    grd.addColorStop(0, 'rgba(163, 126, 68, 255)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 255)');
    ctx.fillStyle = grd;
    ctx.fillRect(pegX[i] - pegWidth/2, pegY - pegHt, pegWidth, pegHt);
  } //for
  
  //draw green box around nearest legal peg 
  if(nearestPeg >= 0 && nearestPeg <= 2){
    ctx.strokeStyle = 'rgba(0, 255, 0, 255)'; //green
    ctx.strokeRect(pegX[nearestPeg] - pegWidth/2, pegY - pegHt, pegWidth, pegHt);
    ctx.strokeStyle = 'black'; //back to default
  } //if
} //drawBaseAndPegs

/// \brief Draw canvas text.
/// Draw the number of moves, and a "puzzle solved" message on completion.
/// \param ctx 2D context for canvas.

function drawText(ctx){   
  if(showMoveCount) {
    ctx.fillStyle = 'gray';
    ctx.font = "22px Arial";
    ctx.textAlign = 'left';
    ctx.fillText("Moves: " + movesSinceReset, 15, 30);
  } //if
  ctx.textAlign = 'center';

  if(count[2] == numDiscs){
    ctx.fillStyle = 'black'; 
    const x = canvasWidth/2, y = (pegY - pegHt)/2;
    
    if(didNotCheat){
      ctx.font = "45px Arial";
      ctx.fillText("Congratulations!", x, y - 30);
      ctx.font = "30px Arial";
      ctx.fillText("You Have Reached the Rank of", x, y+10);
      ctx.font = "italic 35px Arial";
      ctx.fillText(rank[numDiscs], x, y + 50);
    } //if
    else{ 
      ctx.font = "45px Arial";
      ctx.fillText("Puzzle Solved!", x, y - 20);
      ctx.fillStyle = 'red';
      ctx.font = "30px Arial";
      ctx.fillText("(But You Cheated)", x, y + 20);
    } //else
  } //if
} //drawText

/// \brief Draw restriction indicator.
/// Draw the restriction indicator image, if a move restriction is in effect.
/// \param ctx 2D context for canvas.

function drawRestrictionIndicator(ctx){
  if(showRestrictionIndicator && count[2] != numDiscs)
    switch(curMotionRestriction){
      case motionrestriction.throughleft:
        ctx.drawImage(restrictionIndicatorThru, pegX[0] - 32, floatHeight - 38);
        break;

      case motionrestriction.throughcenter:
        ctx.drawImage(restrictionIndicatorThru, pegX[1] - 32, floatHeight - 38);
        break;

      case motionrestriction.throughright:
        ctx.drawImage(restrictionIndicatorThru, pegX[2] - 32, floatHeight - 38);
        break;
      
      case motionrestriction.rotateleft:
        ctx.drawImage(restrictionIndicatorLRot, pegX[1] - 64, floatHeight - 104);
        break;    
      
      case motionrestriction.rotateright:
        ctx.drawImage(restrictionIndicatorRRot, pegX[1] - 64, floatHeight - 104);
        break;

      case motionrestriction.none:
        break;
    } //switch
} //drawRestrictionIndicator

/// \brief Draw everything.

function draw(){
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.globalCompositeOperation = 'source-over';

  //clear canvas and draw black border
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 800, 600); 
  
  //draw restriction indicator, text, puzzle base, and discs
  drawRestrictionIndicator(ctx);
  drawText(ctx); 
  drawBaseAndPegs(ctx);
  drawDiscs(ctx);

  window.requestAnimationFrame(composeFrame);
} //draw

/// \brief Compose a frame of animation.

function composeFrame(){
  if(animating)move();
  draw();
} //composeFrame

/// \brief Begin animation the solution.
/// If we are animating already, pause. If we are starting animation
/// or are paused, then go for it.

function Solve(){
  document.getElementById('vanilla').disabled = true;
  document.getElementById('left').disabled = true;
  document.getElementById('center').disabled = true;
  document.getElementById('right').disabled = true;
  document.getElementById('leftwards').disabled = true;
  document.getElementById('rightwards').disabled = true;

  //compute the moveArray and prepare to make the first move
  computeMoveArray(); 

  document.getElementById('step').disabled = true;
  document.getElementById('play').innerHTML = "Pause";
  singleMove = false;
  didNotCheat = false;

  if(count[2] >= numDiscs) //solved
    resetPuzzle();
  else if(animating){ //pausing
    animating = false;
    resetTime();
    document.getElementById('step').disabled = false;
    document.getElementById('play').innerHTML = "Solve";
  } // else if
  else{ //starting animation from scratch
     resetTime();
     animating = true;
     if(animationState == motionstate.idle) { //in case we are paused
       animationState = motionstate.up;
       if(audioEnabled && speed < 8.0)slideSound.play();
     } //if
  } //else
} //Solve

/// \brief Begin animation of a single step of the solution.

function Step(){
  //compute the moveArray and prepare to make the first move
  computeMoveArray(); 

  resetTime();
  singleMove = true;
  animating = true;
  didNotCheat = false;

  if(animationState == motionstate.idle) {
    animationState = motionstate.up;
    if(audioEnabled && speed < 8.0)slideSound.play();
  } //if
  
  document.getElementById('step').disabled = true;
  document.getElementById('play').innerHTML = "Pause";
} //Step

////////////////////////////////////////////////////////////////////////////////////
// Button handlers.

/// \brief Handler for the Reset button.
/// Reset the puzzle and enable the Play and Step buttons.

function resetbuttonHandler() {
  resetPuzzle();

  document.getElementById('step').disabled = false;
  document.getElementById('play').disabled = false;
  document.getElementById('play').innerHTML = "Solve";
} //resetbuttonHandler


/// \brief Handler for the Discs++ button.

function morediscsButtonHandler(){
  if(numDiscs < MAXDISCS){
    changeNumDiscs(numDiscs + 1);
    resetPuzzle();
  } //if
} //morediscsButtonHandler

/// \brief Handler for the Discs-- button.

function lessdiscsButtonHandler(){
  if(numDiscs > MINDISCS){
    changeNumDiscs(numDiscs - 1);
    resetPuzzle();
  } //if
} //lessdiscsButtonHandler

/// \brief Handler for the Slow animation speed radio button.

function slowRadioButtonHandler(){
  speed = 1.0;
  delayTime = 0;
} //slowRadioButtonHandler

/// \brief Handler for the Medium animation speed radio button.

function mediumRadioButtonHandler(){
  speed = 2.0;
  delayTime = 0;
} //mediumRadioButtonHandler

/// \brief Handler for the Fast animation speed radio button.

function fastRadioButtonHandler(){
  speed = 4.0;
  delayTime = 0;
} //fastRadioButtonHandler

/// \brief Handler for the Very Fast animation speed radio button.

function veryfastRadioButtonHandler(){
  speed = 16.0;
  delayTime = 0.25;
} //veryfastRadioButtonHandler

/// \brief Handler for the Very Very Fast animation speed radio button.

function veryveryfastRadioButtonHandler(){
  speed = 16.0;
  delayTime = 0;
} //veryveryfastRadioButtonHandler

/// \brief Handler for the Colors checkbox.

function colorsCheckboxHandler(){
  rainbowColors = !rainbowColors;
} //colorsCheckboxHandler

/// \brief Handler for the Sounds checkbox.

function audioCheckboxHandler(){
  audioEnabled = !audioEnabled;
} //audioCheckboxHandler

/// \brief Handler for the Show Move Count checkbox.

function movecountCheckboxHandler() {
  showMoveCount = !showMoveCount;
} //movecountCheckboxHandler

/// \brief Handler for the Show Restrictions Indicator checkbox.

function restrictionCheckboxHandler(){
  showRestrictionIndicator = !showRestrictionIndicator;
} //restrictionCheckboxHandler

/// \brief Handler for the no motion restrictions radio button.

function vanillaRadioButtonHandler(){
  curMotionRestriction = motionrestriction.none;
} //vanillaRadioButtonHandler

  /// \brief Handler for the left motion restriction radio button.

  function throughleftRadioButtonHandler(){
    curMotionRestriction = motionrestriction.throughleft;
  } //throughleftRadioButtonHandler

  /// \brief Handler for the center motion restriction radio button.

  function throughcenterRadioButtonHandler(){
    curMotionRestriction = motionrestriction.throughcenter;
  } //throughcenterRadioButtonHandler

  /// \brief Handler for the right motion restriction radio button.

  function throughrightRadioButtonHandler(){
    curMotionRestriction = motionrestriction.throughright;
  } //throughrightRadioButtonHandler

  /// \brief Handler for the rightwards motion restriction radio button.

  function rotaterightRadioButtonHandler(){
    curMotionRestriction = motionrestriction.rotateright;
  } //rotaterightRadioButtonHandler

  /// \brief Handler for the leftwards motion restriction radio button.

  function rotateleftRadioButtonHandler(){
    curMotionRestriction = motionrestriction.rotateleft;
  } //rotateleftRadioButtonHandler

  //////////////////////////////////////////////////////////////////////////////////
  // Mouse handler functions.

/// \brief Process a dropped disc.
/// Assumes that dragDisc >= 0. This is to be used in the mouseup and
/// touchend event handlers.

function processDroppedDisc(){
  curDisc = dragDisc;
  animating = true;
  singleMove = true;
  resetTime();
    
  if(nearestPeg < 0){ //dropped without lifting from source peg
    destPeg = srcPeg;
    animationState = motionstate.down;
  } //else
  else animationState = motionstate.across;
   
  dragDisc = -1; //ain't dragging
  nearestPeg = -1; //so there's no nearest peg
} //processDroppedDisc

/// \brief Mouse button up handler.
/// Called whenever the mouse left button is released.
/// \param e Information from the mouse.

function mouseUp(){
  var canvas = document.getElementById("canvas"); 
  if(userPlay && dragDisc >= 0){
    canvas.onmousemove = null;
    processDroppedDisc();
  } //if
} //mouseUp

/// \brief Check that a move obeys any restrictions that are in force.
/// \param src Source peg.
/// \param dest Destination peg.
/// \return true if a move from the source to the destination is legal under current motion restrictions.

function obeysRestrictions(src, dest){
  switch(curMotionRestriction){  //test depends on the motion restrictions currently in force  
    case motionrestriction.none:
      return true;
      break;

    case motionrestriction.throughleft:
      return src == 0 || dest == 0;
      break;

    case motionrestriction.throughcenter:
      return src == 1 || dest == 1;
      break;

    case motionrestriction.throughright:
      return src == 2 || dest == 2;
      break;
      
    case motionrestriction.rotateright:
      return dest == (src + 1)%3; 
      break;
      
    case motionrestriction.rotateleft:
      return src == (dest + 1)%3;  
      break;
  } //switch
} //obeysRestrictions

/// \brief Process a dragged disc.
/// Assumes that dragDisc >= 0. This is to be used in the mousemove and
/// touchmove event handlers.

function processDraggedDisc(x, y){
  var canvas = document.getElementById("canvas"); 

  switch(animationState){
    case motionstate.up:
      discY[dragDisc] = y - canvas.offsetTop + discHeight/2; //drag up or down only
         
      if(discY[dragDisc] <= pegY - pegHt)  //have we dragged it above the top of the peg yet?
        animationState = motionstate.across; //if so, start dragging across
        
      discY[dragDisc] = Math.min(discY[dragDisc], pegY - discHeight*(count[srcPeg]-1)); //can't drag below original position 
      break;
      
    case motionstate.across:
      //horizontal drag
      discX[dragDisc] = x - canvas.offsetLeft;
      discX[dragDisc] = Math.max(discX[dragDisc], pegX[0]);
      discX[dragDisc] = Math.min(discX[dragDisc], pegX[2]);
      
      //vertical drag
      discY[dragDisc] = y - canvas.offsetTop + discHeight/2;
      discY[dragDisc] = Math.max(discY[dragDisc], 1.5*discHeight);
      discY[dragDisc] = Math.min(discY[dragDisc], pegY - pegHt);
      
      //make list of pegs with distances from dragged disc
      var distances = [[0, Math.abs(discX[dragDisc] - pegX[0])], //peg 0
        [1, Math.abs(discX[dragDisc] - pegX[1])], //peg 1
        [2, Math.abs(discX[dragDisc] - pegX[2])]];	//peg2

      distances.sort(function(a,b){return a[1]-b[1]}); //sort peg list on distances
      
      //find the nearest legal peg using the sorted peg list
      nearestPeg = distances[0][0]; //try nearest first
      if((puzzle[nearestPeg][count[nearestPeg]] < dragDisc) || !obeysRestrictions(onPeg[dragDisc], nearestPeg)){ //nearest one not legal	
        nearestPeg = distances[1][0]; //try second nearest next
        if((puzzle[nearestPeg][count[nearestPeg]] < dragDisc) || !obeysRestrictions(onPeg[dragDisc], nearestPeg)) //second nearest one not legal	
          if(obeysRestrictions(onPeg[dragDisc], distances[2][0]))
            nearestPeg = distances[2][0];	 //the furthest away one must be ok  
          else nearestPeg = onPeg[dragDisc];
      } //if	

      break;
  } //switch
    
  destPeg = nearestPeg; //destination peg is the nearest legal peg
} //processDraggedDisc

/// \brief Mouse move handler.
/// Called whenever the mouse moves.
/// \param e Information from the mouse.

function mouseMove(e){  
  if(dragDisc >= 0) //ignore if not dragging a disc currently
    processDraggedDisc(e.pageX, e.pageY);
} //mouseMove

/// \brief Check whether point is inside a disc along one dimension only.
/// \param x Coordinate of point.
/// \param c Center coordinate of disc.
/// \param r Radius of disc along one dimension.
/// \return True if x is within distance r from center.

function inBounds(x, c, r){
  return (x >= c - r) && (x <= c + r)
} //inBounds

/// \brief Check whether point is inside a disc.
/// \param x X coordinate of point.
/// \param y Y coordinate of point.
/// \return Index of disc that point is in, -1 if it isn't.

function pointInDisc(x, y){
  for(var i=0; i<numDiscs; i++)
    if(inBounds(x, discX[i], discWidth[i]/2 + discHeight/2) &&
      inBounds(y, discY[i], discHeight/2)
    ) return i;
  return -1; //exited the for loop without finding one
} //pointInDisc

/// \brief Process a selected disc.
/// This is to be used in the mousedown and touchstart event handlers.
/// \param x X coordinate of mouse click or touch.
/// \param y Y coordinate of mouse click or touch.

function processSelectedDisc(x, y){
  //prevent users from doing dumb things
  if(animating)return false; //don't click on a moving disc
  if(dragDisc >= 0)return false; //don't respond to click if focus has been lost and returned before releasing the mouse button
  
  //find the disc clicked on, if any 
  var canvas = document.getElementById("canvas"); 
  dragDisc = pointInDisc(x - canvas.offsetLeft, y - canvas.offsetTop + discHeight/2); 
  
  if(dragDisc >= 0 && animationState == motionstate.idle){ //click on disc and animation is idle  
    //find source peg
    if(discX[dragDisc] < (pegX[0]+pegX[1])/2)
      srcPeg = 0;
    else if(discX[dragDisc] <(pegX[1]+pegX[2])/2)
      srcPeg = 1;
    else srcPeg = 2;
    
    //only drag topmost disc on srcPeg
    if(puzzle[srcPeg][count[srcPeg]] == dragDisc){ 
      if(audioEnabled && speed < 8.0)slideSound.play();
      userPlay = true;  
      animating = false;   
      animationState = motionstate.up;
    } //if
    else dragDisc = -1;
  } //if
} //processSelectedDisc

/// \brief Mouse button down handler.
/// Called whenever the mouse left button is pressed down.
/// \param e Information from the mouse.

function mouseDown(e){
  processSelectedDisc(e.pageX, e.pageY);
  if(dragDisc >= 0) //click was inside a disc
    document.getElementById("canvas").onmousemove = mouseMove;
} //mouseDown

//////////////////////////////////////////////////////////////////////////////////
// Touch handler functions.

/// \brief Touch start handler.
/// Called whenever the user touches the canvas.
/// \param e Information from the touch.

function touchStart(e){
 var touchobj = e.targetTouches[0]; //first touch point
 processSelectedDisc(parseInt(touchobj.pageX), parseInt(touchobj.pageY));
 e.preventDefault();
} //touchStart

/// \brief Touch move handler.
/// Called whenever the user slides their finger across the canvas.
/// \param e Information from the touch.

function touchMove(e){ 
  if(dragDisc >= 0){ //ignore if not dragging a disc currently.  
    var touchobj = e.targetTouches[0]; //first touch point 
    processDraggedDisc(parseInt(touchobj.pageX), parseInt(touchobj.pageY));
  } //if
  e.preventDefault();
} //touchMove

/// \brief Touch end handler.
/// Called whenever the user lifts their finger from the canvas.
/// \param e Information from the touch.

function touchEnd(e){   
  if(userPlay && dragDisc >= 0)
    processDroppedDisc();
  e.preventDefault();
} //touchEnd
