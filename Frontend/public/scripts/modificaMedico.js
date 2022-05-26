function modificaDatiMedico(){

    if(!checkPassword()) return;
    event.preventDefault();
    var email=document.getElementById("Email").value;
    var address=document.getElementById("Residenza").value;
    var password=document.getElementById("Password").value;
    var titolo=document.getElementById("aree").value;
    console.log('passo per le modifiche')
    fetch('../api/v1/Medico', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, address: address, password: password, title:titolo } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
      var elementresid =  document.getElementById("Error_email");
          if(data.success != "true"){
              if(data.error == 1){
                elementresid.innerHTML = "*Email già presente!";
              }
              else{
                window.alert('Errore:\n'+data.reason+'\nRiprovare.')
                elementresid.innerHTML = "";
              }

          }
          else{
            window.location.href = "HP_M.html";
          }

    })
    .catch( error => console.log(error) );
};

function loadData()//se la password non viene inserita resta uguale, se viene inserita invece va a modificare la precedente
{
  event.preventDefault();

  fetch('../api/v1/aree', {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(),
     })
     .then((resp) => resp.json())
     .then(function(data) {
         data.forEach(el => {
             var opt = document.createElement('option');
             opt.innerHTML = el.name;
             opt.value = el._id;
             document.getElementById("aree").appendChild(opt);
         })
     })




    console.log('caricooo')
    fetch('../api/v1/Medico', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        var elementresid =  document.getElementById("Residenza");
        elementresid.value = data['address'];

        var elementretitolo =  document.getElementById("aree");
        elementretitolo.value = data['title'];

        var elementemail =  document.getElementById("Email");
        elementemail.value = data['email'];

    })
};

function abort(){
      window.location.href = "HP_M.html";
}

function checkPassword()
{
    var password = document.getElementById("Password").value;
    var err = document.getElementById("Error_password");
    var pass = document.getElementById("Password");
    if(password.length == 0){
      err.innerHTML="";
      pass.style.background = "#C4C4C4";
      return true;
    }
    if(password.length<8)
    {
        err.innerHTML="La password deve contenere almeno 8 caratteri";
        pass.style.background = "#ff7a89";
        return false;
    }
    else if(!password.match(new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])")))
    {
        err.innerHTML="La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale";
        pass.style.background = "#ff7a89";
        return false;
    }
    else
    {
        err.innerHTML="";
        pass.style.background = "#a2ff96";
        return true;
    }
};
