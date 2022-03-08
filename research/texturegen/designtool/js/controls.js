/// \file controls.js
/// \brief Functions that help manage HTML controls.
///
/// These include functions to manage the edit boxes that
/// contain the coefficients a0, ..., f0 and a1, ..., f1; and
/// radio button handlers that get called when radio buttons
/// are clicked.

//-------------------------------------------------------------------------------------

/// \brief Disable or enable displayed coefficients.
///
/// Disable or enable displayed coefficients a through f,
/// either set 0 (on the left) or set 1 (on the right).
/// \param setting True to disable, false to enable.
/// \param num 0 for coefficients a0 through f0, 1 for a1 through f1.

function DisableCoeff(setting, num){
  document.getElementById('a' + num.toString()).disabled = setting;
  document.getElementById('b' + num.toString()).disabled = setting;
  document.getElementById('c' + num.toString()).disabled = setting;
  document.getElementById('d' + num.toString()).disabled = setting;
  document.getElementById('e' + num.toString()).disabled = setting;
  document.getElementById('f' + num.toString()).disabled = setting;
} //DisableCoeff

/// \brief Set displayed coefficients.
/// Set the values of  displayed coefficients a through f,
/// either set 0 (on the left) or set 1 (on the right).
/// \param a Value of parameter a.
/// \param b Value of parameter b.
/// \param c Value of parameter c.
/// \param d Value of parameter d.
/// \param e Value of parameter e.
/// \param f Value of parameter f.
/// \param num 0 for coefficients a0 through f0, 1 for a1 through f1.

function SetCoeff(a, b, c, d, e, f, num) {
  document.getElementById('a' + num.toString()).value = a;
  document.getElementById('b' + num.toString()).value = b;
  document.getElementById('c' + num.toString()).value = c;
  document.getElementById('d' + num.toString()).value = d;
  document.getElementById('e' + num.toString()).value = e;
  document.getElementById('f' + num.toString()).value = f;
} //SetCoeff

/// \brief Linear radio button handler.
///
/// Handler for when the linear radio button is clicked.
/// Enable both sets of coefficients.

function LinearRadioButtonHandler(){
  DisableCoeff(false, 0);
  DisableCoeff(false, 1);
  draw();
} //LinearRadioButtonHandler

/// \brief Diagonal radio button handler.
///
/// Handler for when the diagonal radio button is clicked.
/// Enable the left-hand set of coefficients.
/// Disable the right-hand set of coefficients.

function DiagonalRadioButtonHandler(){
  DisableCoeff(false, 0);
  DisableCoeff(true, 1);
  draw();
} //DiagonalRadioButtonHandler

//-------------------------------------------------------------------------------------

/// \brief Ornamentation radio button handler.
///
/// Handler for when the ornamentation style radio button is clicked.
/// Disable the coefficients. Set the coefficients to ornamentation style.
/// Set the direction to diagonal. Disable the direction radio buttons.

function OrnamentationRadioButtonHandler(){
  DisableCoeff(true, 0);
  DisableCoeff(true, 1);

  SetCoeff(1, 1, 0, 0, 0, 0, 0);
  SetCoeff(1, 1, 0, 0, 0, 0, 1);

  document.getElementById('diagonal').disabled = true;
  document.getElementById('linear').disabled = true;
  
  draw();
} //OrnamentationRadioButtonHandler

/// \brief Feathers radio button handler.
///
/// Handler for when the feathers style radio button is clicked.
/// Disable the coefficients. Set the coefficients to feathers style.
/// Set the direction to diagonal. Disable the direction radio buttons.

function FeathersRadioButtonHandler(){
  DisableCoeff(true, 0);
  DisableCoeff(true, 1);

  SetCoeff(1, 1, 2, 1, 3, 0, 0);
  SetCoeff(1, 1, 2, 1, 3, 0, 1);

  document.getElementById('diagonal').disabled = true;
  document.getElementById('linear').disabled = true;
  
  draw();
} //FeathersRadioButtonHandler

/// \brief Textiles radio button handler.
///
/// Handler for when the textiles style radio button is clicked.
/// Disable the coefficients. Set the coefficients to textiles style.
/// Set the direction to linear. Disable the direction radio buttons.

function TextilesRadioButtonHandler(){
  DisableCoeff(true, 0);
  DisableCoeff(true, 1);

  SetCoeff(1, 0, 0, 1, 1, 0, 0);
  SetCoeff(0, 1, 0, 1, 0, 0, 1);

  document.getElementById('diagonal').disabled = true;
  document.getElementById('linear').disabled = true;
  
  draw();
} //TextilesRadioButtonHandler

/// \brief Advanced radio button handler.
///
/// Handler for when the advanced style radio button is clicked.
/// Enable the direction radio buttons. Call the handler for
/// whichever one is checked so that the correct group(s) of
/// coefficients get enabled.

function AdvancedRadioButtonHandler(){
  document.getElementById('diagonal').disabled = false;
  document.getElementById('linear').disabled = false;

  if(document.getElementById('diagonal').checked)
    DiagonalRadioButtonHandler();
  else if(document.getElementById('linear').checked)
    LinearRadioButtonHandler
} //AdvancedRadioButtonHandler

/// \brief Set and disable an input.
///
/// Set an input to a given value and disable it so the user can't change it.
/// This is a helper function for the palette radio buttons.
/// \param id The id of the input.
/// \param val The value to set it to.

function SetAndDisable(id, val) {
  var elt = document.getElementById(id);
  elt.disabled = true;
  elt.value = val;
} //SetAndDisable

/// \brief Pastel radio button handler.
///
/// Handler for when the pastel palette radio button is clicked.
/// Set the colors and disable them.

function PastelRadioButtonHandler() {
  SetAndDisable('color0', "#FFBAFF");
  SetAndDisable('color1', "#ADB5FF");
  SetAndDisable('color2', "#B7FFDA");
  SetAndDisable('color3', "#FFFFA7");
  draw();
} //PastelRadioButtonHandler

/// \brief Grayscale radio button handler.
///
/// Handler for when the grayscale palette radio button is clicked.
/// Set the colors and disable them.

function GrayscaleRadioButtonHandler() {
  SetAndDisable('color0', "#FFFFFF");
  SetAndDisable('color1', "#FFFFFF");
  SetAndDisable('color2', "#FFFFFF");
  SetAndDisable('color3', "#FFFFFF");
  draw();
} //GrayscaleRadioButtonHandler

/// \brief Ocean radio button handler.
///
/// Handler for when the ocean palette radio button is clicked.
/// Set the colors and disable them.

function OceanRadioButtonHandler() {
  SetAndDisable('color0', "#218FFF");
  SetAndDisable('color1', "#22C5FF");
  SetAndDisable('color2', "#D4FBE9");
  SetAndDisable('color3', "#D5EAFF");
  draw();
} //OceanRadioButtonHandler

/// \brief Toucan radio button handler.
///
/// Handler for when the toucan palette radio button is clicked.
/// Set the colors and disable them.

function ToucanRadioButtonHandler(){
  SetAndDisable('color0', "#B92D16");
  SetAndDisable('color1', "#95BB04");
  SetAndDisable('color2', "#20ADDA");
  SetAndDisable('color3', "#F0D833");
  draw();
} //ToucanRadioButtonHandler

/// \brief Finch radio button handler.
///
/// Handler for when the finch palette radio button is clicked.
/// Set the colors and disable them.

function FinchRadioButtonHandler() {
  SetAndDisable('color0', "#E60E1B");
  SetAndDisable('color1', "#85469F");
  SetAndDisable('color2', "#8BCCEC");
  SetAndDisable('color3', "#EAE400");
  draw();
} //FinchRadioButtonHandler

/// \brief Autumn radio button handler.
///
/// Handler for when the autumn palette radio button is clicked.
/// Set the colors and disable them.

function AutumnRadioButtonHandler() {
  SetAndDisable('color0', "#808000");
  SetAndDisable('color1', "#774000");
  SetAndDisable('color2', "#C8C800");
  SetAndDisable('color3', "#A99A00");
  draw();
} //AutumnRadioButtonHandler

/// \brief Fish radio button handler.
///
/// Handler for when the fish palette radio button is clicked.
/// Set the colors and disable them.

function FishRadioButtonHandler() {
  SetAndDisable('color0', "#CF099A");
  SetAndDisable('color1', "#05A879");
  SetAndDisable('color2', "#0067B1");
  SetAndDisable('color3', "#C2E100");
  draw();
} //FishRadioButtonHandler

/// \brief Lorikeet radio button handler.
///
/// Handler for when the lorikeet palette radio button is clicked.
/// Set the colors and disable them.

function LorikeetRadioButtonHandler() {
  SetAndDisable('color0', "#E80E0D");
  SetAndDisable('color1', "#3BAE1B");
  SetAndDisable('color2', "#136BE9");
  SetAndDisable('color3', "#FFC809");
  draw();
} //LorikeetRadioButtonHandler

/// \brief Primary radio button handler.
///
/// Handler for when the primary palette radio button is clicked.
/// Set the colors and disable them.

function PrimaryRadioButtonHandler() {
  SetAndDisable('color0', "#FF0000");
  SetAndDisable('color1', "#00FF00");
  SetAndDisable('color2', "#0000FF");
  SetAndDisable('color3', "#FFFF00");
  draw();
} //PrimaryRadioButtonHandler

/// \brief Custom radio button handler.
///
/// Enable the color controls so the user can customize them.

function CustomRadioButtonHandler() {
  document.getElementById('color0').disabled = false;
  document.getElementById('color1').disabled = false;
  document.getElementById('color2').disabled = false;
  document.getElementById('color3').disabled = false;
} //CustomRadioButtonHandler

