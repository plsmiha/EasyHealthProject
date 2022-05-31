year=new Date().getFullYear();
month=new Date().getMonth();
const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const boxes = [["boxday00","boxday01","boxday02","boxday03","boxday04"],
               ["boxday10","boxday11","boxday12","boxday13","boxday14"],
               ["boxday20","boxday21","boxday22","boxday23","boxday24"],
               ["boxday30","boxday31","boxday32","boxday33","boxday34"],
               ["boxday40","boxday41","boxday42","boxday43","boxday44"]];

async function loadCalendar()
{
    let s="", caselle=0;
    d = new Date(year, month);

    document.getElementById("month").innerHTML=monthNames[month]+" "+year;

    const data = await fetch('../api/v1/agendaMedico?year='+d.getFullYear()+'&month='+(d.getMonth()+1), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    }).then(response => response.json());

    for(let r=0;r<5;r++) //reset grafico giorni
        for(let c=0;c<5;c++)
        {
            document.getElementById(boxes[r][c]).style.background = "#FFFFFF";
            document.getElementById(boxes[r][c]).innerHTML = "";
        }

    if(getDay(d)!=0) //Riempio le caselle lavorative del mese precedente
        for(let i=1;i<getDay(d);i++)
        {
            s+="// ";
            document.getElementById(boxes[(caselle/5)|0][caselle%5]).style.background = "#CCCCCC";
            caselle++;
        }

    let index_day=1;
    while (d.getMonth() == month) { //Inserisco i giorni del mese, esclusi i weekend
        let day=getDay(d);
        if(day!=0)
        {
            if(d < new Date()) //data prima di oggi
            {
                s+="// ";
                document.getElementById(boxes[(caselle/5)|0][caselle%5]).style.background = "#CCCCCC";
            }
            else
            {
                
                s+=("0" + index_day).slice(-2)+" ";
                let number = data.filter(function(value) { return value.day === d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() }).length;
                document.getElementById(boxes[(caselle/5)|0][caselle%5]).innerHTML = ((number==0)?'':('<div id="slots_number">'+number+' slot</div>'))+'<div id="number">'+d.getDate()+'</div><div id="lens" onclick="viewSlot('+d.getDate()+','+d.getMonth()+','+d.getFullYear()+');"></div><div id="plus" onclick="openSlot('+d.getDate()+','+d.getMonth()+','+d.getFullYear()+');"></div>';
            }
            caselle++;
        }
        if(day==5)
            s+="\n";
        d.setDate(d.getDate() + 1);
        index_day++;
    }

    while(caselle<25) //Riempio le utlime vuote
    {
        s+="// ";
        document.getElementById(boxes[(caselle/5)|0][caselle%5]).style.background = "#CCCCCC";
        caselle++;
    }

    console.log(s);
}
function getDay(date) 
{
    let day = date.getDay();
    if (day == 6) day = 0;
    return day;
}

function today()
{
    year=new Date().getFullYear();
    month=new Date().getMonth();

    document.getElementById("prevmonth").style.borderRightColor = "#CCCCCC";
    loadCalendar();
}

function nextMonth()
{
    if(month==11)
    {
        year++;
        month=0;
    }
    else
        month++;
    
    document.getElementById("prevmonth").style.borderRightColor = "#D4001C";
    loadCalendar();
}

function prevMonth()
{
    if(new Date(year,month) >= new Date())
    {
        if(month==0)
        {
            year--;
            month=11;
        }
        else
            month--;
        loadCalendar();
    }
    if(year == new Date().getFullYear() && month == new Date().getMonth())
        document.getElementById("prevmonth").style.borderRightColor = "#CCCCCC";
}

var daySelected, monthSelected, yearSelected;
function openSlot(day, month, year)
{
    daySelected=day;
    monthSelected=month;
    yearSelected=year;
    document.getElementById("add_slot_box").style.display="block";
}

function addSlot()
{
    document.getElementById("from_time").style.background="#DDDDDD";
    document.getElementById("to_time").style.background="#DDDDDD";

    day=yearSelected+"-"+(monthSelected+1)+"-"+daySelected;
    from=document.getElementById("from_time").value;
    to=document.getElementById("to_time").value;

    if(from >= to)
    {
        document.getElementById("from_time").style.background="#ff7a89";
        document.getElementById("to_time").style.background="#ff7a89";
    }
    else
    {
        fetch('../api/v1/agendaMedico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({day: day, from: from, to: to}),
        })
        .then((resp) => resp.json())
        .then(function(data) {
            console.log(data);
        })
        document.getElementById('add_slot_box').style.display='none';
        loadCalendar();
    }
}

function viewSlot(day, month, year)
{
    //carico da api gli slot di quel giorno
    document.getElementById("remove_slot_box").style.display="block";
}

function removeSlot(id)
{
    //chiamata a api per rimozione slot
}