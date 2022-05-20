function modificaDatiMedico(){

    if(!checkPassword()) return;

    var email=document.getElementById("Email").value;
    var address=document.getElementById("Residenza").value;
    var password=document.getElementById("Password").value;
    var titolo=document.getElementById("TitoloMedico").value;
    console.log('passo per le modifiche')
    fetch('../api/v1/modmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, address: address, password: password, title:titolo } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true")
        {
            console.log('buon fine')
        }
        else
        {
            if(data.error=="2")
            {
              console.log('pswd vuota')
            }
            else if(data.error=="3")
            {
              console.log('errore a caso')
            }
        }
    })
    .catch( error => console.error(error) );
};

function loadData()//se la password non viene inserita resta uguale, se viene inserita invece va a modificare la precedente
{
    console.log('caricooo')
    fetch('../api/v1/modmed', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        var elementresid =  document.getElementById("Residenza");
        elementresid.value = data['address'];

        var elementretitolo =  document.getElementById("TitoloMedico");
        elementretitolo.value = data['title'];

        var elementemail =  document.getElementById("Email");
        elementemail.value = data['email'];

    })
};

function abort(){
      window.location.href = "index.html";
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