var vettore_pazienti = new Array();
var vettore_id = new Array();

function loadData()//se la password non viene inserita resta uguale, se viene inserita invece va a modificare la precedente
{
    event.preventDefault();


    fetch('../api/v1/PA', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
        .then((resp) => resp.json())
        .then(function (data) {
            data.forEach(el => {
                var opt = document.createElement('option');
                opt.innerHTML = el.name;
                opt.value = el._id;
                document.getElementById("piani").appendChild(opt);
            })
        });



    vettore_pazienti.push(["NOME", "COGNOME", "EMAIL", "INDIRIZZO", "PA", "OPZIONI"]);

    var array_PA = {};


    fetch('../api/v1/PA', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
        .then((resp) => resp.json())
        .then(function (data) {
            data.forEach(e => {

                array_PA[e._id] = e.name;
            })

            fetch('../api/v2/Paziente/all', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(),
            })
                .then((resp) => resp.json())
                .then(function (data) {
                    data.forEach(e => {
                        vettore_pazienti.push([e.name.toString(), e.surname.toString(), e.email.toString(), e.address.toString(), array_PA[e.codePA.toString()], '']);
                        vettore_id.push(e._id.toString())
                    })
                    createTable(vettore_pazienti);
                })
        })

};


function cercaperpa() {
    var elemento = document.getElementById("piani");
    var codePA = elemento.options[elemento.selectedIndex].text;
    var smistati = vettore_pazienti.filter(item => item[4].indexOf(codePA) !== -1 || item[4].indexOf('PA') !== -1);

    if (smistati.length != 1) {
        createTable(smistati);
    }
    else {
        var tmp = new Array();
        tmp.push(["NOME", "COGNOME", "EMAIL", "INDIRIZZO", "PA", "OPZIONI"]);
        createTable(tmp);
    }


}

function restore_all() {

    createTable(vettore_pazienti);
}

function cercapernome() {
    var nome = document.getElementById("txt_paziente_nome").value;


    var smistati = vettore_pazienti.filter(item => item[0].indexOf(nome) !== -1 || item[0].indexOf('NOME') !== -1);
    if (smistati.length != 1) {

        createTable(smistati);
    }
    else {
        var tmp = new Array();
        tmp.push(["NOME", "COGNOME", "EMAIL", "INDIRIZZO", "PA", "OPZIONI"]);
        createTable(tmp);
    }



}

function createTable(vettore_pazienti) {
    //Build an array containing Customer records.


    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.width = '100%';

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
            cell.style = 'text-align: center;';
            if (j + 1 == columnCount) {
                var btn_visualizza = document.createElement('a');
                btn_visualizza.innerHTML = '<button class="btn" onclick="window.location.href=\'patientinfo_M.html?id=' + vettore_id[i - 1] + '\';" ><i class="fa fa-upload"></i></button>';
                cell.appendChild(btn_visualizza);
            }
            else {
                cell.innerHTML = vettore_pazienti[i][j];
            }
        }


    }


    var dvTable = document.getElementById("listone");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}


function navigateToAdd() {
    window.location.href = 'view_profile_P.html?add=true';
}
function abort(){
  window.location.href = "patients_AO.html";
}