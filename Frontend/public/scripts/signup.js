function signup(){

    if(!checkPassword()) return;

    var nome=document.getElementById("Nome").value;
    var cognome=document.getElementById("Cognome").value;
    var residenza=document.getElementById("Residenza").value;
    var CF=document.getElementById("CF").value;
    var email=document.getElementById("Email").value;
    var password=document.getElementById("Password").value;
    var codPA=document.getElementById("CodPA").value;

    fetch('../api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nome, cognome: cognome, residenza: residenza, CF: CF, email: email, password: password, codPA: codPA } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true")
        {
            window.location.href = "index.html";
        }
        else
        {
            if(data.error=="2")
            {
                document.getElementById("CF").style.background = "#ff7a89";
                document.getElementById("Error_CF").hidden = false;
            }
            else if(data.error=="3")
            {
                document.getElementById("Email").style.background = "#ff7a89";
                document.getElementById("Error_email").hidden = false;
            }
        }
    })
    .catch( error => console.error(error) );
};
function checkPassword()
{
    var password = document.getElementById("Password").value;
    var err = document.getElementById("Error_password");
    var pass = document.getElementById("Password");
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
        pass.style.background = "#a2ff96";
        return true;
    }
};
function loadPA(){
    fetch('../api/v1/PA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nome, cognome: cognome, residenza: residenza, CF: CF, email: email, password: password, codPA: codPA } ),
    })
};