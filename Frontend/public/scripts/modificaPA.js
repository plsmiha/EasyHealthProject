function modificaPA(){

    var nome=document.getElementById("Nome").value;
    var sconto=document.getElementById("Sconto").value;
    var params = new URLSearchParams(location.search);
    console.log(params.get('id'));

};


function loadData()
{
  var params = new URLSearchParams(location.search);
  var id=params.get('id');
  var edita= params.get('edit');
  if(edita == "false"){
    var btn_modifica = document.getElementById("btn_salva");
    btn_modifica.style.display = "None";


    document.getElementById('Nome').readOnly = true
    document.getElementById('Sconto').readOnly = true

  }
  console.log(id);
    event.preventDefault();
    fetch('../api/v1/PA', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        data.forEach(el => {
          console.log(el._id.toString());
          if(el._id.toString() === id.toString()){

            var sconto_html = document.getElementById("Sconto");
            sconto_html.value = el.sconto;
            var nome_html = document.getElementById('Nome');
            nome_html.value = el.name;
          }

        })
    })

    console.log('prendo i dati')

};

function abort(){ //se schiaccio exit non succederà niente, non verrà mandato nessun post, niente backend solo reindirizzamento
    window.location.href = "pas_AO.html";
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
