
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function ClickHandler(x){
  var dropdowns = document.getElementsByClassName("dropdown-content");

  if(document.getElementById(x).classList.contains('show'))
    document.getElementById(x).classList.remove('show');

  else{
    var i;
    for(i=0; i<dropdowns.length; i++){
      var openDropdown = dropdowns[i];
      if(openDropdown.classList.contains('show'))
        openDropdown.classList.remove('show');
    }
    document.getElementById(x).classList.toggle("show");
  }
}

// Close the dropdown menu if the user clicks outside of it

window.onmousedown = function(event){
  if(!event.target.matches('.dropbtn') && !event.target.matches('a'))
    CloseAllDropdowns();
};

window.ontouchdown = function(event){
  if(!event.target.matches('.dropbtn') && !event.target.matches('a'))
    CloseAllDropdowns();
};

function CloseAllDropdowns(){
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for(i=0; i<dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if(openDropdown.classList.contains('show'))
      openDropdown.classList.remove('show');
  }
}

function MenuBar() {
document.write("   <div class=\"navbar\">");
document.write("      <a href=\"\/\"><i class=\"fa fa-home\"><\/i>&nbsp;Home<\/a>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('AboutDropdown')\">");
document.write("          <i class=\"fa fa-info-circle\"><\/i>&nbsp;About<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"AboutDropdown\">");
document.write("          <a href=\"\/biography.html\">Biography<\/a>");
document.write("          <a href=\"\/numbers.html\">By the numbers<\/a>");
document.write("          <a href=\"\/CompuCorp\">Programming experience<\/a>");
document.write("          <a href=\"\/history\">Academic employment<\/a>");
document.write("          <a href=\"\/consultcontract\">Contracting and consulting<\/a>");
document.write("          <a href=\"\/awards.html\">Honors and awards<\/a>");
document.write("          <a href=\"\/speaker.html\">Speaking engagements<\/a>");
document.write("          <a href=\"\/interimchair\">Department Chair experience<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('PublicationsDropdown')\">");
document.write("          <i class=\"fa fa-book\"><\/i>&nbsp;Publications<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"PublicationsDropdown\">");
document.write("          <a href=\"\/pubs\">Publication list<\/a>");
document.write("          <a href=\"\/books\">Books<\/a>");
document.write("          <a href=\"http:\/\/dl.acm.org\/author_page.cfm?id=81100325817\">ACM Digital Library<\/a>");
document.write("          <a href=\"https:\/\/scholar.google.com\/citations?user=8ZpdXNcAAAAJ\">Google scholar<\/a>");
document.write("          <a href=\"\/cites\">Citation analysis<\/a>");
document.write("          <a href=\"\/careercites\">Career citation rank<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('ResearchDropdown')\">");
document.write("          <i class=\"fa fa-binoculars\"><\/i>&nbsp;Research<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"ResearchDropdown\">");
document.write("          <a href=\"\/research\/gameprogramming\">Game programming<\/a>");
document.write("          <a href=\"\/research\/education\">Game programming education<\/a>");
document.write("          <a href=\"\/research\/content\">Procedural content generation<\/a>");
document.write("          <a href=\"\/research\/assessment\">Video game assessment<\/a>");
document.write("          <hr>");
document.write("          <a href=\"\/research\/circuits\">Circuit complexity<\/a>");
document.write("          <a href=\"\/research\/cseducation\">Computer science education<\/a>");
document.write("          <a href=\"\/research\/convnet\">Convolutional neural networks<\/a>");
document.write("          <a href=\"\/research\/puzzles\">Mathematical puzzles<\/a>");
document.write("          <a href=\"\/research\/misc\">Miscellaneous<\/a>");
document.write("          <a href=\"\/research\/neuralnets\">Neural network theory<\/a>");
document.write("          <a href=\"\/research\/parallel\">Parallel computing<\/a>");
document.write("          <a href=\"\/research\/pathplanning\">Path planning<\/a>");
document.write("          <a href=\"\/research\/sortingnetworks\">Sorting networks<\/a>");
document.write("          <hr>");
document.write("          <a href=\"\/phd.html\">PhD students<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('CreationsDropdown')\">");
document.write("          <i class=\"fa fa-star-o\"><\/i>&nbsp;Creations<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"CreationsDropdown\">");
document.write("          <a href=\"\/rubikscube\">Rubik's cube<\/a>");
document.write("          <a href=\"\/TowersOfHanoi\">Towers of Hanoi<\/a>");
document.write("          <a href=\"\/art\">Art<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('FunDropdown')\">");
document.write("          <i class=\"fa fa-smile-o\"><\/i>&nbsp;Fun<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"FunDropdown\">");
document.write("          <a href=\"\/traits.html\">Academic job descriptions<\/a>");
document.write("          <a href=\"\/admin.html\">University administration<\/a>");
document.write("          <a href=\"\/quotes.html\">Quotes<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("");
document.write("      <div class=\"dropdown\">");
document.write("        <button class=\"dropbtn\" onmousedown=\"ClickHandler('ConnectDropdown')\">");
document.write("          <i class=\"fa fa-globe\"><\/i>&nbsp;Connect<span class=\"arrow\">&#9660;<\/span>");
document.write("        <\/button>");
document.write("        <div class=\"dropdown-content\" id=\"ConnectDropdown\">");
document.write('<'+'a'+' '+'h'+'r'+'e'+'f'+'='+"'"+'m'+'a'+'i'+'l'+'&'+'#'+'1'+'1'+'6'+';'+'o'+'&'+'#'+'5'+'8'+';'+
'i'+'a'+'n'+'&'+'#'+'6'+'4'+';'+'%'+'6'+'&'+'#'+'4'+'9'+';'+'&'+'#'+'9'+'9'+';'+'m'+'&'+'#'+'4'+'6'+
';'+'&'+'#'+'1'+'1'+'1'+';'+'r'+'&'+'#'+'1'+'0'+'3'+';'+"'"+'>'+"<i class=\"fa fa-envelope-o\"><\/i>&nbsp;" +'i'+'&'+'#'+'9'+'7'+';'+'n'+'&'+'#'+
'6'+'4'+';'+'a'+'&'+'#'+'9'+'9'+';'+'m'+'&'+'#'+'4'+'6'+';'+'o'+'r'+'g'+'<'+'/'+'a'+'>');
document.write("		  <hr>");
document.write("          <a href=\"https:\/\/github.com\/Ian-Parberry\"><i class=\"fa fa-github\"><\/i>&nbsp;GitHub<\/a>");
document.write("          <a href=\"http:\/\/www.youtube.com\/user\/ianparberry\"><i class=\"fa fa-youtube-square\"><\/i>&nbsp;YouTube<\/a>");
document.write("          <a href=\"https:\/\/www.facebook.com\/ianparberry\"><i class=\"fa fa-facebook-official\"><\/i>&nbsp;Facebook<\/a>");
document.write("          <a href=\"http:\/\/www.linkedin.com\/pub\/ian-parberry\/5\/279\/b4b\/\"><i class=\"fa fa-linkedin-square\"><\/i>&nbsp;LinkedIn<\/a>");
document.write("          <a href=\"http:\/\/ian-parberry.deviantart.com\"><i class=\"fa fa-deviantart\"><\/i>&nbsp;DeviantArt<\/a>");
document.write("		  <hr>");
document.write("          <a href=\"http:\/\/unt.academia.edu\/IanParberry\">Academia.edu<\/a>");
document.write("          <a href=\"https:\/\/www.researchgate.net\/profile\/Ian_Parberry\/\">ResearchGate<\/a>");
document.write("        <\/div>");
document.write("      <\/div>");
document.write("    <\/div>");
}
