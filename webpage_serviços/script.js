document.getElementById("expand").onclick=()=>document.querySelectorAll("details").forEach(d=>d.open=true);

document.getElementById("collapse").onclick=()=>document.querySelectorAll("details").forEach(d=>d.open=false);
