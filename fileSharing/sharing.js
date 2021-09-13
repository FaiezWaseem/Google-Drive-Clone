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
const uid = atob(url.uid);
const folder = url.folder;
var download_url;
const main = document.querySelector('.main')
firebase.database().ref('drive/'+uid+"/"+folder+'/'+key).once('value').then(function (snapshot) {
   document.querySelector('#title').innerText = snapshot.val().filename;
   download_url = snapshot.val().file;
   document.querySelector('#download').href = download_url;
    const fname = snapshot.val().filename;
    if(snapshot.key == "folder"){
 
    }else{
        var type = snapshot.val().filename;
    if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') || type.includes('.gif')){
        main.innerHTML +=`<img src="${snapshot.val().file}" alt="not found">`
        
     }else if (type.includes('.zip')){
         main.innerHTML +=`<div class="card">
         <i class="fas fa-file-archive"></i>
         <h1>${fname}</h1>
     </div> `
         
     }else if (type.includes('.mp4')){
         var link = snapshot.val().file
        var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
        link2 = link2.replace(/\s/g, '')
        const vid_key = link2
        link2 = `https://drive.google.com/thumbnail?id=`+link2;
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
})
function goback(){window.location.replace("../index.html");}
