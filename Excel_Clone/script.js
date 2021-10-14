//adding perfect scrollbar
const ps = new PerfectScrollbar('#cells',{
    wheelSpeed: 15,
    //wheelPropagation: true,
});
// Logic for finding the alphabet for the column 
// 1 = A
// 2 = B 
// 3 = C 
// .
// .
// . 
// 26 = Z
// 27 = AA 
// . 
// . 
// 52 = AZ 
// 53 = BA 

for (let i = 1; i <= 100; i++) { // abhi 100 column k liye chala rahe hai
    let str = "";
    let n = i;

    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = "Z" + str;
            n = Math.floor(n / 26) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor(n / 26);
        }
    }
    //index.html ka column ke upar append karni hai 
    $("#columns").append(`<div class="column-name">${str}</div>`)
    //columns added successfully 
    //--------------------------
    //Now adding row number
    $("#rows").append(`<div class="row-name">${i}</div>`)
    //successfully added row number 
    //----------------------------
}

// Loops for addings cells in the container ==>
//---------------------------------------------

//(here i is the row number and j is the column)
for(let i = 1; i <= 100; i++){
    let row = $('<div class = "cell-row"></div>') //appending row
    for(let j = 1; j <= 100; j++){
        row.append(`<div id = "row-${i}-col-${j}" class="input-cell" contenteditable = "false"></div>`) //jab double click ho tab editable ho
    }
    $("#cells").append(row); 
}


//scroll bar ke saath saath row and column ke value i.e A,B,C,D,........ and 1,2,3,4....... move karne ke liye
$("#cells").scroll(function(e){
    //jitna scroll cells karega utna hi scroll column kare
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
})

//double click pe content editable true kara hai and focus pe laya hai 
$(".input-cell").dblclick(function(e){
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    //$(this).addClass("selected");
    $(this).attr("contenteditable","true");
    $(this).focus();
})

//jab particular cell se work khatam hojaye toh content editable false kardena hai 
$(".input-cell").blur(function(e){
    $(this).attr("contenteditable","false");
})

//to select multiple column 
function getRowCol(ele){
    let id = $(ele).attr("id"); // while making cell , given an id as id row-rownum col-colnum(get the id of that element)
    let idArray = id.split("-"); //convert id into array
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId,colId]; //isko return kardiya 

}

//getting top,left,bottom,right cell
function getTopLeftBottomRightCell(rowId,colId){
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell,bottomCell,leftCell,rightCell]; 
}


//input cell ke single click par usko select karna hai. (Bit hard logic)
$(".input-cell").click(function(e){
    // $(".input-cell.selected").removeClass("selected"); //ek hi time par ek hi cell select karne ke liye 
    // $(this).addClass("selected"); // this code push to below logic
    let [rowId,colId] = getRowCol(this); // yaha receive kiya & this is current element 
    let [topCell,bottomCell,leftCell,rightCell] = getTopLeftBottomRightCell(rowId,colId);
    if ($(this).hasClass("selected") && e.ctrlKey) {
        unselectCell(this, e, topCell, bottomCell, leftCell, rightCell); //unselect a particular cell after selecting multiple cell
    } else {
        selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }
})

//e = event  ele = input cell i.e element 
//unselect function 
function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if ($(ele).attr("contenteditable") == "false") { //agar content editable false hai to hi unselection wala kaam karna hai warna nehi karna 
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }

        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }

        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");
        }

        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }

        $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected");
    }

}



function selectCell(ele,e,topCell,bottomCell,leftCell,rightCell){
    if(e.ctrlKey){
        //top cell selected or not
        let topSelected;
        console.log(topCell);
        if(topCell){
            topSelected = topCell.hasClass("selected"); //agar topCell selected hai toh us ke paas selected class pakka hogi
        }
        //bottom cell selected or not
        let bottomSelected;
        if(bottomCell){
            bottomSelected = bottomCell.hasClass("selected");
        }
         //left cell selected or not
        let leftSelected;
        if(leftCell){
            leftSelected = leftCell.hasClass("selected");
        }
         //right cell selected or not
        let rightSelected;
        if(rightCell){
            rightSelected = rightCell.hasClass("selected");
        }

        if(topSelected){
            $(ele).addClass("top-selected");
            topCell.addClass("bottom-selected");
        }
       
        if(bottomSelected){
            $(ele).addClass("bottom-selected");
            bottomCell.addClass("top-selected");
        }

        if(leftSelected){
            $(ele).addClass("left-selected");
            leftCell.addClass("right-selected");
        }

        if(rightSelected){
            $(ele).addClass("right-selected");
            rightCell.addClass("left-selected");
        }

    }else{
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    }
    $(ele).addClass("selected");
}

