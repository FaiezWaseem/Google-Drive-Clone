//-----------------Componenets----------------//
function addFileList(title , link , key , date , share , size){
    const list = document.querySelector('.emailList__list');
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://drive.google.com/thumbnail?id=`+link2;
    list.innerHTML += `    <div class="emailRow ${key}" >
    <div class="emailRow__options">
      <input type="checkbox" name="checkbox" id="" data-id="${key}" link="${btoa(link)}" />
    </div>

    <h3 class="emailRow__title" id="${key}" size="${size}" date="${date}" share=${share} key="${key}" link="${btoa(link)}" title="${title}"  onclick="dropDown(this)">${title}</h3>

    <p class="emailRow__time">10pm</p>
  </div>`
}
function addFolder(id, title){
    var html;
    try{
        html = `   
         <div class="card mr-4 p5 ${id}" data-long-press-delay="500" style="width: 21rem;height:6rem" data-id="${id}" onclick="folderClick(this)">
        <div class="card-body" data-id="${id}">
        <h5 class="card-title mb-0 folder" data-id="${id}"> <i class="fas fa-folder mr-4"></i>${title}</h5>
        </div>
    `
   document.getElementById('docs').innerHTML += html
    }catch(err){
console.warn(err)
    }

}
function addPicture(title , link , key , date , share,size){
 
    var html;
    var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
    link2 = link2.replace(/\s/g, '')
    link2 = `https://drive.google.com/thumbnail?id=`+link2;
   
    try{ html = `
    <div   date="${date}" size="${size}" share=${share} class="card mr-4 ${key}" id="${key}" key="${key}" link="${btoa(link)}" title="${title}" style="width: 28%" onclick="dropDown(this)">
    <img class="card-img-top" src="${link2}" loading="lazy" alt="Couldnt load">
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"><i class="fas fa-image mr-4"></i>${title}</h5>                           
    </div>
</div>
    `
    if(folder == null){
        document.getElementById('docs').innerHTML += html
    }else{

        document.getElementById('files').innerHTML += html
    }
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
    <div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width:28%; height: 6rem" id="${key}" title="${title}" key="${key}" link="${btoa(link)}"  onclick="dropDown(this)">
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"> <i class="fas fa-file-archive mr-4"></i></i>${title}</h5>                           
    </div>
    `
    if(folder == null){
        document.getElementById('docs').innerHTML += html
    }else{

        document.getElementById('files').innerHTML += html
    }
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
    <div class="card mr-4 ${key}" size="${size}" date="${date}" share=${share} style="width: 28%; height: 14rem" id="${key}" title="${title}" key="${key}" link="${btoa(link)}" onclick="dropDown(this)" >
    <video class="card-img-top" poster="https://drive.google.com/thumbnail?id=${id}" src="${btoa(link)}" controls></video>
    <div class="card-body">
    <h5 class="card-title mb-0 file" data-id="${key}"><i class="fas fa-image mr-4"></i>${title}</h5>                           
    </div>
    `
    if(folder == null){
        document.getElementById('docs').innerHTML += html
    }else{

        document.getElementById('files').innerHTML += html
    }
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
    get('#right-sidebar').style.display = 'none'
    try{
    var id = $.getAttribute('data-id')
    var title = get(`.${id} h5`).innerText
    addPage(title);
    window.location.hash = title 
    window.localStorage.setItem('pageFolderId',id)
    window.localStorage.setItem('pageFolderName',title)
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
}catch(err){
    console.log(err)
}
}
function createFolder(){
const foldername = prompt('Enter Folder Name')
if(foldername != null && foldername != ""){
    try{
        firebase.database().ref("drive/"+uid+"/"+generate(5)).set({ 
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
        firebase.database().ref('drive/'+uid+"/"+snapshot.key).once('value').then(function (snapshot) {
            if(snapshot.val().folder){

                addFolder(snapshot.key,snapshot.val().folder )

            }else{
                const type = snapshot.val().filename;
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
    })
}
function home(){
    history.pushState("", document.title, window.location.pathname);
    folder = null
    get('#right-sidebar').style.display = 'none'
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
        if(folder == null){}else{
   if(snapshot.key == "folder"){
   
   }else{
       try{
    if (document.querySelector(`.${snapshot.val().key}`)) {
        // console.log("Element exists!");
      } else {
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
}catch(err){console.warn('ERROR FILE LOADING \n')}
}
}
    })

}
// Upload file Data to Firebase
function uploadfile(file , fname , type , size){  
    const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var newPostKey = generate(6);
    if(folder ==  null){
        firebase.database().ref("drive/"+uid+"/"+newPostKey).set({ 
            "file": file ,
            "filename": fname,
             "type": type,
             'key': newPostKey,
             'date': d.getDate() + '/'+months[d.getMonth()] +'/'+ d.getFullYear(),
             'size': size,
             'share': false
        });
    }else{
    firebase.database().ref("drive/"+uid+"/"+folder+"/"+newPostKey).set({ 
        "file": file ,
        "filename": fname,
         "type": type,
         'key': newPostKey,
         'date': d.getDate() + '/'+months[d.getMonth()] +'/'+ d.getFullYear(),
         'size': size,
         'share': false
    });
}
}
//Delete File from Firebase and Drive storage
function deleteFile($){
   const id = $.getAttribute('data-id')
   try{
       if(folder == null){
        firebase.database().ref('drive/'+uid+"/"+id).once('value').then(function (snapshot) {
           
            let link = snapshot.val().file
             link = link.replace('https://drive.google.com/uc?export=download&id=', "")
              link = link.replace(/\s/g, '')
              deleteFileDrive(link)
              firebase.database().ref('drive/'+uid+"/").child(id).remove();
     })
         
     removeElementsByClass(`${id}`)
        dropItemClicked()
       }else{
    firebase.database().ref('drive/'+uid+"/"+folder+"/"+id).once('value').then(function (snapshot) {
           let link = snapshot.val().file
            link = link.replace('https://drive.google.com/uc?export=download&id=', "")
             link = link.replace(/\s/g, '')
             deleteFileDrive(link)
             firebase.database().ref('drive/'+uid+"/"+folder+"/").child(id).remove();
    })
        
    removeElementsByClass(`${id}`)
       dropItemClicked()
    }
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
function RenameFolder(folder){
    const foldername = folder.getAttribute('data-id')
    let folderName = prompt("Enter new name for Folder");
if (folderName != null) {
    firebase.database().ref(`drive/${uid}/${foldername}/`).update({
        "folder" : folderName
    });
  document.querySelector(`.${foldername} h5`).innerHTML = `<i class="fas fa-folder mr-4"></i> ${folderName}`
}else{
    jNotify.error('Folder Renaming Error ','Folder Not Renamed')
}
 
}
function DeleteFolder(folder){
    document.getElementById('overlay').style.display = 'grid'
    document.querySelector('#deleteFolder').onclick=()=>{
        const foldername = folder.getAttribute('data-id')
        firebase.database().ref('drive/'+uid+"/").child(foldername).remove();
        removeElementsByClass(`${foldername}`)
        document.getElementById('overlay').style.display = 'none'
    }
}
function CopyFolderLink(folder){
    const key = folder.getAttribute('data-id');
    const param = `?folder=${btoa(key)}`
    linkfile ='https://faiezwaseem.github.io/Google-Drive-Clone/fileSharing/' + param
    copytext(linkfile);
}
function RemoveFolderSharing(id){
    firebase.database().ref('sharing').child(id).remove();
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
            let str = checkbox.getAttribute('link')
            str =  str.replace("https://drive.google.com/uc?export=download&id=" , "")
            str = str.replace(/\s/g, '');
            str =  `https://www.googleapis.com/drive/v3/files/${str}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`
            a.href = str
            a.click();
        },500)
    })
}
function LoadPrevFolder(id ,title){
    get('#right-sidebar').style.display = 'none'
    var id = id
    var title = title
    addPage(title);
    window.location.hash = title  
    window.localStorage.setItem('pageFolderId',id)
    window.localStorage.setItem('pageFolderName',title)
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
//---------Component-----Finished-------------------//

window.addEventListener('hashchange',(e)=>{
    if(e.newURL.includes('#')){
        console.log('#Found' , folder)
         if(folder == null){
             const fkey = window.localStorage.getItem('pageFolderId')
             const title = window.localStorage.getItem('pageFolderName')
             LoadPrevFolder(fkey , title)
         }
    }else{
        home()
    }
})
