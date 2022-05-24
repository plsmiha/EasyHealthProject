
function loadData()//se la password non viene inserita resta uguale, se viene inserita invece va a modificare la precedente
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
             document.getElementById("piani").appendChild(opt);
         })
     })

createTable();
};

function createTable() {
    //Build an array containing Customer records.
    var customers = new Array();
    customers.push(["Nome", "Cognome", "AccountAttivato","Email","Indirizzo","PianoAssicurativo", "Option"]);
    customers.push(["John", "Hammond", "1","johnhammond@gmail.com","casaJohn","miHaifregato",'']);
    customers.push(["franco", "Azzolini", "0","xXPussySlayerXx@gmail.com","HomelessShelter","nessunoSonoPovero",'']);
    customers.push(["Mariano", "Franzoni", "0","SuperFranzo@gmail.com","Via brombeis","noIdea",'']);


    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.width='100%';

    //Get the count of columns.
    var columnCount = customers[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = customers[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < customers.length; i++) {

        row = table.insertRow(-1);
        var cell;
        for (var j = 0; j < columnCount; j++) {

          cell = row.insertCell(-1);
          cell.style='text-align: center;';
          if(j+1 == columnCount){
                var btn_visualizza = document.createElement('button');
                btn_visualizza.innerHTML = 'Visualizza';
                var btn_elimina = document.createElement('button');
                btn_elimina.innerHTML = 'Elimina';
                var btn_modifica = document.createElement('button');
                btn_modifica.innerHTML = 'Modifica';
                cell.appendChild(btn_visualizza);
                cell.appendChild(btn_modifica);
                cell.appendChild(btn_elimina);

              }
          else{
                cell.innerHTML = customers[i][j];
              }
        }


    }


    var dvTable = document.getElementById("listone");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}
