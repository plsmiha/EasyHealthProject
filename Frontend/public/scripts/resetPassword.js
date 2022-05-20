
function startReset(){
  var email=document.getElementById("Email").value;
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
          window.location.href = "index.html";
      }
      else
      {
          if(data.error=="2")
          {
            console.log('error 2')
          }
          else if(data.error=="3")
          {
            console.log('error 3 in caso miha implementi qualche error magico')
          }
      }
  })
  .catch( error => console.error(error) );


};
