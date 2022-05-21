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
        else
        {
            document.getElementById("Email").style.background = "#ff7a89";
            document.getElementById("Error_email").hidden = false;
            
        }
    })
    .catch( error => console.error(error) );
};