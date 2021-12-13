const dropArea = document.querySelector(".drag-area"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input"),
LoadingModal = document.querySelector('.Loading-Modal'),
videoBox = document.querySelector('.video-box');
var gif_url='' , files ,title , des , type , emp=false , vid_duration;



  function rand(n){
    return Math.floor(Math.random() * n)
}
function get($){
    return document.querySelector($);
}
function getvalue($){
    return document.querySelector($).value;
}



form.addEventListener('submit', e => {
e.preventDefault();
});
button.onclick = ()=>{
input.click(); //if user click on the button then the input also clicked
}
var drive_accessToken ;
function getAccessToken(){
  const id = 'AKfycbz19inbya5CcwM48qEXSQk4VssWSQNCcvcrmUBIk6QVgGsUoOBi2t9Cjn7Cy_6UnrW9'
  const url = `https://script.google.com/macros/s/${id}/exec`; 
  const qs = new URLSearchParams({filename: 'xx', mimeType: 'xxx'});
  fetch(`${url}?${qs}`, {
method: "POST",
body: '' })
  .then(res => res.json())
  .then(e => {
    drive_accessToken = e.token;
  })
  .catch(err =>{
      console.error("Failed To get AccessToken ReTrying \n",[err])
      getAccessToken()
  
  })
}




getAccessToken();
// Please set access token here.
const accessToken = drive_accessToken;
console.group();
function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      console.log(e.target.result);
      LoadingModal.style.display = "grid"
      uploadThumbnailGif(e.target.result)
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

input.addEventListener("change", readFile);




//Uploading Gif Thumbnail
function uploadThumbnailGif(file){
    const id = 'AKfycbwAPEcOZTFUc1rNtys3khhJfBBftZP0FuR3Vxqa6BsAPFjtUkWIjrdZI-15aCcRIAS2'
    const url = `https://script.google.com/macros/s/${id}/exec`; 
    console.log('uploading Thumbnail Gif')
    const qs = new URLSearchParams({filename:`img${rand(100)+rand(789)}`, mimeType: 'image/gif'});
    fetch(`${url}?${qs}`, {
  method: "POST",
  body: JSON.stringify(file.substr(file.indexOf('base64,')+7))})
    .then(res => res.json())
    .then(e => {
      console.log('Gif Uploaded')
document.querySelector('.Loading-Modal h3').innerText = 'Video Gif preview uploaded successfully...'
      gif_url = `https://drive.google.com/uc?export=download&id=${e.fileId}`
      try{
        setTimeout(function () {
          window.ReactNativeWebView.postMessage(`${gif_url}`)
        }, 2000)
      }catch(err){
        alert("File Url : "  + gif_url  , "\n Error Occured : "+err)
      }

      LoadingModal.style.display = "none"
      console.log(gif_url)
      return gif_url;
    })
    .catch(err =>{
        LoadingModal.style.display = "none"
         console.error(" Upload Err : \n"+err)
         alert('Uploading Error \n ' + JSON.stringify(err))
         return err;
    })
  }


