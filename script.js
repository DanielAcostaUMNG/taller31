const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const HEIGHT = canvas.height;
const escenas =[]; // Almacena todas las lineas procesadas

let EscenaActual = 0; //Indica cual mostrar
const INDIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM =4;
const TOP = 8;

function DibujarViewport(xmin,ymin, xmax, ymax)
{
    ctx.strokeStyle = "blue";
    ctx.strtokeRect(xmin, HEIGHT - ymax, xmax-xmin, ymax-ymin);
    
    // eje X
    ctx.beginPath();
    ctx.moveTo(0,HEIGHT);
    ctx.lineTo(canvas.WIDTH, HEIGHT);
    ctx.strokeStyle = "green";
    ctx.stroke();
    
    //eje Y
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0, HEIGHT);
    ctx.stroke();


}
function DibujarLinea(x1,y1,x2,y2, color)
{
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, HEIGHT - y1);
    ctx.lineTo(x2, HEIGHT - 21);
    ctx.stroke(); 
}

function LimpiarCanvas()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    DibujarEjes();
}
DibujarEjes();