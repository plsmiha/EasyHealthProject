
function startReset(){
  var email=document.getElementById("email_reset").value;
  fetch('../api/v1/resetPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email: email} ),
  })
  .then((resp) => resp.json())
  .then(function(data) {
      if(data.success=="true")
      {
          console.log('buon fine')
          window.location.href = "login.html";
      }
      else
      {
          if(data.error=="2")
          {
            console.log('error 2')
            document.getElementById("email_reset").style.background = "#ff7a89";
            document.getElementById("Error_email").innerHTML = "l'email inserita non corrisponde a nessun account";
          }
          else if(data.error=="1")
          {
            window.alert('Errore:\n'+data.reason+'\nRiprovare.')
            document.getElementById("email_reset").style.background = "#ff7a89";
          }
      }
  })
  .catch( error => console.error(error) );


};
