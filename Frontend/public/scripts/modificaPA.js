var piani = {};
function modificaPA(){
  event.preventDefault();
    var nome=document.getElementById("Nome").value;
    var sconto=document.getElementById("Sconto").value;
    var params = new URLSearchParams(location.search);
    var id= params.get('id');
    var butta = false;


    for(var key in piani) {
      var value = piani[key];

      if(value == nome && key != id){
        console.log('ESISTEGIA');
        window.alert('Nome gia presente.')
        butta = true;
        return;
      }

  }

  if(butta != true)
  {
    console.log('AGGIORNO ');
    fetch('../api/v1/PA', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id:id,nome: nome, sconto: sconto } ),

    })
    .then((resp) => resp.json() )
    .then(function(data) {


          if(data.success != "true"){

                window.alert('Errore:\n'+data.reason+'\nRiprovare.');
                return;

          }
          else{
            console.log('bonk');
            window.location.href = "pas_AO.html";
            return;
          }

    })
    .catch( error => console.log(error) );

  }

};


function loadData()
{
  event.preventDefault();

  var params = new URLSearchParams(location.search);
  var id=params.get('id');
  var edita= params.get('edit');
  if(edita == "false"){
    var btn_modifica = document.getElementById("btn_salva");
    btn_modifica.style.display = "None";
    document.getElementById('title').innerHTML = "Visualizza PA";
    document.getElementById('Nome').readOnly = true;
    document.getElementById('Sconto').readOnly = true;

  }

    fetch('../api/v1/PA', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        data.forEach(el => {
          piani[el._id] = el.name;

          if(el._id.toString() === id.toString()){

            var sconto_html = document.getElementById("Sconto");
            sconto_html.value = el.sconto;
            var nome_html = document.getElementById('Nome');
            nome_html.value = el.name;
          }

        })
    })



};

function abort(){ //se schiaccio exit non succederà niente, non verrà mandato nessun post, niente backend solo reindirizzamento
    window.location.href = "pas_AO.html";
      //window.location.href is not a method, it's a property that will tell you the current URL
      //location of the browser. Changing the value of the property will redirect the page.
}
