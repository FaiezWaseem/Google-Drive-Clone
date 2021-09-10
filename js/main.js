const auth = firebase.auth();
var uid , folder = null;
var rand = Math.floor((Math.random() * 99999999999) + 1);
//----------------user if loggined---------------------//
auth.onAuthStateChanged(function(user){
		
    if(user){
        console.log('User LoggedIn')
       uid = user.uid;
       localStorage.setItem("uid",uid); 
       loadfolders();
    }else{
        console.log("No Active User");
        //no user is signed in
        window.location.replace("login.html");
    }
});
function get($){
    return document.querySelector($);
}

//-----------------Componenets----------------//
function addFolder(id, title){
    var html;
    try{
        html = `   
         <div class="card mr-4 p5" style="width: 21rem;" data-id="${id}" onclick="folderClick(this)">
        <div class="card-body">
        <h5 class="card-title mb-0 folder"><i class="fas fa-folder mr-4"></i>${title}</h5>
        </div>
    `
   document.getElementById('docs').innerHTML += html
    }catch(err){
console.error(err)
    }

}
function addPicture(title , link , key ){
    var html;
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://www.googleapis.com/drive/v3/files/${link2}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`;
    try{ html = `
    <div   class="card mr-4 ${key}" id="${key}" key="${key}" link="${link}" title="${title}" style="width: 28%" onclick="dropDown(this)">
    <img class="card-img-top" src="${link2}" alt="Couldnt load">
    <div class="card-body">
    <h5 class="card-title mb-0 file"><i class="fas fa-image mr-4"></i>${title}</h5>                           
    </div>
</div>
    `
   document.getElementById('files').innerHTML += html
    }catch(err){
console.error(err)
jNotify.error('Error', 'Something went wrong while loading a file',{
    delay: 3000,
    fadeDelay: 500,
    closeButton: true,
    titleBold: true,
    offset: 40,
    });
    }
}
function zipfile(title , link ,  key){
    var html;
    try{ html = `
    <div class="card mr-4" style="width:28%; height: 6rem" id="${key}" title="${title}" key="${key}" link="${link}"  onclick="dropDown(this)">
    <div class="card-body">
    <h5 class="card-title mb-0 file"> <i class="fas fa-file-archive mr-4"></i></i>${title}</h5>                           
    </div>
    `
   document.getElementById('files').innerHTML += html
    }catch(err){
console.error(err)
    }
}
function video(title , link , key){
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://www.googleapis.com/drive/v3/files/${link2}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`;
    var html;
    try{ html = `
    <div class="card mr-4" style="width: 28%; height: 14rem" id="${key}" title="${title}" key="${key}" link="${link}" onclick="dropDown(this)" >
    <video class="card-img-top" src="${link2}" controls></video>
    <div class="card-body">
    <h5 class="card-title mb-0 file"><i class="fas fa-image mr-4"></i>${title}</h5>                           
    </div>
    `
   document.getElementById('files').innerHTML += html
    }catch(err){
console.error(err)
    }
}
function currentPage(title){
    var html ;
    html = `<li class="breadcrumb-item active" aria-current="page">${title}</li>`
    get('.breadcrumb').innerHTML += html 
}
function addPage(title){
var html 
html = `<li class="breadcrumb-item"><a href="#">${title}</a></li>`
get('.breadcrumb').innerHTML += html 
}
function folderClick($){
    var id = $.getAttribute('data-id')
    addPage(id);
    folder = id
    LoadFiles(id)
    get('#folder').style.display = "block"
    document.getElementById('main').style.display = "none"

}
function createFolder(){
const foldername = prompt('Enter Folder Name')
if(foldername != null && foldername != ""){
    try{
        firebase.database().ref("drive/"+uid+"/"+foldername).set({ 
            folder : foldername
            });
    }catch(err){
   console.error(err)
    }
}else{
    jNotify.info('info', 'No Folder Created');
}
}
function loadfolders(){
    firebase.database().ref('drive/'+uid).on('child_added' , function(snapshot){
        addFolder(snapshot.key ,snapshot.key )
    })
}
function home(){
    folder = null
    document.getElementById('files').innerHTML = ""
    get('#folder').style.display = "none"
    document.getElementById('main').style.display = "block"
    get('.breadcrumb').innerHTML = `  <li class="breadcrumb-item"><a  onclick="home()" style="cursor: pointer;">Home</a></li>`

}
function LoadFiles(fname){
    document.getElementById('files').innerHTML = ""
    firebase.database().ref('drive/'+uid+"/"+fname).on('child_added' , function(snapshot){
   if(snapshot.key == "folder"){

   }else{
       var type = snapshot.val().filename;
   if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') || type.includes('.gif')){
       addPicture(snapshot.val().filename , snapshot.val().file , snapshot.val().key)
    }else if (type.includes('.zip')){
        zipfile(snapshot.val().filename , snapshot.val().file, snapshot.val().key)
        
    }else if (type.includes('.mp4')){
        video(snapshot.val().filename , snapshot.val().file, snapshot.val().key)
        
    }else{
       zipfile(snapshot.val().filename , snapshot.val().file, snapshot.val().key)

   }
   }
   
    })
}
function uploadfile(file , fname , type){  
    var newPostKey = firebase.database().ref().child('drive').push().key;
    firebase.database().ref("drive/"+uid+"/"+folder+"/"+newPostKey).set({ 
        "file": file ,
        "filename": fname,
         "type": type,
         'key': newPostKey
    });
}
function deleteFile($){
   const id = $.getAttribute('data-id')
   try{
       
    firebase.database().ref('drive/'+uid+"/"+folder+"/"+id).once('value').then(function (snapshot) {
           let link = snapshot.val().file
            link = link.replace('https://drive.google.com/uc?export=download&id=', "")
             link = link.replace(/\s/g, '')
             deleteFileDrive(link)
             firebase.database().ref('drive/'+uid+"/"+folder+"/").child(id).remove();
    })
        
       get(`#${id}`).style.display = "none"
       dropItemClicked()
   }catch(err){
   alert(err)
   }
    
}
//---------Component-----Finished-------------------//

//-----------------Upload--------------------------//
var upload = get('#upload')

upload.onclick = function(e){
    if(folder === null){
        jNotify.error('Error', 'No Folder Selected. \n Please Select a Folder to Upload Files in.',{
            delay: 4000,
            fadeDelay: 500,
            closeButton: true,
            titleBold: true,
            offset: 40,
            })
    }else{
    var  input = document.createElement('input');
    input.type = 'file';
   input.multiple = "multiple"

input.onchange = e =>{
    for(let x = 0 ; x < e.target.files.length ; x++){
        uploadToDrive(e.target.files[x])
    }
    console.log(FileSize(parseInt(e.target.files[0].size)))
    console.log(e.target.files.length)
    console.log(e.target.files)
    files = e.target.files;
    fileName = e.target.files[0].name;
    reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onload = f => {
        // uploadToDrive2(f , files[0])
       }
   }    
   input.click();
    }
}

var overlay = get('#overlay')
//-----------DRIVE UPLOAD , DELETE  , GETSHARING ---------------------//
// This method have file upload size limit max 20mb
function uploadToDrive2(f , file){
    get('#overlay').style.display = 'grid'
    const id = 'AKfycbxfwq0PGdYnf6LYsFj9Rog5veT00jukFHZPL_l5WipFH_8ApxLgoiEtSGfpsGA2NNGc'
    const url = `https://script.google.com/macros/s/${id}/exec`; 
    console.log('uploading')
    const qs = new URLSearchParams({filename: file.name, mimeType: file.type});
    fetch(`${url}?${qs}`, {
 method: "POST",
  body: JSON.stringify([...new Int8Array(f.target.result)])})
    .then(res => res.json())
    .then(e => {
        get('#overlay').style.display = 'none'
        var url = ` https://drive.google.com/uc?export=download&id=${e.fileId}`
        uploadfile( url , file.name , file.type)
    })
    .catch(err =>{
        get('#overlay').style.display = 'none'
         console.log(err)
         alert('Uploading Error \n ' + JSON.stringify(err))
    })
}
var drive_accessToken;
getAccessToken();
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
       get('#storage').innerHTML =  FileSize(e.used_storage) + "/"+ FileSize(e.total_storage)
    })
    .catch(err =>{
    
         console.log(err)
    
    })
}
function getFileShaingPermission(fid){
    
    const id = 'AKfycbyb3Z3EwstJO5cKa8k5cIMglSRo4kg2mf1VVDdL8-evCQ4M063HPLUlw_L7f9S2JE4'
    const url = `https://script.google.com/macros/s/${id}/exec`; 
    const qs = new URLSearchParams({id: fid});
    fetch(`${url}?${qs}`, {
        method: "POST",
         body: '' })
           .then(res => res.json())
           .then(e => {
             console.log(e)
           })
           .catch(err =>{
           
                console.log(err)
           
           })
}
// this method have no upload size limit 
//thus it needs access token to upload file 
//still file can only be uploaded to root directory 
//so we after uploading it to root folder we move it to public folder
//using getFileShaingPermission() function which just move it to public folder
function uploadToDrive($){
    const accessToken = drive_accessToken;
     run($)
    
      function run(obj) {
        const file = obj;
        if (file.name != "") {
          let fr = new FileReader();
          fr.fileName = file.name;
          fr.fileSize = file.size;
          fr.fileType = file.type;
          fr.readAsArrayBuffer(file);
          fr.onload = resumableUpload;
          
        }
      }

      function resumableUpload(e) {
       jNotify.push('Message', 'Initializing');
      const f = e.target;
        const resource = {
          fileName: f.fileName,
          fileSize: f.fileSize,
          fileType: f.fileType,
          fileBuffer: f.result,
          accessToken: accessToken
        };
        const ru = new ResumableUploadToGoogleDrive();
        ru.Do(resource, function(res, err) {
          if (err) {
              alert('Unable To Upload : \n' +JSON.stringify(err))
              console.log("UPload Failed \n"+err);
              jNotify.error('Error Uploading', `Error Uploading File : ${f.filename} `,{
                delay: 3000,
                fadeDelay: 500,
                closeButton: true,
                titleBold: true,
                offset: 40,
                });
    
            return;
          }
          try{
              //Upload Success
            
              var url = ` https://drive.google.com/uc?export=download&id=${res.result.id}`
              getFileShaingPermission(res.result.id)
              uploadfile( url , res.result.name , res.result.mimeType)
              jNotify.success(res.result.name, 'File Uploaded Successfully');
          }catch(err){
              if(res.status === "Uploading"){

                  console.log(res.progressByte.current)
                  console.log(res.progressByte.total)
              }
     
          }
          let msg = "";
          if (res.status == "Uploading") {
            msg =
              Math.round(
                (res.progressNumber.current / res.progressNumber.end) * 100
              ) + "%";
              jNotify.push('Uploading', `Uploaded : ${msg}`,{
                delay: 1000,
                fadeDelay: 500,
                closeButton: true,
                titleBold: true,
                offset: 40,
                });
          } else {
            msg = res.status;
          }
         
        });
      }
}
function deleteFileDrive(fileId) {
    const id = 'AKfycbzZcpb8JjFW3h-njXJcHxGHKmg6570F9aL4ei13rJPWOJKH7zgpQA6940IxQwhkesAU'
    const url = `https://script.google.com/macros/s/${id}/exec`; 
    const qs = new URLSearchParams({id: fileId});
    fetch(`${url}?${qs}`, {
        method: "POST",
         body: '' })
           .then(res => res.json())
           .then(e => {console.log(e)})
           .catch(err =>{console.error(err)})
  }

//--------------------------------------------------------------------//  
function dropDown($){
    const key = $.getAttribute('key')
    const link = $.getAttribute('link')
    const title = $.getAttribute('title')
    const dropdown = get('.Loading-Modal')
   const param = `?key=${btoa(key)}&uid=${btoa(uid)}&folder=${folder}`
    dropdown.style.display = 'grid'
    get('#delete').setAttribute("data-id", key);
    get('#download').setAttribute("href", link);
    get('#title-option').textContent = title ;
    get('#title-option').innerHTML += `<i class="far fa-times-circle" onclick="dropItemClicked()">` ;

   get('#sharelink').onclick=() => { copytext('https://faiezwaseem.github.io/Google-Drive-Clone/fileSharing/' + param) };
}
function dropItemClicked(){
    get('.Loading-Modal').style.display = 'none' 
}
var _x = 0
function openNav() {
    document.getElementById("left").classList.remove("col-2");
    document.getElementById("left").classList.remove("p-4");
    if(_x == 0){
        document.getElementById("left").style.width = '0px'
        _x=1;
    }else{
        _x = 0
        document.getElementById("left").style.width = '250px'

  }
  }
  get('#nav-close').onclick = () =>{
      if(_x == 0){
          _x = 1;
      }else{
          _x = 0;
      }
    document.getElementById("left").classList.remove("col-2");
    document.getElementById("left").classList.remove("p-4");
    document.getElementById("left").style.width = '0px'
  }

 window.addEventListener('resize' , function(e){
     if(e.currentTarget.innerWidth > 768){
    document.getElementById("left").style.width = ''
    document.getElementById("left").classList.add("col-2");
    document.getElementById("left").classList.add("p-4");
  }
 }) 
 function FileSize(size) {
    var $_i = Math.floor( Math.log(size) / Math.log(1024) );
   return ( size / Math.pow(1024, $_i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][$_i];
   }
   function copytext(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var resultCopy = document.execCommand("copy");
    document.body.removeChild(input);
    alert('copied')
    return resultCopy;
  }
get('.fa-sign-out-alt').onclick=()=>{
      auth.signOut();
  }