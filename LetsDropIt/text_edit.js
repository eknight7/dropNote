var topLeftX = 0;
var topLeftY = 50;
var mouseYoffset = 30;
var cursorX = 0;
var cursorY = 0;
var basefont = "20px Courier";
var font = basefont;
var boldfont = "bold " + basefont;
var italicfont = "italic " + basefont;
var bolditalicfont = "bold italic " + basefont;
var charHeight = 25;
var charWidth = 0;
var canvas;
var ctx;
var cursorToggle = true;
var mode = "N";
glNoteId = parseInt(window.name);
unpackData(getNoteContents(glNoteId));
var lineA;
var specialA;
function exportFile() {
	var saveContent = lineA.join("\n");
	var saveContent2 = specialA.join("\n");
	var finalString = (saveContent.length).toString()+"\n"+saveContent+"\n"+saveContent2;
	var exportContent = "data:application/octet-stream," + encodeURIComponent(finalString);
	newWindow=window.open(exportContent, 'Exported file');
}
function saveToDropBox() {
	var saveContent = lineA.join("\n");
	var saveContent2 = specialA.join("\n");
	var finalString = (saveContent.length).toString()+"\n"+saveContent+"\n"+saveContent2;
	//Saving code of finalString goes here!
}
function unpackData(data) {
	textlength = parseInt(data);
	lengthtextlength = textlength.toString().length+1;
	lineA = data.substring(lengthtextlength,lengthtextlength+textlength).match(/[^\r\n]+/g);
	//console.log(lineA);
	specialA = data.substring(lengthtextlength+textlength).match(/[^\r\n]+/g);
	//console.log(specialA);
}
function initCharWidth () {
	ctx.font = font;
	charWidth = ctx.measureText("M").width;
}
function getNoteContents(noteId) {
	var saveContent = "TestNoteContents\nBuggy buggy!! I'm a Bug!\nI'm a butterfly!\nI'm a ladybird!\nP\n \n \n \nP\n \n \n \nI'm all around your code and computer!!";
	saveContentSplit = saveContent.match(/[^\r\n]+/g);
	saveContent2Split = new Array();
	
	for (i = 0; i < saveContentSplit.length; i++) {
		if (saveContentSplit[i][0] == "P") {
			saveContent2Split[i] = "P100150test1.png";
		}
		else {
			saveContent2Split[i] = Array(saveContentSplit[i].length+1).join("N");
		}
	}
	saveContent2 = saveContent2Split.join("\n");
	var finalString = (saveContent.length).toString()+"\n"+saveContent+"\n"+saveContent2;
	return finalString;
}
function mouseDownHandler(event) {
	clearCursor();
	mouseX = event.pageX;
	mouseY = event.pageY - mouseYoffset;
	cursorX = Math.round((mouseX-topLeftX)/charWidth);
	cursorY = Math.round((mouseY-topLeftY)/charHeight);
	fixCursor();
	drawCursor();
}
function initListen() {
	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext('2d');
	window.addEventListener('resize', resizeCanvas, false);
	canvas.addEventListener("mousedown", mouseDownHandler, false);
	resizeCanvas();
	initCharWidth();
	window.setInterval("drawCursor();",1000);
};
function resizeCanvas() {
	//var canvas = document.getElementById("canvas1");
	newwidth = window.innerWidth*0.6 - topLeftX;
	newheight = window.innerHeight*0.6 - topLeftY;
	if (newwidth > canvas.width) {
		canvas.width = newwidth;
	}
	if (newheight > canvas.height) {
		canvas.height = newheight;
	}
	writeCanvas();
}
function fixCursor() {
	if (cursorY > lineA.length-1) {
		cursorY = lineA.length-1;
	}
	if (cursorY < 0) {
		cursorY = 0;
	}
	if (cursorX > lineA[cursorY].length) {
		cursorX = lineA[cursorY].length;
	}
	if (cursorX < 0) {
		cursorX = 0;
	}
}
function helperImage(imagename,currX,currY) {
	var imageObj = new Image();
	imageObj.onload = function() {
		ctx.drawImage(imageObj,currX,currY);
	}
	imageObj.src = imagename;
}
function writeCanvas() {
	initCharWidth();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.font = font;
	var currX = topLeftX;
	var currY = topLeftY;
	for (i = 0; i < lineA.length; i++) {
		var line = lineA[i];
		if (specialA[i][0] == "P") {
			var height = parseInt(specialA[i].substring(1,4));
			var width = parseInt(specialA[i].substring(4,7));
			var imagename = specialA[i].substring(7);
			nextlines = Math.ceil(height/charHeight);
			helperImage(imagename,currX,currY-charHeight);
			i += (nextlines-1);
			currY += (nextlines-1)*charHeight;
		}
		else {
			var width = ctx.measureText(line).width + topLeftX;
			if (width > canvas.width) {
				canvas.width = width;
			}
			for (j = 0; j < line.length; j++) {
				if (specialA[i][j] == "N") {
					ctx.font = basefont;
				}
				else if (specialA[i][j] == "B"){
					ctx.font = boldfont;
				}
				else if (specialA[i][j] == "I"){
					ctx.font = italicfont;
				}
				else if (specialA[i][j] == "C"){
					ctx.font = bolditalicfont;
				}
				//console.log(specialA[i][j]);
				ctx.fillText(lineA[i][j],currX,currY);
				currX += charWidth;
			}
		}
		currX = topLeftX;
		currY += charHeight;
	}
	drawCursor();
}

function clearCursor() {
	var origfill = ctx.fillStyle;
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText("_",topLeftX + cursorX*charWidth,topLeftY + cursorY*charHeight-1);
	ctx.fillText("_",topLeftX + cursorX*charWidth,topLeftY + cursorY*charHeight+1);
	ctx.fillText("_",topLeftX + cursorX*charWidth-1,topLeftY + cursorY*charHeight);
	ctx.fillText("_",topLeftX + cursorX*charWidth+1,topLeftY + cursorY*charHeight);
	ctx.fillText("_",topLeftX + cursorX*charWidth,topLeftY + cursorY*charHeight);
	ctx.fillStyle = origfill;
	cursorToggle = true;
}

function drawCursor() {
	if (cursorToggle) {
		ctx.fillText("_",topLeftX + cursorX*charWidth,topLeftY + cursorY*charHeight);
		cursorToggle = false;
	}
	else {
		clearCursor();
	}
};
document.onkeydown = function(evt) {
    evt = evt || window.event;
    //console.log(evt.ctrlKey + " " + evt.keyCode);
    if (evt.ctrlKey == false) {
    	clearCursor();
    	switch(evt.keyCode) {
    		case 38:
    			if (cursorY == 0) {
    				cursorY = 0;
    			}
    			else {
    				cursorY -= 1;
    			}
    			evt.preventDefault();
    			break;
    		case 37:
    			if (cursorX == 0) {
    				if (cursorY == 0) {
    					// do nothing
    				}
    				else {
    					cursorY-= 1;
    					cursorX = lineA[cursorY].length;
    				}
    			}
    			else {
    				cursorX -= 1;
    			}
    			evt.preventDefault();
    			break;
    		case 40:
    			if (cursorY == lineA.length) {
    				// do nothing
    			}
    			else {
    				cursorY += 1;
    			}
    			evt.preventDefault();
    			break;
    		case 39:
    			if (cursorX == lineA[cursorY].length) {
    				if (cursorY == lineA.length) {
    					// Do nothing
    				}
    				else {
    					cursorY++;
    					cursorX = 0;
    				}
    			}
    			else {
    				cursorX += 1;
    			}
    			evt.preventDefault();
    			break;
    		case 8: // Backspace
    			if (cursorX == 0) {
    				if (cursorY == 0) {
    					//Do nothing
    				}
    				else {
    					cursorY--;
    					cursorX = lineA[cursorY].length;
    					lineA[cursorY] = lineA[cursorY] + lineA[cursorY+1];
    					lineA.splice(cursorY+1,1);

    				}
    			}
    			else {
				lineA[cursorY] = lineA[cursorY].substring(0,cursorX-1) + lineA[cursorY].substring(cursorX);
				specialA[cursorY] = specialA[cursorY].substring(0,cursorX-1) + specialA[cursorY].substring(cursorX);
				cursorX--;
				}
				evt.preventDefault();
				writeCanvas();
				break;
			case 13: //Enter
				newline = lineA[cursorY].substring(cursorX);
				newspecialline = specialA[cursorY].substring(cursorX);
				lineA[cursorY] = lineA[cursorY].substring(0,cursorX);
				specialA[cursorY] = specialA[cursorY].substring(0,cursorX);
				lineA.splice(cursorY+1,0,newline);
				specialA.splice(cursorY+1,0,newspecialline);
				cursorY += 1;
				cursorX = 0;
				evt.preventDefault();
				break;
			case 36: //Home
				cursorX = 0;
				evt.preventDefault();
				break;
			case 35: //End
				cursorX = lineA[cursorY].length;
				evt.preventDefault();
				break;
    		default:

    	}
    }
   fixCursor();
   drawCursor();
   writeCanvas();
};
document.onkeypress = function(evt) {
    evt = evt || window.event;
    //console.log("keyPress:" + evt.which + " " + evt.keyCode);
    if (evt.ctrlKey == false) {
    	clearCursor();
    	switch(evt.which) {
    		case 13:
    			break;
    		case 0:
    			break;
    		default:
				var character = String.fromCharCode(evt.which);
				line = lineA[cursorY];
				lineA[cursorY] = line.substring(0,cursorX) + character + line.substring(cursorX);
				specialA[cursorY] = specialA[cursorY].substring(0,cursorX) + mode + specialA[cursorY].substring(cursorX);
				//console.log(specialA[cursorY]);
				cursorX += 1;
				writeCanvas();
				if (evt.which == 32) {
					evt.preventDefault();
				}
    	}
    }
};

var boldflag = false;
var italicflag = false;
function boldToggle() {
	if (boldflag) {
		boldflag = false;
	}
	else {
		boldflag = true;
	}
	updateMode();
}

function italicToggle() {
	if (italicflag) {
		italicflag = false;
	}
	else {
		italicflag = true;
	}
	updateMode();
}
function updateMode() {
	if (boldflag && italicflag) {
		mode = "C";
	}
	else if (boldflag) {
		mode = "B";
	}
	else if (italicflag) {
		mode = "I";
	}
	else {
		mode = "N";
	}
	//console.log(mode);
}