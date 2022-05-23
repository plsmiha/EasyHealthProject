function doLogin(){

    event.preventDefault();
    var email=document.getElementById("email").value;
    var password=document.getElementById("pass").value;

    fetch('../api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        document.getElementById("email").style.background = "#FFFFFF";
        document.getElementById("pass").style.background = "#FFFFFF";
        document.getElementById("Error_account").hidden = true;
        document.getElementById("Error_verified").hidden = true;

        if(!data.error)
        {
            if (data.redirectTo == 'M') {
                window.location.href = "HP_M.html";
            } else if (data.redirectTo == 'P') {
                window.location.href = "HP_P.html";
            } else if (data.redirectTo == 'AO') {
                window.location.href = "HP_AO.html";
            } else {
                // wtf
            }
        }
        else if(data.error=="Not verified")
        {
            document.getElementById("email").style.background = "#ff7a89";
            document.getElementById("Error_verified").hidden = false;
        }
        else
        {
            document.getElementById("email").style.background = "#ff7a89";
            document.getElementById("pass").style.background = "#ff7a89";
            document.getElementById("Error_account").hidden = false;
        }
    })
    .catch( error => {document.getElementById("email").style.background = "#ff7a89";
    document.getElementById("pass").style.background = "#ff7a89";
    document.getElementById("creds").innerHTML ="*Credenziali non valide!"
   }
   );
};
