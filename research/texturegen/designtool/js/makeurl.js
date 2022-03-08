/// \file makeurl.js
/// \brief Functions that build and parse a URL containing biq parameters.
///
/// Biq will allow URL parameters that specify the settings for a particular
/// texture so that interesting ones can be saved as a URL. This involves code
/// to build such a URL, which is displayed so that the user can right-click
/// and copy it, and code to parse such a URL.

/// \brief Construct a palette argument string.
///
/// Build a palette argument string to append to the end of the URL
/// if a checkbox is checked, null string otherwise.
/// \param id The id of the checkbox.
/// \return Palette argument string.

function AppendIfChecked(id){
  if(document.getElementById(id).checked)
    return "&palette=" + id;
  else return "";
} //AppendIfChecked

/// \brief Construct an argument string if a number is zero.
///
/// Build a string to append to the end of the URL if an
/// input of type number is nonzero, null string otherwise.
/// \param id The id of the input.
/// \return Argument string.

function AppendIfNonzero(id){
  var v = document.getElementById(id).value;
  if(v != 0)
    return "&" + id + "=" + v;
  else return "";
} //AppendIfNonzero

/// \brief Assemble a URL for the current texture.
/// 
/// Build a URL string that contains all of the settings for the current texture
/// so that the user can squirrel it away in case they need it later.
/// \return The URL string.

function AssembleURL(){
  var s = "http://larc.unt.edu/ian/research/texturegen/designtool/index.html?";

  //variant and repeat
  s += "p=" + document.getElementById('p').value;
  s += "&q=" + document.getElementById('q').value;

  //style
  if(document.getElementById('ornamentation').checked)
    s += "&style=ornamentation"
  else if(document.getElementById('feathers').checked)
    s += "&style=feathers"
  else if(document.getElementById('textiles').checked)
    s += "&style=textiles"
  else if(document.getElementById('advanced').checked){
    s += "&style=advanced";
    
    //get the nonzero coefficients
    for(var i=0; i<=1; i++){
      s += AppendIfNonzero('a' + i.toString());
      s += AppendIfNonzero('b' + i.toString());
      s += AppendIfNonzero('c' + i.toString());
      s += AppendIfNonzero('d' + i.toString());
      s += AppendIfNonzero('e' + i.toString());
      s += AppendIfNonzero('f' + i.toString());
    } //for

    //diagonal or linear
    if(document.getElementById('diagonal').checked)
      s += "&dir=diagonal"
    else s += "&dir=linear"
  } //else if

  //number of colors
  s += "&colors=" + document.getElementById('bands').value;

  //standard palettes
  s += AppendIfChecked('grayscale');
  s += AppendIfChecked('pastel');
  s += AppendIfChecked('primary');
  s += AppendIfChecked('autumn');
  s += AppendIfChecked('ocean');
  s += AppendIfChecked('toucan');
  s += AppendIfChecked('finch');
  s += AppendIfChecked('fish');
  s += AppendIfChecked('lorikeet');

  //custom palette
  if(document.getElementById('custom').checked){
    s += "&palette=custom";

    s += "&color0=" + document.getElementById('color0').value;
    s += "&color1=" + document.getElementById('color1').value;
    s += "&color2=" + document.getElementById('color2').value;
    s += "&color3=" + document.getElementById('color3').value;
  } //if

  //invert grayscale value
  if(document.getElementById('invertcheckbox').checked)
    s += "&invert=1";

  //brightness
  s +=  "&brightness=" + document.getElementById('brightness').value;

  return s;
} //AssembleURL

//-------------------------------------------------------------------------------------

/// \brief Get a specific parameter from this page's URL.
///
/// Given the name of a parameter, parse the current page's URL,
/// extract the "name=value" string and return the value.
/// \param name Name of the URL parameter.
/// \return If there is a URL parameter "name=value", then return value, else null.

function getURLParameter(name){
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + 
    '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
} //getURLParameter

/// Get a coefficient parameter from this page's URL.
///
/// Get a URL parameter for a coefficient and display it in an \<input\>
/// tag whose id is the same as the coefficient's name. If there is one,
/// then display it on the web page in the appropriate place.
/// \param s Coefficient name, a through f.
/// \param i Must be 0 for a0 through f0, 1 for a1 through f1.

function GetCoefficientFromURL(s, i){
  var s = s + i.toString();
  var parm = getURLParameter(s);
  document.getElementById(s).value = parm? Number(parm): 0;
} //GetCoefficientFromURL

/// \brief Parse and implement the parameters in this page's URL.
///
/// Grab this page's URL, parse all of the parameters from it and store them
/// away in the appropriate places.

function processURLParameters(){ 
  var parm; //parameter
  
  //variant and tile size
  parm = getURLParameter('p');
  if(parm)
    document.getElementById('p').value = Number(parm);

  parm = getURLParameter('q');
  if(parm)
    document.getElementById('q').value = Number(parm);

  //style
  parm = getURLParameter('style');
  if(parm == 'ornamentation'){
    document.getElementById('ornamentation').checked = true;
    OrnamentationRadioButtonHandler();
  } //if
  else if(parm == 'feathers'){
    document.getElementById('feathers').checked = true;
    FeathersRadioButtonHandler();
  } //else if
  else if(parm == 'textiles'){
    document.getElementById('textiles').checked = true;
    TextilesRadioButtonHandler();
  } //else if
  else if(parm == 'advanced'){
    document.getElementById('advanced').checked = true;
    AdvancedRadioButtonHandler();

    for(var i=0; i<=1; i++){
      GetCoefficientFromURL('a', i);
      GetCoefficientFromURL('b', i);
      GetCoefficientFromURL('c', i);
      GetCoefficientFromURL('d', i);
      GetCoefficientFromURL('e', i);
      GetCoefficientFromURL('f', i);
    } //for
 
    //direction
    parm = getURLParameter('dir');
    if(parm == 'diagonal'){
      document.getElementById('diagonal').checked = true;
      DiagonalRadioButtonHandler();
    } //if
    else if(parm == 'linear'){
      document.getElementById('linear').checked = true;
      LinearRadioButtonHandler();
    } //else
  } //else if
  
  //colors
  parm = getURLParameter('colors');
  if(parm){
    n = Number(parm);
    n = Math.max(Number(parm), 1);
    n = Math.min(4, Math.max(Number(parm), 1));
    document.getElementById('bands').value = Math.min(4, Math.max(Number(parm), 1));
  } //if

  //palette
  parm = getURLParameter('palette');
  if(parm == 'grayscale'){ 
    document.getElementById('grayscale').checked = true;
    GrayscaleRadioButtonHandler();
  } //if
  else if(parm == 'pastel'){ 
    document.getElementById('pastel').checked = true;
    PastelRadioButtonHandler();
  } //else if
  else if(parm == 'primary'){ 
    document.getElementById('primary').checked = true;
    PrimaryRadioButtonHandler();
  } //else if
  else if(parm == 'autumn'){ 
    document.getElementById('autumn').checked = true;
    AutumnRadioButtonHandler();
  } //else if
  else if(parm == 'ocean'){ 
    document.getElementById('ocean').checked = true;
    OceanRadioButtonHandler();
  } //else if
  else if(parm == 'toucan'){ 
    document.getElementById('toucan').checked = true;
    ToucanRadioButtonHandler();
  } //else if
  else if(parm == 'finch'){ 
    document.getElementById('finch').checked = true;
    FinchRadioButtonHandler();
  } //else if
  else if(parm == 'fish'){ 
    document.getElementById('fish').checked = true;
    FishRadioButtonHandler();
  } //else if
  else if(parm == 'lorikeet'){ 
    document.getElementById('lorikeet').checked = true;
    LorikeetRadioButtonHandler();
  } //else if
  else if(parm == 'custom'){ 
    document.getElementById('custom').checked = true;
    CustomRadioButtonHandler();

    parm = getURLParameter('color0');
    if(parm) document.getElementById('color0').value = '#' + parm;

    parm = getURLParameter('color1');
    if(parm) document.getElementById('color1').value ='#' + parm;

    parm = getURLParameter('color2');
    if(parm) document.getElementById('color2').value = '#' + parm;

    parm = getURLParameter('color3');
    if(parm) document.getElementById('color3').value = '#' + parm;   
  } //else if
  
  //brightness
  parm = getURLParameter('brightness');
  if(parm) document.getElementById('brightness').value = parm;
  else document.getElementById('brightness').value = 0.0;

  //invert grayscale value
  parm = getURLParameter('invert');
  if(parm == 1)
    document.getElementById('invertcheckbox').checked = true;
} //processURLParameters
    