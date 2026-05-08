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

function CohenSutherland(
    x1,
    y1,
    x2,
    y2,
    xmin,
    ymin,
    xmax,
    ymax
)
{
    if(x1 === x2 && y1 === y2)
    {
        return {
            visible:false
        };
    }

    let codigo1 = ObtenerCodigo(
        x1,
        y1,
        xmin,
        ymin,
        xmax,
        ymax
    );

    let codigo2 = ObtenerCodigo(
        x2,
        y2,
        xmin,
        ymin,
        xmax,
        ymax
    );

    let aceptada = false;

    while(true)
    {
        // totalmente dentro
        if((codigo1 | codigo2) === 0)
        {
            aceptada = true;

            break;
        }

        // totalmente fuera
        else if((codigo1 & codigo2) !== 0)
        {
            break;
        }

        // parcialmente visible
        else
        {
            let codigoFuera;

            let x;

            let y;

            // escoger punto fuera
            if(codigo1 !== 0)
            {
                codigoFuera = codigo1;
            }
            else
            {
                codigoFuera = codigo2;
            }

            // arriba
            if(codigoFuera & TOP)
            {
                x = x1 + (x2 - x1) *
                (ymax - y1) / (y2 - y1);

                y = ymax;
            }

            // abajo
            else if(codigoFuera & BOTTOM)
            {
                x = x1 + (x2 - x1) *
                (ymin - y1) / (y2 - y1);

                y = ymin;
            }

            // derecha
            else if(codigoFuera & RIGHT)
            {
                y = y1 + (y2 - y1) *
                (xmax - x1) / (x2 - x1);

                x = xmax;
            }

            // izquierda
            else if(codigoFuera & LEFT)
            {
                y = y1 + (y2 - y1) *
                (xmin - x1) / (x2 - x1);

                x = xmin;
            }

            // actualizar primer punto
            if(codigoFuera === codigo1)
            {
                x1 = Math.round(x);

                y1 = Math.round(y);

                codigo1 = ObtenerCodigo(
                    x1,
                    y1,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }

            // actualizar segundo punto
            else
            {
                x2 = Math.round(x);

                y2 = Math.round(y);

                codigo2 = ObtenerCodigo(
                    x2,
                    y2,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }
        }
    }

    // línea aceptada
    if(aceptada)
    {
        return {

            visible:true,

            x1,
            y1,
            x2,
            y2
        };
    }

    // línea rechazada
    return {

        visible:false
    };
}

function RenderizarEscena()
{
    // limpiar canvas
    LimpiarCanvas();

    // si no hay escenas
    if(escenas.length === 0)
    {
        return;
    }

    // obtener escena actual
    const escena = escenas[escenaActual];

    // viewport
    const v = escena.viewport;

    DibujarViewport(
        v.xmin,
        v.ymin,
        v.xmax,
        v.ymax
    );

    // línea original
    const o = escena.original;

    DibujarLinea(
        o.x1,
        o.y1,
        o.x2,
        o.y2,
        "red"
    );

    // línea recortada
    if(escena.recorte.visible)
    {
        const r = escena.recorte;

        DibujarLinea(
            r.x1,
            r.y1,
            r.x2,
            r.y2,
            "orange"
        );
    }

    // información
    document.getElementById("info").innerHTML = `

        <p>
        <strong>Escena:</strong>
        ${escenaActual + 1}
        </p>

        <p>
        Línea original:<br>
        (${o.x1}, ${o.y1})<br>
        (${o.x2}, ${o.y2})
        </p>

        ${
            escena.recorte.visible
            ?
            `
            <p>
            Línea recortada:<br>
            (${escena.recorte.x1},
            ${escena.recorte.y1})<br>

            (${escena.recorte.x2},
            ${escena.recorte.y2})
            </p>
            `
            :
            `
            <p>
            Línea fuera del viewport
            </p>
            `
        }
    `;
}

document.getElementById("agregarBtn")
.addEventListener("click", () =>
{
    // viewport
    const xmin = parseInt(
        document.getElementById("xmin").value
    );

    const ymin = parseInt(
        document.getElementById("ymin").value
    );

    const xmax = parseInt(
        document.getElementById("xmax").value
    );

    const ymax = parseInt(
        document.getElementById("ymax").value
    );

    // línea
    const x1 = parseInt(
        document.getElementById("x1").value
    );

    const y1 = parseInt(
        document.getElementById("y1").value
    );

    const x2 = parseInt(
        document.getElementById("x2").value
    );

    const y2 = parseInt(
        document.getElementById("y2").value
    );

    // validar campos
    if(
        isNaN(xmin) ||
        isNaN(ymin) ||
        isNaN(xmax) ||
        isNaN(ymax) ||
        isNaN(x1) ||
        isNaN(y1) ||
        isNaN(x2) ||
        isNaN(y2)
    )
    {
        alert("Complete todos los campos");

        return;
    }

    // ejecutar clipping
    const recorte = CohenSutherland(
        x1,
        y1,
        x2,
        y2,
        xmin,
        ymin,
        xmax,
        ymax
    );

    // guardar escena
    escenas.push({

        viewport:{
            xmin,
            ymin,
            xmax,
            ymax
        },

        original:{
            x1,
            y1,
            x2,
            y2
        },

        recorte
    });

    // movernos a la última escena
    escenaActual = escenas.length - 1;

    // renderizar
    RenderizarEscena();
});

// primera escena
document.getElementById("primeroBtn")
.addEventListener("click", () =>
{
    if(escenas.length === 0)
    {
        return;
    }

    escenaActual = 0;

    RenderizarEscena();
});

// escena anterior
document.getElementById("anteriorBtn")
.addEventListener("click", () =>
{
    if(escenaActual > 0)
    {
        escenaActual--;

        RenderizarEscena();
    }
});

// siguiente escena
document.getElementById("siguienteBtn")
.addEventListener("click", () =>
{
    if(escenaActual < escenas.length - 1)
    {
        escenaActual++;

        RenderizarEscena();
    }
});

// última escena
document.getElementById("ultimoBtn")
.addEventListener("click", () =>
{
    if(escenas.length === 0)
    {
        return;
    }

    escenaActual = escenas.length - 1;

    RenderizarEscena();
});

// limpiar al iniciar
LimpiarCanvas();