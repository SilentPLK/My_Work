//variables
var viewBoxVal = [0,0,1000,610]
var originalVal = [0,0,1000,610]
var dragScale = 1
var time = 0
var score = 0
//map logic
function updateViewBox(){
    let a = document.getElementById("latviaMap")
    a.setAttribute("viewBox", viewBoxVal[0] + " " + viewBoxVal[1] + " " + viewBoxVal[2] + " " + viewBoxVal[3])
}

//map zooming functions
function zoomOut(){
    viewBoxVal[2] *= 1.25
    viewBoxVal[3] *= 1.25
    dragScale *=1.25
    updateViewBox()
}
function zoomIn(){
    viewBoxVal[2] /= 1.25
    viewBoxVal[3] /= 1.25
    dragScale /= 1.25
    updateViewBox()
}
function zoomReset(){
    viewBoxVal[0] = originalVal[0]
    viewBoxVal[1] = originalVal[1]
    viewBoxVal[2] = originalVal[2]
    viewBoxVal[3] = originalVal[3]
    dragScale = 1
    updateViewBox()
}

//Makes the svg draggable
function makeDraggable(evt) {
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    var selectedElement = null
    var startX, startY
    function startDrag(evt) {
        selectedElement = evt.target
        startX = evt.clientX;
        startY = evt.clientY;
    }
    function drag(evt) {
        if(selectedElement){
            //gets distance between start of drag and end of drag and multiply it by scale modifier
            const dx = (evt.clientX - startX) * dragScale;
            const dy = (evt.clientY - startY) * dragScale;
            viewBoxVal[0] -= dx;
            viewBoxVal[1] -= dy;
            updateViewBox()
            // changes starting drag coordinates
            startX = evt.clientX;
            startY = evt.clientY;
        }
    }
    function endDrag(evt) {
        selectedElement = null
    }
}

//location logic

//get json array
fetch('./locations.json')
.then((response) => response.json())
.then((json) => {
    let arr = json;
    //randomizes the array
    arr.sort(()=> {return Math.random(0, 1) -0.5})
    locationSetUp(arr)
});



//sets up the location of the 1st 10 arrays in the arr, then also positions the circles
function locationSetUp(arr){
    for(let i = 0; i < 10; i++){
        document.getElementById("header-" + i).innerText = arr[i][0]
        document.getElementById("image-" + i).style.backgroundImage = "url(images/location/" + arr[i][1] + ")"
        let newCircle = document.getElementById("circle-" + i)
        newCircle.setAttribute("r", 8)
        newCircle.setAttribute("cx", arr[i][2])
        newCircle.setAttribute("cy", arr[i][3])
        newCircle.setAttribute("stroke-width", 0)
        newCircle.setAttribute("onclick", "locationFound(" + i + ")")
        newCircle.setAttribute("z-index", i+2)
        newCircle.setAttribute("fill", "rgba(0,0,0,0)")
    }
}


//runs when a circle is pressed and indicates the place has been found and removes it so it cant be clicked again
function locationFound(id){
    document.getElementById("header-" + id).style.opacity = "100%"
    document.getElementById("image-" + id).style.opacity = "100%"
    let circle = document.getElementById("circle-" + id)
    circle.setAttribute("onclick", "")
    circle.setAttribute("r", 12)
    circle.addEventListener("animationend",() => {circle.remove()})
    circle.classList.add("locationAnimate")
    score++
    points()
}

//point logic
function points(){
    document.getElementById("points").innerHTML = score + "/10"
}

//timer
function timer(){
    time++
    document.getElementById("timer").innerText = Math.floor(time/3600).toString().padStart(2, "0") +
     ":" +
      Math.floor((time%3600)/60).toString().padStart(2, "0") + 
     ":" +
      (time%60).toString().padStart(2, "0")
}
var timerFunc = setInterval(timer, 1000)

