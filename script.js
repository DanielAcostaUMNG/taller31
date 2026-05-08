const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const escenas = [];

let escenaActual = 0;

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

function DibujarViewport(xmin, ymin, xmax, ymax)
{
    ctx.strokeStyle = "blue";

    ctx.strokeRect(
        xmin,
        HEIGHT - ymax,
        xmax - xmin,
        ymax - ymin
    );

    // eje X
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT - 1);
    ctx.lineTo(WIDTH, HEIGHT - 1);
    ctx.strokeStyle = "green";
    ctx.stroke();

    // eje Y
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, HEIGHT);
    ctx.stroke();
}

function DibujarLinea(x1, y1, x2, y2, color)
{
    ctx.strokeStyle = color;

    ctx.beginPath();

    ctx.moveTo(x1, HEIGHT - y1);
    ctx.lineTo(x2, HEIGHT - y2);

    ctx.stroke();
}

function LimpiarCanvas()
{
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
function ObtenerCodigo(x, y, xmin, ymin, xmax, ymax)
{
    let codigo = INSIDE;
    // izquierda
    if(x < xmin)
    {
        codigo |= LEFT;
    }
    // derecha
    else if(x > xmax)
    {
        codigo |= RIGHT;
    }
    // abajo
    if(y < ymin)
    {
        codigo |= BOTTOM;
    }
    // arriba
    else if(y > ymax)
    {
        codigo |= TOP;
    }
    return codigo;
}
