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
function img(download)
{
    return `
    <img src="${download}" alt="not found">
    `
}
function zip(fname){
    return `<div class="card">
    <i class="fas fa-file-archive"></i>
    <h1>${fname}</h1>
</div> `
}
function video (vid_key , link2){
  return  `
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
}
function nofile(){
    return `<div class="card">
    <i class="fas fa-file-archive"></i>
    <h1 style="color : red !important">File not Found </h1>
</div> ` 
}
function picture(size , date , key , title ,link , share ){
    var link2 = link.replace('https://drive.google.com/thumbnail?id=', "")
     link2 = link2.replace(/\s/g, '')
     link2 = 'https://drive.google.com/uc?export=download&id='+ link2
    return ` <div   date="${date}" size="${size}" share=${share} class="card mr-4 ${key}" id="${key}" key="${key}" link="${btoa(link)}" title="${title}" style="width: 28%" onclick="dropDown(this)">
    <img class="card-img-top" src="${link}" loading="lazy" alt="Couldnt load">
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"><i class="fas fa-image mr-4"></i>${title}</h5>  
    <a href="${link2}" class="btn btn-primary mt-2">Download</a>                
    </div>
</div>`
}
function filezip(size , date , key , title ,link , share ){
    return `<div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width:28%; height: auto" id="${key}" title="${title}" key="${key}" link="${btoa(link)}"  onclick="dropDown(this)">
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"> <i class="fas fa-file-archive mr-4"></i></i>${title}</h5> 
    <a href="${link}" class="btn btn-primary mt-2">Download</a>                          
    </div>`
}
function filevideo(size , date , key , title ,link , share){
    var link2 = link.replace('https://drive.google.com/thumbnail?id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = 'https://drive.google.com/uc?export=download&id='+ link2
    return `
    <div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width: 28%; height: auto" id="${key}" title="${title}" key="${key}" link="${btoa(link)}" onclick="dropDown(this)" >
    <video class="card-img-top" poster="${link}" src="${link2}" controls></video>
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"><i class="fas fa-image mr-4"></i>${title}</h5>   
    <a href="${link2}" class="btn btn-primary mt-2">Download</a>                              
    </div>
    `
}
const extra = {
    img : img,
    zip : zip,
    video : video,
    nofile : nofile,
    picture : picture,
    filezip : filezip,
    filevideo : filevideo
}

export {getParam , extra};