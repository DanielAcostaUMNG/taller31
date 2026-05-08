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
function transformarY(y)
{
    return HEIGHT-y; //Para que el (0,0) empiece en la parte inferior derecha
}
function DibujarPixel(x,y, color="black")
{
    ctx.fillStyle = color;
    ctx.fillRect(x, transformarY, 2, 2); 
}
function DibujarEjes()
{
    ctx.strokeStyle ="gray";
    ctx.lineWidth = 1;

    // eje X
    ctx.beginPath();
    ctx.moveTo(0,HEIGHT);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.stroke();
    //eje Y
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0, HEIGHT);
    ctx.stroke();

}

function LimpiarCanvas()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    DibujarEjes();
}
DibujarEjes();