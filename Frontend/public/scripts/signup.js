function signup(){

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
function loadPA(){

};