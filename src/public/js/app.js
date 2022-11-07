const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        //console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label == camera.label){
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        })
    }catch(e){
        console.log(e)
    }
}


//Welcom Form (join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

call.hidden = true;

function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}


function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

/*
async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true,
        });
        //console.log(myStream);
        myFace.srcObject = myStream;
        await getCameras();
    }catch(e){
        console.log(e)
    }
}
*/

async function getMedia(deviceId){
    const initalConstraints = {
        audio : true,
        video : {facingMode : "user"}
    };
    const cameraConstraints = {
        audio : true,
        video : {deviceId : {exact : deviceId}}
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initalConstraints);
        myFace.srcObject =  myStream;
        if(!deviceId){
            await getCameras();
        }
    }catch(e){
        console.log(e)
    }
}




//getMedia();

function handelMuteClick(){
   //console.log(myStream.getAudioTracks());
   myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
   if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick(){
   //console.log(myStream.getVideoTracks());
   myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
   if(!cameraOff){
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }else{
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }
}

async function handleCameraChange(){
  //  console.log(cameraSelect.value);
  await getMedia(cameraSelect.value);
}


muteBtn.addEventListener("click", handelMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);