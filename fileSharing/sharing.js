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
console.log(url)
const key = atob(url.key)
const uid = atob(url.uid)
const folder = url.folder
var download_url ;
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
         main.innerHTML += `<video src="${snapshot.val().file}" controls muted></video>`      
     }else{
      
        main.innerHTML +=`<div class="card">
        <i class="fas fa-file-archive"></i>
        <h1>${fname}</h1>
    </div> `
    }
}
})

function goback(){
    console.log(window.location)
}
