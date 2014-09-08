//Присваиваем каждой фигуре свой код
var WHITE_KING = 100;
var WHITE_QUEEN = 90;
var WHITE_ROOK = 50;
var WHITE_BISHOP = 31;
var WHITE_KNIGHT = 30;
var WHITE_PAWN = 10;
//Для черных
var BLACK_KING = -WHITE_KING;
var BLACK_QUEEN = -WHITE_QUEEN;
var BLACK_ROOK = -WHITE_ROOK;
var BLACK_BISHOP = -WHITE_BISHOP;
var BLACK_KNIGHT = -WHITE_KNIGHT;
var BLACK_PAWN = -WHITE_PAWN;

//Расставляем фигурки
var board = [
    [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK],
    [0, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,BLACK_PAWN,0,0],
    [0,0,0,0,0,0,0,0],
    [WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN],
    [WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK]
];

//Возвращаем названия фигур CSS
function getPieceName(pieceValue){
    switch (pieceValue) {
        case WHITE_KING:
            return 'WHITE_KING';
            break;
        case WHITE_QUEEN:
            return 'WHITE_QUEEN';
            break;
        case WHITE_ROOK:
            return 'WHITE_ROOK';
            break;
        case WHITE_BISHOP:
            return 'WHITE_BISHOP';
            break;
        case WHITE_KNIGHT:
            return 'WHITE_KNIGHT';
            break;
        case WHITE_PAWN:
            return 'WHITE_PAWN';
            break;

        case BLACK_KING:
            return 'BLACK_KING';
            break;
        case BLACK_QUEEN:
            return 'BLACK_QUEEN';
            break;
        case BLACK_ROOK:
            return 'BLACK_ROOK';
            break;
        case BLACK_BISHOP:
            return 'BLACK_BISHOP';
            break;
        case BLACK_KNIGHT:
            return 'BLACK_KNIGHT';
            break;
        case BLACK_PAWN:
            return 'BLACK_PAWN';
            break;

        default:
            return 'EMPTY';
            break;
    }
}



$(function() {

    drawBoard(board);

    var selectedPiece = null

    $("#board").on("click", ".row .column > div", function(e) { //клик на ячейке

        if ($(this).hasClass("FREE")) { //если она подсвечена (кликнули на фигуре до этого)

            var rowColumn = getPieceCords(this)
            movePieceTo(selectedPiece, rowColumn[0], rowColumn[1]) //то двигаем ту фигуру в эту ячейу и стираем подсветку
            cleanUp() 
        }

        else {
        	var column = $(this).parent() //если кликнули на жертве
        	if ($(column).hasClass("RED"))  {//класс RED добавлен к родителю чтобы он не загораживал саму фигуру
        		var victimIJ = getPieceCords(this)
        		eatVictim(selectedPiece, victimIJ[0], victimIJ[1])
        		//selectedPiece = null
        		cleanUp()
        	}
        	else if (! $(this).hasClass("EMPTY")) { //если кликнули НЕ по пустой ячейке

	                cleanUp() //стереть подсветку (она присутствует в случе, если до этого кликнули по фигурке)

	                if(selectedPiece == this) { //если нажали на пешку, на которую нажимали в прошлый раз          
	                    selectedPiece = null          
	                }
	                else { //если нажали на новую фигурку -- подсветить возможные ходы

	                    selectedPiece = this

	                    var rowColumn = getPieceCords(this), //получить координаты этой фигуры
	                        row =rowColumn[0],
	                        column = rowColumn[1];

	                    
	                    if (showPathMap[board[row][column]]) { //если функция подсветки для данной фигурки уже есть (ПО ИДЕЕ ДОЛЖНЫ БЫТЬ ДЛЯ ВСЕХ)    
	                        showPathMap[board[row][column]](row, column) //подсветить ее путь
	                    }
	                    else { //иначе -- сказать, что нужно добавить ее!
	                        console.log("Добавьте функцию подсветки для фигуры "+getPieceName(board[row][column]))
	                    }
	                }
	            }
	            else { //иначе -- стереть подсветку в любом случае
	                cleanUp()   
	            }
        }
        
    })
})

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

function drawBoard(board) { //рисует доску, ставит фигурки
    var str = '';
    for( var i = 0 ; i < 8 ; i++ ){
        str += '<div class="row">';
        for( var j = 0 ; j < 8 ; j++ ){
            str += '<div class="column ' +
                ( (i + j) % 2 === 0 ? 'light': 'dark') + '">' +
                '<div class="' + getPieceName(board[i][j]) + '"></div>' +
                '</div>';
        }
        str += '</div>';
    }
    $('#board').append(str);
}

function getColumn(i, j) {
	var row = $(".row").get(i);
    return $(row).find(".column").get(j);
}

function getCell(i, j) { //получить html клетки на основе ее координат в матрице

    var cell = $(getColumn(i, j)).children();    
    return cell
}


function markFree(i, j) { //подсветить ячейку зеленым (свободная)
    console.log("adding FREE to "+i+" "+j);
    $(getCell(i, j)).addClass("FREE");
}

function eraseFree() { //убрать зеленую подсветку со всех клеток
    var cells = $(".row .column").children();
    $(cells).each(function(){
       $(this).removeClass("FREE");
    })
}

function markTaken(i, j) {
    //$(getCell(i, j)).addClass("TAKEN")
}

function getPieceCords(piece) { //получить координаты ячейки в матрице по ее html. Возвращает [строка, столбец]
    var column = $(piece).parent();
    var row = $(column).parent();
    var columnIndex = $(row).children().index(column);
    var rowIndex = $(".row").index(row);
    return [rowIndex, columnIndex]
}

function inBounds(i, j) { //валидны ли координаты. находятся ли они на доске
    return (i >= 0 && j>=0 && i<=7 && j<=7)
}

function isCellEmpty(i, j) { //пустая ли клетка
    return board[i][j] == 0
}

function emptyCell(i, j) {
	var cell = getCell(i, j),
        cellClass = $(cell).attr("class");
	 
	$(cell).removeClass(cellClass).addClass("EMPTY"); //empty the old cell
	board[i][j] = 0
}

function isEnemy(i, j) {
	return containsObject(board[i][j], [BLACK_QUEEN, BLACK_BISHOP, BLACK_PAWN, BLACK_KNIGHT, BLACK_ROOK, BLACK_KING])
}

function eatVictim(winnimgPiece, victimI, victimJ) {
	
	emptyCell(victimI, victimJ) //remove the victim
	//INCREASE SCORE COUNTER HERE
	movePieceTo(winnimgPiece, victimI, victimJ) 
}

function markVictim(i, j) {
	$(getColumn(i, j)).addClass("RED")
}

function eraseAllVictims() {
	$("#board .RED").each(function() {
		$(this).removeClass("RED")
	})
}

function cleanUp() {
	eraseFree()
	eraseAllVictims()
}

function movePieceTo(piece, i, j) { //передвинуть фигуру piece в координаты i, j
    if (isCellEmpty(i, j) && inBounds(i, j)) {        
        var rowColumn = getPieceCords(piece),
            row = rowColumn[0],
            column = rowColumn[1],
            cell = getCell(i, j),
            pieceClass = $(piece).attr("class");

        board[i][j] = board[row][column];

        emptyCell(row, column) //remove the piece from the current cell

        $(cell).removeClass("EMPTY").addClass(pieceClass); //place the piece to the new cell
    }
    else {
        console.log("Invalid piece coords!");
    }
}

function showPathPawn(i, j) { //подсветить путь для пешки
    if (i===6) {
        var row = i-1,
        column = j;
    
	    while (inBounds(row, column) && row >= i-2) { //подсветим путь вперед
	        if (isCellEmpty(row, column)) {           
	            markFree(row, column);
	             row--;
	        }
	        else break;
	    }
    } else {
        if (inBounds(i-1, j)) {
        	if (isCellEmpty(i-1, j)) {markFree(i-1, j);}
    	}
    	if(inBounds(i-1, j-1) && isEnemy(i-1, j-1)) {
	        markVictim(i-1, j-1)
        }
        if(inBounds(i-1, j+1) && isEnemy(i-1, j+1)) {
        	markVictim(i-1, j+1)
        }	
    }
}

function showPathRook(i, j) { //подсветить путь для ладьи
    var row = i-1,
        column = j;
    
    while (inBounds(row, column) && row >= 0) { //подсветим путь вперед
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            row--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break;
        	}
        	else break;
        }      
    }

    row = i + 1;
    while (inBounds(row, column) && row <= 7) { //подсветим путь назад
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            row++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break;
        	}
        	else break;
        }
       
    }

    row = i;
    column = j-1;
    while (inBounds(row, column) && column >= 0) { //подсветим путь влево
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            column--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break;
        	}
        	else break;
        }    
    }

    column = j+1;
    while (inBounds(row, column) && column <= 7) { //подсветим путь вправо
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            column++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break;
        	}
        	else break;
        }
       
    }    
}
function showPathKnight (i, j) { //Подсветить ход коня
    if (inBounds(i-2, j-1)) {
        if (isCellEmpty(i-2, j-1)) {markFree(i-2, j-1);}
        else if(isEnemy(i-2, j-1)) {markVictim(i-2, j-1);}
    }

    if (inBounds(i-1, j-2)) {
        if (isCellEmpty(i-1, j-2)) {markFree(i-1, j-2);}
        else if(isEnemy(i-1, j-2)) {markVictim(i-1, j-2);}
    }
    if (inBounds(i-2, j+1)) {
        if (isCellEmpty(i-2, j+1)) {markFree(i-2, j+1);}
        else if(isEnemy(i-2, j+1)) {markVictim(i-2, j+1);}
    }

    if (inBounds(i-1, j+2)) {
        if (isCellEmpty(i-1, j+2)) {markFree(i-1, j+2);}
        else if(isEnemy(i-1, j+2)) {markVictim(i-1, j+2);}
    }
    if (inBounds(i+2, j-1)) {
        if (isCellEmpty(i+2, j-1)) {markFree(i+2, j-1);}
        else if(isEnemy(i+2, j-1)) {markVictim(i+2, j-1);}
    }

    if (inBounds(i+1, j-2)) {
        if (isCellEmpty(i+1, j-2)) {markFree(i+1, j-2);}
        else if(isEnemy(i+1, j-2)) {markVictim(i+1, j-2);}
    }
    if (inBounds(i+2, j+1)) {
        if (isCellEmpty(i+2, j+1)) {markFree(i+2, j+1);}
        else if(isEnemy(i+2, j+1)) {markVictim(i+2, j+1);}
    }

    if (inBounds(i+1, j+2)) {
        if (isCellEmpty(i+1, j+2)) {markFree(i+1, j+2);}
        else if(isEnemy(i+1, j+2)) {markVictim(i+1, j+2);}
    }
}

function showPathBishop(i, j) { // Подсветить ход слона
    var row = i-1,
        column = j-1;

    while (inBounds(row, column) && row >= 0) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row--;
             column--;
        } else {
        	if(isEnemy(row, column)) {
        		markVictim(row, column);
        		break;
        	}
        	else break;
        }        
    }

    row = i-1;
    column = j+1;

    while (inBounds(row, column) && row >= 0) { //подсветка вправо и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row--;
             column++;
        } else {
        	if(isEnemy(row, column)) {
        		markVictim(row, column);
        		break;
        	}
        	else break;
        }        
    }

    row = i+1;
    column = j-1;

        while (inBounds(row, column) && row <= 7) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row++;
             column--;
        } else {
        	if(isEnemy(row, column)) {
        		markVictim(row, column);
        		break;
        	}
        	else break;
        }        
    }

    row = i+1;
    column =j+1;

        while (inBounds(row, column) && row <= 7) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row++;
             column++;
        } else {
        	if(isEnemy(row, column)) {
        		markVictim(row, column);
        		break;
        	}
        	else break;
        }         
    }
}

function showPathQueen (i, j) { //Подсветка королевы
    var row = i-1,
        column = j-1;

    while (inBounds(row, column) && row >= 0) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row--;
             column--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }        
    }

    row = i-1;
    column = j+1;

    while (inBounds(row, column) && row >= 0) { //подсветка вправо и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row--;
             column++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    row = i+1;
    column = j-1;

        while (inBounds(row, column) && row <= 7) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row++;
             column--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    row = i+1;
    column =j+1;

        while (inBounds(row, column) && row <= 7) { //подсветка влево и вверх
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row++;
             column++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    row = i-1,
        column = j;
    
    while (inBounds(row, column) && row >= 0) { //подсветим путь вперед
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
             row--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    row = i + 1;
    while (inBounds(row, column) && row <= 7) { //подсветим путь назад
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            row++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    row = i;
    column = j-1;
    while (inBounds(row, column) && column >= 0) { //подсветим путь влево
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            column--;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }

    column = j+1;
    while (inBounds(row, column) && column <= 7) { //подсветим путь вправо
        if (isCellEmpty(row, column)) {           
            markFree(row, column);
            column++;
        } else {
        	if (isEnemy(row, column)) {
        		markVictim(row, column)
        		break
        	} 
        	else break;
        }   
    }    
}

function showPathKing (i, j){
    if (inBounds(i-1, j)) {
        if (isCellEmpty(i-1, j)) {markFree(i-1, j);}
        else if(isEnemy(i-1, j)) {markVictim(i-1, j);}
    }

    if (inBounds(i+1, j)) {
        if (isCellEmpty(i+1, j)) {markFree(i+1, j);}
        else if(isEnemy(i+1, j)) {markVictim(i+1, j);}

    }
    if (inBounds(i, j+1)) {
        if (isCellEmpty(i, j+1)) {markFree(i, j+1);}
        else if(isEnemy(i, j+1)) {markVictim(i, j+1);}
    }

    if (inBounds(i, j-1)) {
        if (isCellEmpty(i, j-1)) {markFree(i, j-1);}
        else if(isEnemy(i, j-1)) {markVictim(i, j-1);}
    }
    if (inBounds(i-1, j-1)) {
        if (isCellEmpty(i-1, j-1)) {markFree(i-1, j-1);}
        else if(isEnemy(i-1, j-1)) {markVictim(i-1, j-1);}
    }

    if (inBounds(i+1, j+1)) {
        if (isCellEmpty(i+1, j+1)) {markFree(i+1, j+1);}
        else if(isEnemy(i+1, j+1)) {markVictim(i+1, j+1);}
    }
    if (inBounds(i+1, j+1)) {
        if (isCellEmpty(i+1, j+1)) {markFree(i+1, j+1);}
        else if(isEnemy(i+1, j+1)) {markVictim(i+1, j+1);}
    }

    if (inBounds(i+1, j+1)) {
        if (isCellEmpty(i+1, j+1)) {markFree(i+1, j+1);}
        else if(isEnemy(i+1, j+1)) {markVictim(i+1, j+1);}
    }
}

var showPathMap = []; // для удобного доступа к функциям подсветки пути для разных фигур
                     // не нужно подписываться на клик каждого типа фигурки в отдельности -- 
                     // при клике на любую фигурку просто определяем ее тип (см.  $("#board").on("click", ".row .column > div"...)
showPathMap[WHITE_PAWN] = showPathPawn;
showPathMap[WHITE_ROOK] = showPathRook;
showPathMap[WHITE_KNIGHT] = showPathKnight;
showPathMap[WHITE_BISHOP] = showPathBishop;
showPathMap[WHITE_QUEEN] = showPathQueen;
showPathMap[WHITE_KING] = showPathKing;