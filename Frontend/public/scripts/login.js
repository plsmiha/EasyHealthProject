function doLogin(){

    var email=document.getElementById("email").value;
    var password=document.getElementById("pass").value;

    fetch('../api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        document.getElementById("Email").style.background = "#C4C4C4";
        document.getElementById("Error_email").hidden = true;
        document.getElementById("Email").style.background = "#C4C4C4";
        document.getElementById("Error_email").hidden = true;

        if(data.success=="true")
        {
            //window.location.href = "index.html";
        }
        else
        {
            if(data.error=="2")
            {

                
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