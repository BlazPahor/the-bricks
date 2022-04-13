function refreshPage() {
    window.location.reload();
}

function drawIt() {
    var x = 150;
    var y = 150;
    var dx = 2;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;
    var rightDown = false;
    var leftDown = false;
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;
    var tocke; //deklaracija spremenljivke
    var dilan;
    var canvasMinX;
    var canvasMaxX;
    var colors = ["#fc03ec", "black"];
    var pickaxe = new Image();
    pickaxe.src = "img/pickax.png";
    var start = true;
    var temp;
    var gover = true;
    var gameWin = false;


    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        dilan = setInterval(draw, 10);
        // dodajanje kode v metodo init
        tocke = 0;
        $("#tocke").html(tocke);
    }

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage = (pickaxe);
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    //END LIBRARY CODE

    function draw() {
        clear();
        circle(x, y, 10);
        //premik ploščice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        } else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }

        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);


        //riši opeke
        for (i = 0; i < NROWS; i++) {
            if (i == 0) ctx.fillStyle = "#fc03ec ";
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
        rowheight = BRICKHEIGHT + PADDING + r / 2; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING + r / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy;
            bricks[row][col] = 0;
            tocke += 1;
            $("#tocke").html(tocke);
        }
        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;

        if (y + dy < r)
            dy = -dy;
        else if (y + dy > HEIGHT - r) {
            //Odboj kroglice, ki je odvisen od odboja od ploščka 
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
            } else {
                start = false;
                //clearInterval(IntervalId);
                //console.log("Game Over");
                gover = false;
            }
        }

        x += dx;
        y += dy;

        if (gameWin == true) {
            gamewon();
            if (spc == 1) {
                snd3.play();
                spc++;
            }
        }
        if (start == false) {
            gameover();
            $(document).off("keydown");
            $(document).off("keyup");
            $(document).off("keypress");
            $(document).off("mousemove");
            $(document).off("click");
            dx = 0;
            dy = 0;


        }


    }

    function gameover() {
        clear();
        ctx.fillStyle = "white";
        ctx.font = "bold 60px sans-serif";
        ctx.fillText("YOU FAILED!", WIDTH / 2 - 200, HEIGHT / 2);
        start = true;
    }

    function gamewon() {
        clear();
        ctx.fillStyle = "black";
        ctx.font = "bold 72px sans-serif";
        ctx.fillText("You Won!", WIDTH / 2 - 200, HEIGHT / 2);
        ctx.font = "bold 36px sans-serif";
        ctx.fillText("Score: " + tocke, WIDTH / 2 - 200, HEIGHT / 2 + 100);
        ctx.fillText("Time: " + izpisTimer, WIDTH / 2 - 200, HEIGHT / 2 + 150);
        start = true;
        dx = 0;
        dy = 0;
        //stop the timer
        clearInterval(intTimer);
        paddlex = -100;
        paddlew = 0;
        paddleh = 0;
    }

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75;
    }

    function onKeyDown(evt) {
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 5;
        NCOLS = 5;
        BRICKWIDTH = (WIDTH / NCOLS) - 1;
        BRICKHEIGHT = 15;
        PADDING = 1;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }

    function init_mouse() {
        //canvasMinX = $("#canvas").offset().left;
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;
    }

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = evt.pageX - canvasMinX;
        }
    }
    $(document).mousemove(onMouseMove);




    init();
    init_paddle();
    initbricks();
    init_mouse();

}