function modificaDatiMedico(){

    console.log('Qui devo modificare i dati')
    return;
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



function checkPassword()
{
    var password = document.getElementById("Password").value;
    var err = document.getElementById("Error_password");
    var pass = document.getElementById("Password");
    if(password.length == 0){
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
