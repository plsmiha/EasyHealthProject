function modificaDatiPaziente(){
    if(!checkPassword()) return; //se la funzione check password

    var email=document.getElementById("Email").value;
    var residenza=document.getElementById("Residenza").value;
    var password=document.getElementById("Password").value;
    var codePA=document.getElementById("CodPA").value;

    fetch('../api/v1/editPaziente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, residenza: residenza, password: password,  codePA: codePA } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true")
        {
            console.log('buon fine')
            window.location.href = "HP_P.html";
        }
        else
        {
            if(data.error=='1'){
                console.log('campo vuoto -wrong format')
            }else if(data.error=="3"){
                
              console.log('email gia registrata');
              document.getElementById("Email").style.background = "#ff7a89";
              document.getElementById("Error_email").innerHTML = "l'email inserita è già associata ad un altro account";

            }
        }
    })
    .catch( error => console.error(error) );  
};
  

  function loadData()
{    
    event.preventDefault();
    fetch('../api/v1/PA', {
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
            document.getElementById("CodPA").appendChild(opt);
        })
    })

    console.log('prendo i dati')
    fetch('../api/v1/editPaziente', {
        method: 'GET', //con il get mi arriva come risposta non solo lo statos ma anche i dati che chiedo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        var elementresid =  document.getElementById("Residenza");
        elementresid.value = data['address']; //assegno a quell'id questo valore che ho appena recuperato dal db

        var elementemail =  document.getElementById("Email");
        elementemail.value = data['email'];
        var elementPA =  document.getElementById("CodPA");
        elementPA.value = data['codePA'];
       
    })
};

function abort(){ //se schiaccio exit non succederà niente, non verrà mandato nessun post, niente backend solo reindirizzamento
    window.location.href = "HP_P.html";
      //window.location.href is not a method, it's a property that will tell you the current URL
      //location of the browser. Changing the value of the property will redirect the page.
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
