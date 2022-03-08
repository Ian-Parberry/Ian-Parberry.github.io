/// \file biq.js
/// \brief Main JavaScript file for biq.
///
/// \mainpage A Designer Centric Procedural Texture Generator Using Modular Bivariate Quadratic Functions.
///
/// Copyright Ian Parberry, September 2015.
/// This file is made available under the GNU All-Permissive License.
/// Copying and distribution of this file, with or without modification,
/// are permitted in any medium without royalty provided the copyright
/// notice and this notice are preserved.  This file is offered as-is,
/// without any warranty.
///
/// Created by <a href="http://larc.unt.edu/ian">Ian Parberry</a>, June 2015.
/// Last updated August 5, 2015.

var p, q;
var showHelp = false;
var f = 0;
var flipDelay = 5;

var menu = [
  [59, 2, 5, 6, 7, 10, 11, 13, 14, 16, 17, 19, 22, 23, 27, 28], 
  [61, 3, 5, 7, 8, 9, 10, 12, 14, 20, 21, 27, 28],
  [63, 5, 10, 11, 13, 19, 20],
  [65, 3, 6, 11, 12, 17, 19, 21],
  [67, 4, 7, 8, 11, 12, 15, 16, 19, 20, 22,  25, 26, 28, 29, 30, 32],
  [69, 2, 4, 5, 7, 8, 10, 16, 20, 26, 28, 31],
  [71, 2, 4, 5, 8, 9, 10, 11, 12, 16, 17, 21, 22, 23, 24, 25, 29, 30, 31, 32],
  [73, 2, 5, 11, 19, 20, 22, 30, 43],
  [75, 4, 7, 8, 11, 16],
  [77,2,3,5,6,9,10,13,15,16,20,24,26,27,29,31,32,37],
  [79, 4, 6, 17, 18, 19, 25, 26, 27, 28,  30, 32, 37, 38],
  [81, 7, 8, 13, 14, 16, 17, 22, 23, 25, 28, 31, 37, 38],
  [83, 2, 10],
  [85, 22, 23, 28],
  [87, 3, 5, 9, 10, 13, 16, 17, 18, 19, 20, 21, 23, 26, 31, 32, 34, 35, 36, 37, 38, 40],
  [89, 2, 3, 4, 6, 11, 14, 15, 19, 21, 23, 24, 27, 28, 29, 30, 31, 39, 40, 41, 42, 43], 
  [91, 17, 24, 30],
  [93, 2, 3, 4, 5, 6, 11, 20, 22, 25, 28, 29, 34],
  [95, 18, 21, 26, 27, 29, 33],
  [101, 4, 7, 9, 11, 12, 13, 15, 16, 17, 19,  29, 30, 34, 37, 39, 40, 41, 42, 43, 45, 49],
  [127, 5, 10, 11, 13, 15, 17, 18, 21, 25, 26, 28, 33, 34, 35, 36, 39, 40, 41, 42, 45, 46, 47, 56, 59, 60],
  [129, 5, 6, 12, 28, 30, 34, 36, 40, 45],
  [131, 3, 18, 35, 39, 42, 43, 44, 47, 48, 51, 52, 53, 55, 57, 58, 59, 60, 61, 63, 64],
  [173,4,5,19,25,26,29,30,31,33,38,41,45,48,54,58,64,66,67,68,72,74,77,82]
];

var indexp, indexq;
var count;
var tick=0;
var curPalette;

/// \brief Set a pixel.
///
/// Set a pixel's color, and its alpha value to opaque.
/// \param data Pixel array.
/// \param px Pixel index.
/// \param rgb Array of three color values in the range 0..255.
/// \return Incremented pixel index.

function setPixel(data, px, rgb){       
  data[px++] = rgb[0]; data[px++] = rgb[1]; data[px++] = rgb[2]; //set color
  data[px++] = 255; //set alpha channel
  return px;
} //setPixel

function drawNext(){
  indexp = rand(count);
  for(indexq = 0; (indexq < menu.length) && (menu[indexq].length - 1 <= indexp) ; indexq++)
    indexp -= menu[indexq].length - 1;

  p = menu[indexq][indexp + 1];
  q = menu[indexq][0];
  //f = rand(q/2); //disable this, some offsets look ugly
  draw();
  tick++;
} //drawNext

/// \brief Draw texture.
///
/// Draw the procedurally generated  texture into the canvas with id 'target'.

function draw(){
  var canvas = document.getElementById('target');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

    var ctx = canvas.getContext('2d'); //canvas context, the thing we draw into

    //get the current values of p, q, and qhat
    var qhat = q/gcd(p, q);

    //check for smaller tile size from quadratic residues
    for(var r=2; r<=qhat/2; r++)
      if((r*r)%q == 0){ //if r is a quadratic residue mod q
        var p2 = 2*p*p;
        if(p2%r == 0){ //if r divides 2p^2
          qhat = r; //ensures that we exit the for loop
          document.getElementById('tile').value = r; //new tile size
        } //if
      } //if

    //get the pixel data array from the canvas context
    var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = myImageData.data;

    //figure out how many color bands to use
    var bands = 4; //shorthand

    //shorthands for width, height
    var w = canvas.width;
    var h = canvas.height;

    //now we can actually draw the texture

    var px = 0;  //pixel pointer

    for(var i=0; i<h; i++)
      for(var j=0; j<w; j++)
        px = setPixel(data, px, colorize(pi(j, q - i), bands)); 

    ctx.putImageData(myImageData, 0, 0); //draw the texture

  if(showHelp){
    ctx.textAlign = 'left';
    //dropShadow(ctx, "Tile size " + q + ", Variant " + p + ", Offset " +f, 30, 50, 71);
    dropShadow(ctx, "Tile size " + q + ", Variant " + p, 30, 50, 71);
    dropShadow(ctx, "Click at top left to remove this text.", 26, 50, 122);
    dropShadow(ctx, "Click at top right to change palette.", 26, 50, 151);
    dropShadow(ctx, "Click at bottom right to open in editor.", 26, 50, 181);
  } //if

  if(tick < 2 && !showHelp) {
    ctx.textAlign = 'left';
    dropShadow(ctx, "Welcome to \"The Beauty of Modular Bivariate Quadratic Functions\"", 30, 50, 71);
    dropShadow(ctx, "A digital art installation by Ian Parberry", 30, 55, 102);
    dropShadow(ctx, "A new pattern will be displayed every " + flipDelay + " seconds.", 26, 50, 151);
    dropShadow(ctx, "Click at top left for help.", 26, 50, 181);
    dropShadow(ctx, "(This text will disappear in a few seconds)", 22, 50, 241);
  } //if

  else{
    var d = new Date();
    var y = d.getFullYear();

    ctx.textAlign = 'right';  
    dropShadow(ctx, "\"The Beauty of Modular Bivariate Quadratic Functions\"", 12, window.innerWidth-8, window.innerHeight - 44);
    dropShadow(ctx, "A digital art installation by Ian Parberry", 12, window.innerWidth-8, window.innerHeight - 32);
    dropShadow(ctx, "Copyright \u00A9 Ian Parberry, " + y, 12, window.innerWidth-8, window.innerHeight - 20);
    dropShadow(ctx, "http://larc.unt.edu/ian", 12, window.innerWidth-8, window.innerHeight - 8);
  } //else
} //draw

function dropShadow(ctx, s, px, x, y){
  ctx.fillStyle = 'black';
  ctx.font = px + "px Arial";
  ctx.fillText(s, x, y);
  ctx.fillStyle = 'white';
  ctx.fillText(s, x - 0.1*px, y - 0.1*px);
} //dropShadow

/// \brief Initialize the web page. 
  
function initialize(){ 
  count = 0;
  for(var i=0; i<menu.length; i++)
    count += menu[i].length - 1;

  indexp = rand(count);
  for(indexq=0; (indexq<menu.length) && (menu[indexq].length-1<=indexp); indexq++)
    indexp -= menu[indexq].length - 1;

  p = menu[indexq][indexp + 1];
  q = menu[indexq][0];
  drawNext();
  window.setInterval(drawNext, flipDelay*1000);
  
  window.addEventListener("resize", draw);
  window.addEventListener("focus", draw);
  
  var canvas = document.getElementById("target");
  canvas.onmousedown = mouseDown;
} //initialize

/// \brief Mouse button down handler.
/// Called whenever the mouse left button is pressed down.
/// \param e Information from the mouse.

function mouseDown(e){
  if(e.pageX < window.innerWidth / 2) { //left
    if(e.pageY < window.innerHeight / 2) { //top left
      showHelp = !showHelp;
      draw();
    } //if
    else { //bottom left
      //drawNext();
    } //else
  } //if
  else { //right
    if(e.pageY < window.innerHeight / 2) { //top right
      curPalette = Math.floor((curPalette + 1)%2);
      draw();
    } //if
    else { //bottom right
      window.open("http://larc.unt.edu/ian/research/texturegen/designtool/index.html?p=" + 
        //p + "&q=" + q +"&style=advanced&a0=1&b0=1&f0=" + f + "&colors=4&palette=" + (curPalette? "autumn": "toucan") + "&brightness=0",
        p + "&q=" + q +"&style=ornamentation&colors=4&palette=" + (curPalette? "autumn": "toucan") + "&brightness=0",
        "_self");
    } //else
  } //else


} //mouseDown
    