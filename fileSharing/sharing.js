function getParam ()
{
    let url = window.location;
    let params = new URLSearchParams(url.search.slice(1));
    let obj = {};
    for(let pair of params.entries()) {
        obj[pair[0]] = pair[1]    //push keys/values to object
    }
    return obj
}
var url = getParam();
const key = atob(url.key);
var download_url;
const main = document.querySelector('.main')
firebase.database().ref(`sharing/${key}`).once('value').then(function (snapshot) {
    if(snapshot.exists()){
   document.querySelector('#title').innerText = snapshot.val().title;
   download_url = snapshot.val().download;
   document.querySelector('#download').href = download_url;
    const fname = snapshot.val().title;
    if(snapshot.key == "folder"){
 
    }else{
        var type = snapshot.val().title;
    if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') ||  type.includes('.jpeg') || type.includes('.gif')){
        main.innerHTML +=`<img src="${snapshot.val().download}" alt="not found">`
        
     }else if (type.includes('.zip')){
         main.innerHTML +=`<div class="card">
         <i class="fas fa-file-archive"></i>
         <h1>${fname}</h1>
     </div> `
         
     }else if (type.includes('.mp4')){
         var link = snapshot.val().download
        var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
        link2 = link2.replace(/\s/g, '')
        const vid_key = link2
        link2 =  `https://www.googleapis.com/drive/v3/files/${vid_key}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`
         main.innerHTML = `
         <video 
         id="my-video"
         class="video-js"
         controls
         preload="auto"
         width="640"
         height="264"
         poster="https://drive.google.com/thumbnail?id=${vid_key}"
         data-setup="{}"
         type="video/mp4"
         src="${link2}"
       >
         <p class="vjs-no-js">
           To view this video please enable JavaScript, and consider upgrading to a
           web browser that
           <a>supports HTML5 video</a
           >
         </p>
         </video>
         `
         console.log(document.getElementById('my-video'))

     }else{
      
        main.innerHTML +=`<div class="card">
        <i class="fas fa-file-archive"></i>
        <h1>${fname}</h1>
    </div> `
    }
    
}
}else{
    main.innerHTML +=`<div class="card">
    <i class="fas fa-file-archive"></i>
    <h1 style="color : red !important">File not Found </h1>
</div> ` 
document.querySelector('#download').disable = true
}
})
function goback(){window.location.replace("../index.html");}
