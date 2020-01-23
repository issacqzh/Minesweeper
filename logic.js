$(document).ready(function() {
    //timer
    var s = 0;
    var start = false;
    setInterval(function() {
        if (!start) {
            return;
        }
        s++;
        $(".time").text(s);
    }, 1000);

    var score = [];
    var board = [];
    var clicked = [];
    var width = 8;
    var height =8;
    var target = 6;
    var remaining = target;
    boardDraw(width, height, target);
    $(".change").click(function() {
        minenum = $(".width").val() * $(".height").val();
        if ($(".mines").val() < 1 || $(".mines").val() >= minenum||$(".width").val()>40||$(".width").val()<8||$(".height").val()>30||$(".height").val()<8) {
            $(".width").val("");
            $(".height").val("");
            $(".mines").val("");
            alert("invalid input" );
             
            return;
        }

        console.log("sasas");
        s = 0;
        $(".time").text(s);
        width = $(".width").val();
        height = $(".height").val();
        target = $(".mines").val();
        remaining = target;
        $(".Bnum").text(remaining);
        $(".board").empty();
        boardDraw(width, height, target);
    });
    //new game
    $(".newgame").click(function() {
        start = false;
        s = 0;
        $(".time").text(s);
        remaining = target;
        $(".Bnum").text(remaining);
        $(".board").empty();
        boardDraw(width, height, target);
    });

    // click on blocks
    $(".board").on("click", ".block", function(event) {
        start = true;
        var pos = $(this).attr("id");
        var curheight = Math.floor(pos / width);
        var curwidth = pos % width;
        if (event.shiftKey) {
            if (clicked[curheight][curwidth] == 1) {
                return;
            }

            if ($(this).css("background-color") == "rgb(220, 20, 60)") {
                $(this).empty();
                $(this).css("background-color", "#A9A9A9");
                remaining++;
                $(".Bnum").text(remaining);
            } else {
                $(this).css("background-color", "#DC143C");
                $(this).append("<i class=\"fas fa-flag\"></i>");
                remaining--;
                $(".Bnum").text(remaining);
            }


        } else {
            click(curheight, curwidth);
        }

        setTimeout(function() {
            if (checkwin()) {
                alert("You Win!");
                rank();
                start = false;
                s = 0;
                $(".time").text(s);
                remaining = target;
                $(".Bnum").text(remaining);
                $(".board").empty();
                boardDraw(width, height, target);
            }
        }, 100);

    });

    function checkwin() {
        if (remaining == 0) {
            for (i = 0; i < height; i++) {
                for (j = 0; j < width; j++) {
                    if (!((board[i][j].css("background-color") == "rgb(220, 20, 60)" && board[i][j].attr("name") == "mine") || clicked[i][j] == 1)) {

                        return false;

                    }
                }
            }
            return true;
        }
    }


    function boardDraw(width, height, target) {
        //    board drawing
        board = [];
        for (i = 0; i < height; i++) {
            board[i] = [];
            clicked[i] = [];
            for (j = 0; j < width; j++) {
                board[i][j] = $("<button type=\"button\" class=\"block\" name=\"not\" value=\"0\"></button>");
                $(".board").append(board[i][j]);
                board[i][j] = $(".block").last();
                let idnum = i * width + j;
                board[i][j].attr("id", idnum);
                clicked[i][j] = 0;
            }
            $(".board").append("<br>");
        }

        // mines planting
        var mines = 0;

        while (mines < target) {
            let i = Math.floor(Math.random() * height);
            let j = Math.floor(Math.random() * width);
            if (board[i][j].attr("name") != "mine") {
                board[i][j].attr("name", "mine");
                mines++;
            }
        }
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                let count = 0;
                if (checkBound(i - 1, j) == "mine") {
                    count++;
                }
                if (checkBound(i + 1, j) == "mine") {
                    count++;
                }
                if (checkBound(i, j - 1) == "mine") {
                    count++;
                }
                if (checkBound(i, j + 1) == "mine") {
                    count++;
                }
                if (checkBound(i - 1, j - 1) == "mine") {
                    count++;
                }
                if (checkBound(i - 1, j + 1) == "mine") {
                    count++;
                }
                if (checkBound(i + 1, j - 1) == "mine") {
                    count++;
                }
                if (checkBound(i + 1, j + 1) == "mine") {
                    count++;
                }
                board[i][j].attr("value", count);

            }
        }
        console.log(mines);
    }

    function checkBound(x, y) {
        if (x < 0 || x >= height || y < 0 || y >= width) {
            return "null";
        }
        return board[x][y].attr("name");
    }

    function checkMarked(x, y) {
        if (x < 0 || x >= height || y < 0 || y >= width) {
            return false;
        }
        if (board[x][y].css("background-color") == "rgb(220, 20, 60)") {
            return true;
        }
        return false;
    }

    function click(curheight, curwidth) {
        if (board[curheight][curwidth].css("background-color") == "rgb(220, 20, 60)") {

            return;
        }
        if (board[curheight][curwidth].attr("name") == "mine") {
            for(i=0;i<height;i++){
                for(j=0;j<width;j++){
                   if (board[i][j].css("background-color") == "rgb(220, 20, 60)"){
                     board[i][j].empty();
                     board[i][j].css("background-color","#A9A9A9");}
                  if(  board[i][j].attr("name") == "mine"){
                   
                    board[i][j].append("<i class=\"fas fa-bomb\"></i>");
                    board[i][j].css("background-color","#FFD700");
                  }
                }
                
            }
       setTimeout(function(){alert("Game Over");   
            start = false;
            s = 0;
            $(".time").text(s);
            remaining = target;
            $(".board").empty();
            $(".Bnum").text(target);
            boardDraw(width, height, target);},100);  

        } else if (clicked[curheight][curwidth] == 1) {
            let bombcount = 0;
            if (checkMarked(curheight - 1, curwidth)) {
                bombcount++;
            }
            if (checkMarked(curheight + 1, curwidth)) {
                bombcount++;
            }
            if (checkMarked(curheight, curwidth - 1)) {
                bombcount++;
            }
            if (checkMarked(curheight, curwidth + 1)) {
                bombcount++;
            }
            if (checkMarked(curheight - 1, curwidth - 1)) {
                bombcount++;
            }
            if (checkMarked(curheight - 1, curwidth + 1)) {
                bombcount++;
            }
            if (checkMarked(curheight + 1, curwidth - 1)) {
                bombcount++;
            }
            if (checkMarked(curheight + 1, curwidth + 1)) {
                bombcount++;
            }
            if (bombcount == board[curheight][curwidth].val()) {
                let end = false;
                if (curwidth - 1 >= 0 && clicked[curheight][curwidth - 1] == 0) {
                    if (board[curheight][curwidth - 1].attr("name") == "mine" && board[curheight][curwidth - 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight, curwidth - 1);
                    if (end) {
                        return;
                    }
                }

                if (curwidth + 1 < width && clicked[curheight][curwidth + 1] == 0) {
                    if (board[curheight][curwidth + 1].attr("name") == "mine" && board[curheight][curwidth + 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight, curwidth + 1);
                    if (end) {
                        return;
                    }
                }



                if (curwidth - 1 >= 0 && curheight - 1 >= 0 && clicked[curheight - 1][curwidth - 1] == 0) {
                    if (board[curheight - 1][curwidth - 1].attr("name") == "mine" && board[curheight - 1][curwidth - 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight - 1, curwidth - 1);
                    if (end) {
                        return;
                    }
                }


                if (curheight - 1 >= 0 && curwidth + 1 < width && clicked[curheight - 1][curwidth + 1] == 0) {
                    if (board[curheight - 1][curwidth + 1].attr("name") == "mine" && board[curheight - 1][curwidth + 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight - 1, curwidth + 1);
                    if (end) {
                        return;
                    }
                }


                if (curheight + 1 < height && curwidth - 1 >= 0 && clicked[curheight + 1][curwidth - 1] == 0) {
                    if (board[curheight + 1][curwidth - 1].attr("name") == "mine" && board[curheight + 1][curwidth - 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight + 1, curwidth - 1);
                    if (end) {
                        return;
                    }
                }

                if (curheight + 1 < height && curwidth + 1 < width && clicked[curheight + 1][curwidth + 1] == 0) {
                    if (board[curheight + 1][curwidth + 1].attr("name") == "mine" && board[curheight + 1][curwidth + 1].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight + 1, curwidth + 1);
                    if (end) {
                        return;
                    }
                }

                if (curheight - 1 >= 0 && clicked[curheight - 1][curwidth] == 0) {
                    if (board[curheight - 1][curwidth].attr("name") == "mine" && board[curheight - 1][curwidth].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight - 1, curwidth);
                    if (end) {
                        return;
                    }
                }

                if (curheight + 1 < height && clicked[curheight + 1][curwidth] == 0) {
                    if (board[curheight + 1][curwidth].attr("name") == "mine" && board[curheight + 1][curwidth].css("background-color") != "rgb(220, 20, 60)") {
                        end = true;
                    }
                    click(curheight + 1, curwidth);
                    if (end) {
                        return;
                    }
                }
            }

        } else {
            clicked[curheight][curwidth] = 1;
 board[curheight][curwidth].css("background-color", "#DCDCDC");

            if (board[curheight][curwidth].attr("value") != 0) {
                board[curheight][curwidth].text(board[curheight][curwidth].val());
            } else {
               
                if (curwidth - 1 >= 0 && clicked[curheight][curwidth - 1] == 0) {
                    click(curheight, curwidth - 1);
                }
                if (curwidth + 1 < width && clicked[curheight][curwidth + 1] == 0) {
                    click(curheight, curwidth + 1);
                }
                if (curwidth - 1 >= 0 && curheight - 1 >= 0 && clicked[curheight - 1][curwidth - 1] == 0) {
                    click(curheight - 1, curwidth - 1);
                }
                if (curheight - 1 >= 0 && curwidth + 1 < width && clicked[curheight - 1][curwidth + 1] == 0) {
                    click(curheight - 1, curwidth + 1);
                }
                if (curheight + 1 < height && curwidth - 1 >= 0 && clicked[curheight + 1][curwidth - 1] == 0) {
                    click(curheight + 1, curwidth - 1);
                }
                if (curheight + 1 < height && curwidth + 1 < width && clicked[curheight + 1][curwidth + 1] == 0) {
                    click(curheight + 1, curwidth + 1);
                }
                if (curheight - 1 >= 0 && clicked[curheight - 1][curwidth] == 0) {
                    click(curheight - 1, curwidth);
                }
                if (curheight + 1 < height && clicked[curheight + 1][curwidth] == 0) {
                    click(curheight + 1, curwidth);
                }

            }
        }
    }

    function rank() {
        score.push(s);
        score.sort(function(a, b) {
            return a - b;
        });
        if (score.length < 5) {
            for (i = 1; i <= score.length; i++) {
                let felement = "#" + i * 10000 + " td";
                $(felement).text(i);
                $(felement).next().text(score[i - 1]);
            }
        } else {
            for (i = 1; i <= 5; i++) {
                let felement = "#" + i * 10000 + " td";
                $(felement).text(i);
                $(felement).next().text(score[i - 1]);
            }
        }

    }
});