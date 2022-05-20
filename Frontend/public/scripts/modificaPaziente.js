function modificaDatiPaziente(){

    if(!checkPassword()) return;

    var email=document.getElementById("Email").value;
    var address=document.getElementById("Residenza").value;
    var password=document.getElementById("Password").value;
    var CodePA=document.getElementById("CodePA").value;

    fetch('../api/v1/modificaProfiloPaziente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, address: address, password: password, CodePA: CodePA } ),
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