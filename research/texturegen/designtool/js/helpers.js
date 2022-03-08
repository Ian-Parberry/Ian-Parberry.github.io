/// \file helpers.js
/// \brief Helper functions.

/// \brief Compute a modular bivariate quadratic function.
///
/// This is the key to the whole project. We're essentially attempting to hash 2D 
/// integer coordinates and failing in an interesting way. The hash function used is
/// (ax^2 + by^2 + c xy +dx + ey + f) mod q. This function returns that value divided
/// by q-1 to bring the result between 0 and 1.
/// The code should actually be quite straightforward, but it's not because JavaScript.
/// \param x coordinate.
/// \param y coordinate.
/// \return Hash of x and y, between 0.0 and 1.0.

var a0, b0, c0, d0, e0, f0;
var a1, b1, c1, d1, e1, f1;
var bIsDiagonal;
var p, q;

function pi(x, y){
  x = ((x|0)*p)%q; y = ((y|0)*p)%q;

  ////to speed things up we'll use a custom function
  //if(document.getElementById('ornamentation').checked)
  //  return ((x*x + y*y)%q)/(q - 1);
  
  ////to speed things up we'll use a custom function
  //if(document.getElementById('feathers').checked)
  //  return ((x*(x + 1) + y*(y + 2*x + 3))%q)/(q - 1);

  //now for the general case
  var a, b, c, d, e, f; //coefficients

  if (x < y || bIsDiagonal){ 
    a = a0; b = b0; c = c0; d = d0; e = e0; f = f0; 
  } //if
  else{
    a = a1; b = b1; c = c1; d = d1; e = e1; f = f1; 
  } //else
 
  return ((x*(a*x + c*y + d) + y*(b*y + e) + f)%q)/(q - 1);
} //pi

/// \brief Colorize a grayscale value.
///
/// Given a grayscale value and the number of color bands, see
/// which band the greyscale value is in, grab the color assigned
/// to that band, and scale it by the normalized grayscale value.
/// Oh, and first invert the grayscale value if the "invert"
/// checkbox is checked.
/// \param v Grayscale value between 0.0 and 1.0.
/// \param n Number of colors, must be at least 1.
/// \return An array of floating point RGB values between 0 and 255.

function colorize(v, n){
  //compute the index of the band that v is in, from 0 to n-1
  var index = Math.min(n*v, n - 1) | 0; //"| 0"? see the rant at the top of the page

  //compute m, the multiplier from v in that band
  var m = n*(v - index/n);
  if(document.getElementById('invertcheckbox').checked) 
     m = 1.0 - m; //invert m

  //grab the color corresponding to that index
  var color = document.getElementById('color' + index.toString()).value;

  //parse the color into rgb components.
  if(color.charAt(0) == '#') 
    color = color.substr(1);
  var r = parseInt(color.charAt(0) + color.charAt(1), 16);
  var g = parseInt(color.charAt(2) + color.charAt(3), 16);
  var b = parseInt(color.charAt(4) + color.charAt(5), 16);
  
  //adjust brightness
  var brightness = 1.0 - document.getElementById('brightness').value;
  m = brightness*m + 1.0 - brightness;

  //return rgb components of the color corresponding to the index, scaled by m
  return [r*m, g*m, b*m];
} //colorize

/// \brief Greatest common divisor.
///
/// Compute the greatest common divisor of two integers using the Euclidean algorithm.
/// \param a An integer.
/// \param b Another integer.
/// \return The greatest common divisor of a and b.

function gcd(a, b){
  while(a > 0){
    var c = a; a = b%a; b = c;
  } //while
  return b;
} //gcd
