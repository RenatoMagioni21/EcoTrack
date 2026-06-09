function calcular(){
const km=parseFloat(document.getElementById("km").value)||0;
const energia=parseFloat(document.getElementById("energia").value)||0;

if(km<=0 && energia<=0){
alert("Preencha pelo menos um campo.");
return;
}

const total=((km*0.20)+(energia*0.09)).toFixed(2);

document.getElementById("valor").innerText=total;
document.getElementById("resultado").classList.remove("hidden");

const nivel=document.getElementById("nivel");
const dica=document.getElementById("dica");

if(total<80){
nivel.innerHTML="🟢 Pegada baixa";
dica.innerHTML="Muito bem! Seu impacto ambiental está baixo.";
}else if(total<150){
nivel.innerHTML="🟡 Pegada moderada";
dica.innerHTML="Você está na média. Pequenas mudanças podem ajudar.";
}else{
nivel.innerHTML="🔴 Pegada alta";
dica.innerHTML="Tente reduzir deslocamentos e economizar energia.";
}}
