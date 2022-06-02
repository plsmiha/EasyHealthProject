var vettore_pazienti = new Array();
function loadData()//se la password non viene inserita resta uguale, se viene inserita invece va a modificare la precedente
{
  event.preventDefault();


  fetch('../api/v1/aree', {
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
             document.getElementById("piani").appendChild(opt);
         })
     });



     vettore_pazienti.push(["NOME", "COGNOME", "EMAIL","NUMERO","AREA COMPETENZA", "OPZIONI"]);

var array_PA = {};


fetch('../api/v1/aree', {
       method: 'GET',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(),
   })
   .then((resp) => resp.json())
   .then(function(data) {
       data.forEach(e => {

         array_PA[e._id] = e.name;
       })

       fetch('../api/v1/medic', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(),
          })
          .then((resp) => resp.json())
          .then(function(data) {
              data.forEach(e => {
                console.log(e);
                    vettore_pazienti.push([e.name.toString(),e.surname.toString(),e.email.toString(),e.numero.toString(),array_PA[e.title.toString()],'']);
              })
              createTable(vettore_pazienti);
          })
   })

};


function cercaperpa(){
    var elemento=document.getElementById("piani");
    var area=elemento.options[elemento.selectedIndex].text;
    var smistati = vettore_pazienti.filter(item =>item[4].indexOf(area) !== -1 || item[4].indexOf('AREA COMPETENZA') !== -1);

    if(smistati.length != 1){
      createTable(smistati);
    }
    else{
      var tmp = new Array();
      tmp.push(["NOME", "COGNOME", "EMAIL","NUMERO","AREA COMPETENZA", "OPZIONI"]);
      createTable(tmp);
    }


}

function restore_all(){

  createTable(vettore_pazienti);
}

function cercapernome(){
  var nome=document.getElementById("txt_medico_nome").value;


  var smistati = vettore_pazienti.filter(item =>item[0].indexOf(nome) !== -1 || item[0].indexOf('NOME') !== -1);
  if(smistati.length != 1){

    createTable(smistati);
  }
  else{
    var tmp = new Array();
    tmp.push(["NOME", "COGNOME", "EMAIL","NUMERO","AREA COMPETENZA", "OPZIONI"]);
    createTable(tmp);
  }



}

function createTable(vettore_pazienti) {
    //Build an array containing Customer records.


    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.width='100%';

    //Get the count of columns.
    var columnCount = vettore_pazienti[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = vettore_pazienti[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.

    for (var i = 1; i < vettore_pazienti.length; i++) {

        row = table.insertRow(-1);
        var cell;
        for (var j = 0; j < columnCount; j++) {

          cell = row.insertCell(-1);
          cell.style='text-align: center;';
          if(j+1 == columnCount){
                var btn_visualizza = document.createElement('a');
                btn_visualizza.innerHTML = '<button class="btn"><i class="fa fa-bars"></i></button>';
                var btn_elimina = document.createElement('a');
                btn_elimina.innerHTML = '<button class="btn"><i class="fa fa-trash"></i></button>';
                var btn_modifica = document.createElement('a');
                btn_modifica.innerHTML =  '<button class="btn"><i class="fa fa-pencil"></i></button>';

                cell.appendChild(btn_visualizza);
                cell.appendChild(btn_modifica);
                cell.appendChild(btn_elimina);

              }
          else{
                cell.innerHTML = vettore_pazienti[i][j];
              }
        }


    }


    var dvTable = document.getElementById("listone");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}


function eliminaPADaAO() {
    event.preventDefault();
    var params = new URLSearchParams(location.search);
    var id= params.get('id');
  if (confirm("Eliminare il paziente selezionato?")) {
    fetch('../api/v1/PA', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id:id} ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
      console.log("PA eliminato")
      console.log(data)
      window.location.href = "pas_AO.html";
    }).catch( error => console.error(error) );
  } else {
    window.alert("Eliminazione annullata");
  }
}
