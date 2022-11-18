/// \file biq.js
/// \brief Main JavaScript file for biq.
///
/// \mainpage A Designer Centric Procedural Texture Generator Using Modular Bivariate Quadratic Functions.
///
/// Biq (pronounced "bike") is a procedural texture generator based on modular bivariate quadratic functions.
/// <em>Modular</em> means that we live in the ring of integers modulo <em>q</em> (for some positive
/// integer <em>q</em>) under the operations of modular multiplication and addition. <em>Bivariate</em> means that we use
/// two variables x and y, which is pretty obvious since we're constructing a 2D texture.
/// <em>Quadratic</em> means that we square things. Of course, if you're math phobic,
/// then you'll just want to mash on the buttons and look at the pretty pictures.
/// There's no shame in that.
/// See https://ianparberry.com/research/texturegen/designtool to see it in action,
/// and https://ianparberry.com/research/texturegen/ for more information about what
/// it does.
///
/// \<rant\>
/// Who was the bright spark who decided that JavaScript would have only floating
/// point numbers? That's just wrong on so many levels. Here I am, trying
/// to perform computations in the ring of integers modulo q under multiplication and
/// addition, and the JavaScript intepreter gets a harebrained idea that these should
/// be floating point operations. Of course, the logical way to force
/// x to be an integer is by the judicious use of Math.round(x), but it turns out
/// that it's faster to compute x|0 instead. The JavaScript interpreter says
/// "Right-ho, if you're using a logical-or operation, then x must be an integer"
/// without stopping to optimize out the operation (as we all know, x|0 == x).
/// Speed is actually an issue with JavaScript, so you'll have to put up with seeing
/// "something|0" here and there in the code. It's asinine, I know, but there is
/// a madness to my method. I also had to optimize the modular bivariate quadratic
/// function pi() for cases that occur most frequently. It makes the code a little
/// more tedious to read, but it's a difference of waiting half a second for a new
/// texture and waiting a tenth of a second. It really is that bad.
/// Programming in JavaScript reminds me of programming 25 years ago
/// before compilers got the hang of code optimization. It's been fun visiting,
/// but I wouldn't like to live there.
/// \</rant\>
///
/// Copyright Ian Parberry, June 2015.
/// This file is made available under the GNU All-Permissive License.
/// Copying and distribution of this file, with or without modification,
/// are permitted in any medium without royalty provided the copyright
/// notice and this notice are preserved.  This file is offered as-is,
/// without any warranty.
///
/// Created by <a href="/">Ian Parberry</a>, June 2015.
/// Last updated November 18, 2022.

/// \brief Display instructions.
///
/// Display some brief instructions, including a link to Biq with the appropriate
/// parameter settings for the current texture, in the \<div\> with id 'displayurl'.

var a0, b0, c0, d0, e0, f0;
var a1, b1, c1, d1, e1, f1;
var bIsDiagonal;
var p, q;

function DisplayInstructions(){
  document.getElementById('displayurl').innerHTML =
    'To save this image, right click on it and select "Save image as...". ' +
    'To save these settings, copy <a class="gray" href="' + 
    AssembleURL() + 
    '">this link</a>. ';
} //DisplayInstructions

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

/// \brief Draw texture.
///
/// Draw the procedurally generated  texture into the canvas with id 'target'.

function draw(){
  var canvas = document.getElementById('target');

  if(canvas.getContext){ //It exists. It should always exist, mind you.
    var ctx = canvas.getContext('2d'); //canvas context, the thing we draw into

    //get the current values of p, q, and qhat
    p = document.getElementById('p').value;
    q = document.getElementById('q').value;
    var qhat = q/gcd(p, q);
    document.getElementById('tile').value = qhat; 

    //check for smaller tile size from quadratic residues
    if(document.getElementById('ornamentation').checked)
      for(var r=2; r<=qhat/2; r++)
        if((r*r)%q == 0){ //if r is a quadratic residue mod q
          var p2 = 2*p*p;
          if(p2%r == 0){ //if r divides 2p^2
            qhat = r; //ensures that we exit the for loop
            document.getElementById('tile').value = r; //new tile size
          } //if
        } //if

    //set the canvas resolution to 800x600, unless we're displaying a single tile
    if(document.getElementById('showtilecheckbox').checked && qhat <= 600) //single tile
      ctx.canvas.width = ctx.canvas.height = qhat;
    else{ //default
      ctx.canvas.width = 800;
      ctx.canvas.height = 600;
    } //else

    //get the pixel data array from the canvas context
    var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = myImageData.data;

    //figure out how many color bands to use
    var bandseditbox = document.getElementById('bands');
    bandseditbox.value = Math.min(Math.max(1, bandseditbox.value), 4); //clip to bounds
    var bands = bandseditbox.value; //shorthand

    //shorthands for width, height
    var w = canvas.width;
    var h = canvas.height;

    //globals
    bIsDiagonal = document.getElementById('diagonal').checked;
    a0 = document.getElementById('a0').value | 0; 
    b0 = document.getElementById('b0').value | 0;
    c0 = document.getElementById('c0').value | 0;
    d0 = document.getElementById('d0').value | 0;
    e0 = document.getElementById('e0').value | 0;
    f0 = document.getElementById('f0').value | 0;
    a1 = document.getElementById('a1').value | 0;
    b1 = document.getElementById('b1').value | 0;
    c1 = document.getElementById('c1').value | 0;
    d1 = document.getElementById('d1').value | 0;
    e1 = document.getElementById('e1').value | 0;
    f1 = document.getElementById('f1').value | 0;

    //now we can actually draw the texture

    //tile size is bigger than the canvas, so compute the whole thing
    if(qhat > w || qhat > h){
      var px = 0;  //pixel pointer

      for(var i=0; i<h; i++)
        for(var j=0; j<w; j++)
          px = setPixel(data, px, colorize(pi(j, q - i), bands)); 

      ctx.putImageData(myImageData, 0, 0); //draw the texture
    } //if

    else{ //it's quicker to compute one tile and copy it across the whole canvas      
      var tile = ctx.createImageData(qhat, qhat); //create image for tile
      data = tile.data; //drawing into tile now
      var px = 0; //pixel pointer

      for(var i=0; i<qhat; i++)
        for(var j=0; j<qhat; j++)
          px = setPixel(data, px, colorize(pi(j, qhat - i), bands));

      //copy tile across the texture
      var x=0, y=0; //coordinates in tiles

      while(y < h){ //for each row
        while(x < w){ //for each column
          ctx.putImageData(tile, x, y); //draw the tile
          x += qhat; //next column
        } //while
        x = 0; y += qhat; //next row, first column
      } //while
    } //else
  }	//if

  DisplayInstructions(); //display instructions at the bottom of the window
} //draw

/// \brief Initialize the web page. 
///
/// Process the URL parameters and fire off event listeners
/// that react when the user clicks on things. This should
/// get called from the HTML \<body\> tag: \<body onload="initialize();"\>.
  
function initialize(){
  processURLParameters(); //grab and set the parameters from the URL

  //document.getElementById('drawbutton').addEventListener('click', draw); //the draw button

  //style radio buttons
  document.getElementById('ornamentation').addEventListener('click', OrnamentationRadioButtonHandler);
  document.getElementById('feathers').addEventListener('click', FeathersRadioButtonHandler);
  document.getElementById('textiles').addEventListener('click', TextilesRadioButtonHandler);
  document.getElementById('advanced').addEventListener('click', AdvancedRadioButtonHandler);

  //standard palette radio buttons
  document.getElementById('grayscale').addEventListener('click', GrayscaleRadioButtonHandler);
  document.getElementById('toucan').addEventListener('click', ToucanRadioButtonHandler);
  document.getElementById('pastel').addEventListener('click', PastelRadioButtonHandler);
  document.getElementById('finch').addEventListener('click', FinchRadioButtonHandler);
  document.getElementById('primary').addEventListener('click', PrimaryRadioButtonHandler);
  document.getElementById('fish').addEventListener('click', FishRadioButtonHandler);
  document.getElementById('autumn').addEventListener('click', AutumnRadioButtonHandler);
  document.getElementById('lorikeet').addEventListener('click', LorikeetRadioButtonHandler);
  document.getElementById('ocean').addEventListener('click', OceanRadioButtonHandler);
  document.getElementById('custom').addEventListener('click', CustomRadioButtonHandler);

  //diagonal versus linear numbering radio buttons
  document.getElementById('linear').addEventListener('click', LinearRadioButtonHandler);
  document.getElementById('diagonal').addEventListener('click', DiagonalRadioButtonHandler);
  
  //edit boxes
  document.getElementById('p').addEventListener('click', draw);
  document.getElementById('q').addEventListener('click', draw);
  document.getElementById('tile').addEventListener('click', draw);
  
  document.getElementById('a0').addEventListener('click', draw);
  document.getElementById('b0').addEventListener('click', draw);
  document.getElementById('c0').addEventListener('click', draw);
  document.getElementById('d0').addEventListener('click', draw);
  document.getElementById('e0').addEventListener('click', draw);
  document.getElementById('f0').addEventListener('click', draw);
  
  document.getElementById('a1').addEventListener('click', draw);
  document.getElementById('b1').addEventListener('click', draw);
  document.getElementById('c1').addEventListener('click', draw);
  document.getElementById('d1').addEventListener('click', draw);
  document.getElementById('e1').addEventListener('click', draw);
  document.getElementById('f1').addEventListener('click', draw);
  
  document.getElementById('bands').addEventListener('click', draw);;
  document.getElementById('brightness').addEventListener('click', draw);
  
  //check boxes
  document.getElementById('invertcheckbox').addEventListener('click', draw);
  document.getElementById('showtilecheckbox').addEventListener('click', draw)

  draw(); //draw the current texture on the canvas
} //initialize
    