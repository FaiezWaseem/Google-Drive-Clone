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

//----Componenets----------------//
function addFolder(id, title){
    var html;
    try{
        html = `   
         <div class="card mr-4" style="width: 18rem;" data-id="${id}" onclick="folderClick(this)">
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
    try{ html = `
    <div   class="card mr-4 ${key}" id="${key}" key="${key}" link="${link}" title="${title}" style="width: 18rem;" onclick="dropDown(this)">
    <img class="card-img-top" src="${link}" alt="Couldnt load">
    <div class="card-body">
    <h5 class="card-title mb-0 file"><i class="fas fa-image mr-4"></i>${title}</h5>                           
    </div>
</div>
    `
   document.getElementById('files').innerHTML += html
    }catch(err){
console.error(err)
    }
}
function zipfile(title , link ,  key){
    var html;
    try{ html = `
    <div class="card mr-4" style="width: 18rem; height: 6rem" id="${key}" title="${title}" key="${key}" link="${link}"  onclick="dropDown(this)">
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
    var html;
    try{ html = `
    <div class="card mr-4" style="width: 18rem; height: 14rem" id="${key}" title="${title}" key="${key}" link="${link}" onclick="dropDown(this)" >
    <video class="card-img-top" src="${link}" controls></video>
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
    alert("Nothing Created")
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
       firebase.database().ref('drive/'+uid+"/"+folder+"/").child(id).remove();
       get(`#${id}`).style.display = "none"
       dropItemClicked()
   }catch(err){
   alert(err)
   }
    
}

var upload = get('#upload')

upload.onclick = function(e){
    if(folder === null){
        alert("no folder Selected")
    }else{
    var  input = document.createElement('input');
    input.type = 'file';
   

input.onchange = e =>{
       uploadToDrive(e)
       overlay.style.display = 'grid'
       files = e.target.files;
       fileName = e.target.files[0].name;
       console.log(e.target.files[0].name);
       reader = new FileReader();
       reader.readAsArrayBuffer(files[0]);
       reader.onload = f => {

       }
   }    
   input.click();
    }
}

var overlay = get('#overlay')

function uploadToDrive($){
    const accessToken = 'ya29.a0ARrdaM-u-DiRWbqhheY2aCoZM_qD7zR_9ja-GCxmAxf3QJ7KdVloyO5H_EAHellZkPbPs8Qb8sltiVWLwzPoog-YIFIKQGK6kg1iKie0LLTGWSkHnPIsWUjwf7xT5Je_i211-yYGuU_rrjPQHdp8FzKNj_g4'; 
     run($)
    
      function run(obj) {
        const file = obj.target.files[0];
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
       console.log("Initializing.");
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
              alert('Unable To Upload : \n' +err)
              console.log(err);
              overlay.style.display = 'none'
            return;
          }
          try{
              //Upload Success
              console.log(res.result.id);
              console.log(res.result.name);
              var url = ` https://drive.google.com/uc?export=download&id=${res.result.id}`
              uploadfile( url , res.result.name , res.result.type)
              overlay.style.display = 'none'
          }catch(err){
            if (res.status == "start"){
               
            }else{
            
            }
          }
          let msg = "";
          if (res.status == "Uploading") {
            msg =
              Math.round(
                (res.progressNumber.current / res.progressNumber.end) * 100
              ) + "%";
          } else {
            msg = res.status;
          }
         
        });
      }
}
function dropDown($){
    const key = $.getAttribute('key')
    const link = $.getAttribute('link')
    const title = $.getAttribute('title')
    const dropdown = get('.menu')

    dropdown.style.display = 'block'
    get('#delete').setAttribute("data-id", key);
    get('#download').setAttribute("href", link);
    get('#title-option').textContent = title ;
    get('#title-option').innerHTML += `<i class="far fa-times-circle" onclick="dropItemClicked()">` ;

}
function dropItemClicked(){
    get('.menu').style.display = 'none' 
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
      console.log(e.currentTarget.innerHeight)
      console.log(e.currentTarget.innerWidth)
    document.getElementById("left").style.width = ''
    document.getElementById("left").classList.add("col-2");
    document.getElementById("left").classList.add("p-4");
  }
 }) 