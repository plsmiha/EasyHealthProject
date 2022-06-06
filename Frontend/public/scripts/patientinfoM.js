var user_id;

function loadData(){
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    user_id = params.id;

    fetch('../api/v2/Paziente/'+user_id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        document.getElementById("Nome").innerText = data['name']+" "+data['surname'];
        document.getElementById("CF").innerText = data['CF'];
        document.getElementById("Indirizzo").innerText = data['address'];
        document.getElementById("Email").innerText = data['email'];       
    })

    fetch('../api/v1/Referto?patient='+user_id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        document.getElementById("container").innerHTML=null;
        data.forEach(function (el) {
            var item=document.createElement("div");
            item.classList.add("item");
            item.innerText = "("+el.date+") "+el.title;
            item.onclick = function() { viewReferto(el._id); };
            document.getElementById("container").appendChild(item);
        });
    })
}

var pdf_file;
var pdf_file_name;
function viewReferto(value)
{
    document.getElementById("view_referto_box").style.visibility="visible";
    document.getElementById("view_referto_box").style.opacity=1;
    fetch('../api/v1/Referto/'+value, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        document.getElementById("title_ref_view").innerText = data.title;
        document.getElementById("comment_view").innerText = data.comment;
        pdf_file=data.pdf_file;
        pdf_file_name=data.title;
        if(pdf_file.length!=0) 
        {
            document.getElementById("pdf_view").style.visibility="visible";
            document.getElementById("l_pdf_view").style.visibility="visible";
        }
    })
}

async function addReferto()
{
    let title=document.getElementById("title_ref").value;
    let comment=document.getElementById("comment").value;
    if(title!="")
    {
        await fetch('../api/v1/Referto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_patient: user_id, title: title, pdf: file, comment: comment}),
        })
        .then((resp) => resp.json())
        .then(function(data) {
            //console.log(data);
        })
    }
    document.getElementById('add_referto_box').style.opacity=0; 
    document.getElementById('add_referto_box').style.visibility='hidden';
    loadData();
}

function downloadPDF()
{
    //console.log(pdf_file);
    const url = pdf_file;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', pdf_file_name+'.pdf');
    document.body.appendChild(link);
    link.click();
}


var file="";
function loadFile()
{
    file="";
    let pdf=document.getElementById("pdf").files;
    if (pdf.length > 0) {
        var fileToLoad = pdf[0];
        var fileReader = new FileReader();
        var base64;
        fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            file=base64;
        };
        fileReader.readAsDataURL(fileToLoad);
    }
}