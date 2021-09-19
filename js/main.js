const auth = firebase.auth();
var uid , folder = null, islist = false;
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
function addFileList(title , link , key , date , share , size){
    const list = document.querySelector('.emailList__list');
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://drive.google.com/thumbnail?id=`+link2;
    list.innerHTML += `    <div class="emailRow ${key}" >
    <div class="emailRow__options">
      <input type="checkbox" name="checkbox" id="" data-id="${key}" link="${link}" />
    </div>

    <h3 class="emailRow__title" id="${key}" size="${size}" date="${date}" share=${share} key="${key}" link="${link}" title="${title}"  onclick="dropDown(this)">${title}</h3>

    <p class="emailRow__time">10pm</p>
  </div>`
}
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
function addPicture(title , link , key , date , share,size){
    var html;
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://drive.google.com/thumbnail?id=`+link2;
    try{ html = `
    <div   date="${date}" size="${size}" share=${share} class="card mr-4 ${key}" id="${key}" key="${key}" link="${link}" title="${title}" style="width: 28%" onclick="dropDown(this)">
    <img class="card-img-top" src="${link2}" loading="lazy" alt="Couldnt load">
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
function zipfile(title , link ,  key , date , share , size){
    var html;
    try{ html = `
    <div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width:28%; height: 6rem" id="${key}" title="${title}" key="${key}" link="${link}"  onclick="dropDown(this)">
    <div class="card-body">
    <h5 class="card-title mb-0 file"> <i class="fas fa-file-archive mr-4"></i></i>${title}</h5>                           
    </div>
    `
   document.getElementById('files').innerHTML += html
    }catch(err){
console.error(err)
    }
}
function video(title , link , key , date , share, size){
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    const id = link2.replace(/\s/g, '')
    link2 = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`;
    var html;
    try{ html = `
    <div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width: 28%; height: 14rem" id="${key}" title="${title}" key="${key}" link="${link}" onclick="dropDown(this)" >
    <video class="card-img-top" poster="https://drive.google.com/thumbnail?id=${id}" src="${link2}" controls></video>
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
    const list_folder = document.getElementById('file_list');
    const grid_folder = document.getElementById('folder');
    document.getElementById('main').style.display = "none"
    if(islist){
        list_folder.style.display = 'block'
        grid_folder.style.display = 'none'
    }else{
        list_folder.style.display = 'none'
        grid_folder.style.display = 'block'

    }

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
    get('.emailList__list').style.display = "none"
    document.getElementById('main').style.display = "block"
    get('.breadcrumb').innerHTML = `  <li class="breadcrumb-item"><a  onclick="home()" style="cursor: pointer;color: #000;">Home</a></li>`

}
function LoadFiles(fname){
    document.getElementById('files').innerHTML = ""
  document.querySelector('.emailList__list').innerHTML = `    
   <div class="emailList__settings">
  <div class="emailList__settingsLeft">
    <input type="checkbox" onchange="CheckBoxToggle(this)" />
    <span class="material-icons"> arrow_drop_down </span>
    <span class="material-icons"> redo </span>
    <span class="material-icons"> more_vert </span>
  </div>
  <div class="emailList__settingsRight">
    <span class="material-icons"> chevron_left </span>
    <span class="material-icons"> chevron_right </span>
    <span class="material-icons" onclick="DeleteMultipleFile()">delete_forever</span>
    <span class="material-icons" onclick="DownloadMultipleFile()" >cloud_download</span>
  </div>
</div>`
    firebase.database().ref('drive/'+uid+"/"+fname).on('child_added' , function(snapshot){
   if(snapshot.key == "folder"){

   }else{
       var type = snapshot.val().filename;
   if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') || type.includes('.gif')){
       addPicture(snapshot.val().filename , snapshot.val().file , snapshot.val().key, snapshot.val().date , snapshot.val().share  , snapshot.val().size )
       addFileList(snapshot.val().filename , snapshot.val().file , snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
    }else if (type.includes('.zip')){
        zipfile(snapshot.val().filename , snapshot.val().file, snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
        addFileList(snapshot.val().filename , snapshot.val().file , snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
    }else if (type.includes('.mp4')){
        video(snapshot.val().filename , snapshot.val().file, snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
        addFileList(snapshot.val().filename , snapshot.val().file , snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
    }else{
       zipfile(snapshot.val().filename , snapshot.val().file, snapshot.val().key, snapshot.val().date , snapshot.val().share , snapshot.val().size)
       addFileList(snapshot.val().filename , snapshot.val().file , snapshot.val().key , snapshot.val().date , snapshot.val().share , snapshot.val().size)
   }
   }
   
    })
}
function uploadfile(file , fname , type , size){  
    const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var newPostKey = firebase.database().ref().child('drive').push().key;
    firebase.database().ref("drive/"+uid+"/"+folder+"/"+newPostKey).set({ 
        "file": file ,
        "filename": fname,
         "type": type,
         'key': newPostKey,
         'date': d.getDay() + '/'+months[d.getMonth()] +'/'+ d.getFullYear(),
         'size': size,
         'share': false
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
        
    removeElementsByClass(`${id}`)
       dropItemClicked()
   }catch(err){
   alert(err)
   }
    
}
function listviewToggle(){
    const list = document.getElementById('list')
    const grid = document.getElementById('grid');
    const list_folder = document.getElementById('file_list');
    const grid_folder = document.getElementById('folder');
    if(list.style.display === 'none'){
        list.style.display = 'block'
        grid.style.display = 'none'
        islist = true;
    }else{
        islist = false;
        list.style.display = 'none'
        grid.style.display = 'block'
    }
    if(!(folder == null)){
        if(islist){
            list_folder.style.display = 'block'
            grid_folder.style.display = 'none'
        }else{
            list_folder.style.display = 'none'
            grid_folder.style.display = 'block'
    
        }
    }

}
function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       // And stick the checked ones onto an array...
       if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i]);
       }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
  }
function uncheckAll(divid) {
    var checks = document.querySelectorAll('#' + divid + ' input[type="checkbox"]');
    for(var i =0; i< checks.length;i++){
        var check = checks[i];
        if(!check.disabled){
            check.checked = false;
        }
    }
}
function checkAll(divid) {
    var checks = document.querySelectorAll('#' + divid + ' input[type="checkbox"]');
    for(var i =0; i< checks.length;i++){
        var check = checks[i];
        if(!check.disabled){
            check.checked = true;
        }
    }
}
function CheckBoxToggle($){
    if($.check == true){
        uncheckAll('file_list')
        $.check = false
    }else{

        checkAll('file_list') 
        $.check = true 
    }
}
function DeleteMultipleFile(){
    let checkedbox =  getCheckedBoxes('checkbox')
    checkedbox.forEach((checkbox) =>{
        deleteFile(checkbox)
    })
}
function DownloadMultipleFile(){
    let checkedbox =  getCheckedBoxes('checkbox')
    checkedbox.forEach((checkbox) =>{
        window.setTimeout(function(){
            let a = document.createElement('a')
            a.href = checkbox.getAttribute('link')
            a.click();
        },500)
    })
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
        uploadfile( url , file.name , file.type, file.size)
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
    
    const id = 'AKfycbzKN-K_pAw-Vmg_36AY32hWLOZtrkXJwxNKkE07pQ69k7Re1_RoWzlmCK1bKTBfcLB5'
    const url = `https://script.google.com/macros/s/${id}/exec`; 
    const qs = new URLSearchParams({id: fid, title : uid});
    fetch(`${url}?${qs}`, {
        method: "POST",
         body: 'xx' })
           .then(res => res.json())
           .then(e => {
             console.log(e)
           })
           .catch(err =>{
           
                console.warn(err)
           
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
              uploadfile( url , res.result.name , res.result.mimeType ,FileSize($.size))
              jNotify.success(res.result.name, 'File Uploaded Successfully');
          }catch(err){
              if(res.status === "Uploading"){
              }else{

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
    const date = $.getAttribute('date')
    const share = $.getAttribute('share')
    const size = $.getAttribute('size')
    const dropdown = get('#right-sidebar')
    var linkfile;
   const param = `?key=${btoa(key)}`
   linkfile ='https://faiezwaseem.github.io/Google-Drive-Clone/fileSharing/' + param
    dropdown.style.display = 'flex'
    get('#button-Delete').setAttribute("data-id", key);
    console.log(date)
    get('#date').textContent = date
    get('#size').textContent = size
    get('#button-download').onclick= ()=>{
        let a = document.createElement('a')
            a.href = link
            a.click();
    }
    get('#view').setAttribute("data-id", key);
    get('#title-option').textContent = title ;
   get('#button-copy').onclick=() => { copytext(linkfile) };
   if(share == 'false'){
    get('#view').checked = false
    get(`.${key}`).setAttribute('share','false')
}else{
    get(`.${key}`).setAttribute('share','true')
       get('#view').checked = true
   }

}
function dropItemClicked(){
    get('#right-sidebar').style.display = 'none' 
}
const switchSharing = get('#view')
switchSharing.addEventListener('click',function(){
    const id = get('#view').getAttribute('data-id');
    console.log(id)
    if(id === null){
        jNotify.error('Id Null','Coundnt process');
        console.log('id null')
        switchSharing.checked = false
    }else{
        if(switchSharing.checked){
  console.log('Make file public')
  setfileSharing(id);
}else{
     console.log('Make file private')
        removefilesharing(id)
        }
    }
})

function setfileSharing(id){

try{
    firebase.database().ref(`drive/${uid}/${folder}/${id}`).once('value').then(function (snapshot) {
      if(snapshot.exists()){
          const url = snapshot.val().file;
          const title = snapshot.val().filename
        firebase.database().ref('sharing/'+id).set({
            download : url ,
            title : title
        })
        firebase.database().ref(`drive/${uid}/${folder}/${id}`).update({
            "share" : true
        });
        get(`.${id}`).setAttribute('share','true')
    }else{
         
          console.warn('file not exist')
      }
    
      })
 
}catch(err){
console.log(err)
}
}
function removefilesharing(id){
    try{
        firebase.database().ref(`sharing`).child(id).remove();
        firebase.database().ref(`drive/${uid}/${folder}/${id}`).update({
            "share" : false
        });
        get(`.${id}`).setAttribute('share','false')
    }catch(err){
    console.log(err)
    }
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
  get('#sidebar-close').onclick=()=>{
      get('#right-sidebar').style.display = 'none'
  }

 //---------file drag drop----------------//
 //If user Drag File Over DropArea
 var dropArea = get('#right');
dropArea.addEventListener("dragover", (event)=>{
    event.preventDefault(); //preventing from default behaviour
    dropArea.classList.add("active");
  });
  
  //If user leave dragged File from DropArea
  dropArea.addEventListener("dragleave", ()=>{
    dropArea.classList.remove("active");
    
  });
  
  //If user drop File on DropArea
  dropArea.addEventListener("drop", (event)=>{
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    if(folder == null){
        dropArea.classList.remove("active");
        jNotify.error('Error', 'Please Select a Folder',{
            delay: 2000,
            fadeDelay: 500,
            closeButton: true,
            titleBold: true,
            offset: 40,
            });
    }else{
        dropArea.classList.remove("active");
        file = event.dataTransfer.files;
        for(let x = 0 ; x < event.dataTransfer.files.length ; x++){
            uploadToDrive(event.dataTransfer.files[x])
        }
       console.log(file)
    }
  }); 