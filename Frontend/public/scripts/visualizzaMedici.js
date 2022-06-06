var vettore_pazienti = new Array();
var vettore_id = new Array();

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
                    vettore_id.push(e._id.toString())
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
                btn_visualizza.innerHTML = '<button class="btn" onclick="window.location.href=\'view_profile_M.html?id=' + vettore_id[i - 1] + '&edit=false\';" ><i class="fa fa-bars"></i></button>';

                var btn_elimina = document.createElement('a');
                btn_elimina.innerHTML = '<button class="btn" onclick="eliminaMedicoDaAO(\'' + vettore_id[i - 1] + '\');"><i class="fa fa-trash"></i></button>';

                var btn_modifica = document.createElement('a');
                btn_modifica.innerHTML = '<button class="btn" onclick="window.location.href=\'view_profile_M.html?id=' + vettore_id[i - 1] + '&edit=true\';"><i class="fa fa-pencil"></i></button>';

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

function getParam(param) {
  var url_string = window.location.href;
  var url = new URL(url_string);
  return url.searchParams.get(param);
}

function loadViewMedicData() {
  event.preventDefault();

  let array_PA = {}
  fetch('../api/v1/aree', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(),
  })
      .then((resp) => resp.json())
      .then(function (data) {
          data.forEach(e => {
              array_PA[e._id] = e.name;
              var opt = document.createElement('option');
              opt.innerHTML = e.name;
              opt.value = e._id;
              document.getElementById("Area").appendChild(opt);
          })

          if (getParam("add") != "true") {
              fetch('../api/v1/medic', {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(),
              })
                  .then((resp) => resp.json())
                  .then(function (data) {

                      data.forEach(e => {
                          if (e._id == getParam("id")) {
                              console.log(e)
                                                                                                                                          
                              document.getElementById("Nome").value = e.name;
                              document.getElementById("Cognome").value = e.surname;
                              document.getElementById("Numero").value = e.numero; 
                              document.getElementById("Email").value = e.email; 
                              document.getElementById("Area").value = e.title;
                              document.getElementById("Bio").value = e.bio;

                              var element = document.getElementById('editForm');
                              var children = element.children;
                              for (var i = 0; i < children.length; i++) {
                                  var child = children[i];
                                  if (child.type != "button" && child.type != "submit") {
                                    child.disabled = getParam("edit") != "true";
                                  }
                              }
                              if(getParam("edit") != "true") {
                                document.getElementById("submitButton").hidden = true
                            }

                          }
                      })
                  })
          } else {
              //alert("lo devi aggiungere cretino")
          }

      })

}

function eliminaMedicoDaAO(id) {

  if (confirm("Eliminare il medico selezionato?")) {
      fetch('../api/v1/MedicoDaAO?id=' + id, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
      })
          .then((resp) => resp.json())
          .then(function (data) {
              console.log("medico eliminato")
              console.log(data)
              window.location.href = "doctors_AO.html";
          }).catch(error => console.error(error));
  } else {
      alert("Eliminazione annullata")
  }
}

const genRand = (len) => {
  return Math.random().toString(36).substring(2,len+2);
}


function modificaDatiMedicoDaAO() {

  if (getParam("add") != "true") {

      var email = document.getElementById("Email").value;
      var nome = document.getElementById("Nome").value;
      var cognome = document.getElementById("Cognome").value;
      var numero = document.getElementById("Numero").value;
      var area = document.getElementById("Area").value;
      var bio = document.getElementById("Bio").value;

      fetch('../api/v1/MedicoDaAO?id=' + getParam("id"), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, numero: numero, nome: nome, cognome: cognome, title: area, bio: bio }),
      })
          .then((resp) => resp.json())
          .then(function (data) {
              if (data.success == "true") {
                  console.log('buon fine')
                  window.location.href = "doctors_AO.html";
              }
              else {
                  if (data.error == "1") {
  
                      console.log('email gia registrata');
                      document.getElementById("Email").style.background = "#ff7a89";
                      document.getElementById("Error_email").hidden = false;
  
                  }
              }
          }).catch(error => console.error(error));

  } else {

    var email = document.getElementById("Email").value;
    var nome = document.getElementById("Nome").value;
    var cognome = document.getElementById("Cognome").value;
    var numero = document.getElementById("Numero").value;
    var area = document.getElementById("Area").value;
    var bio = document.getElementById("Bio").value;

    fetch('../api/v1/MedicoDaAO', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, numero: numero, nome: nome, cognome: cognome, title: area, bio: bio }),
  })
      .then((resp) => resp.json())
      .then(function (data) {
          if (data.success == "true") {
              console.log('buon fine')
              window.location.href = "doctors_AO.html";
          }
          else {
              if (data.error == "1") {

                  console.log('email gia registrata');
                  document.getElementById("Email").style.background = "#ff7a89";
                  document.getElementById("Error_email").hidden = false;

              }
          }
      }).catch(error => console.error(error));
  }
};


function navigateToAdd() {
  window.location.href = 'view_profile_M.html?add=true';
}
function abort(){
window.location.href = "doctors_AO.html";
}

function changeTitle() {
  if (getParam("add") == "true") {
    document.getElementById("title").innerHTML = "Aggiungi medico"
  } else {
    if(getParam("edit") != "true") {
      document.getElementById("title").innerHTML = "Visualizza profilo medico"
    } else {
      document.getElementById("title").innerHTML = "Modifica profilo medico"
    }
  }
}
