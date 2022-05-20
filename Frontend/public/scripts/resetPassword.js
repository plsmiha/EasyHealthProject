function checkpass() {
  if (document.getElementById('pass1').value ==
    document.getElementById('pass2').value) {
    document.getElementById('pass2').style.background = 'lightgreen';
    document.getElementById('l_notmatch').innerHTML = '';
  } else {
    document.getElementById('pass2').style.background = "#ff7a89";
    document.getElementById('l_notmatch').innerHTML = 'Password not matching';
  }
}
