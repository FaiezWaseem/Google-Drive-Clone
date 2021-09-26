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
const extra = {
    img : img,
    zip : zip,
    video : video,
    nofile : nofile
}

export {getParam , extra};