//-----------------Upload--------------------------//
var upload = get('#upload')

upload.onclick = function(e){
    if(folder === null){
            var  input = document.createElement('input');
            input.type = 'file';
           input.multiple = "multiple"
        
        input.onchange = e =>{
          document.querySelector('.jnotify').style.display = 'block'
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
    }else{
    var  input = document.createElement('input');
    input.type = 'file';
   input.multiple = "multiple"

input.onchange = e =>{
  document.querySelector('.jnotify').style.display = 'block'
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
        console.error("Failed To get AccessToken ReTrying \n",[err])
        getAccessToken()
    
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
           
                // console.warn(err)
                // console.clear();
           
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
       const div = document.getElementById('upload_elem')

      const f = e.target;
        const resource = {
          fileName: f.fileName,
          fileSize: f.fileSize,
          fileType: f.fileType,
          fileBuffer: f.result,
          accessToken: accessToken
        };
       const html=  `
        <div>
        <p style="color: white;">${f.fileName}</p>
             <div class="progress">
                 <div id="${f.fileSize}" class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
               </div>
         </div>
        `
        div.insertAdjacentHTML("afterbegin", html);
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
              const elem = document.getElementById(f.fileSize)
              elem.innerText = '100%';
              elem.style.width = '100%'
              firebase.database().ref(`drive/${uid}/${folder}`).once('value').then(function(snapshot){
                if(snapshot.val().share){
                  removefoldersharing(folder)
                  setfolderSharing(folder)
                }else{
                   
                }
            })
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
              const elem = document.getElementById(f.fileSize)
              elem.innerText = msg;
              elem.style.width = msg
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
           .then(e => {console.log(e)
            firebase.database().ref(`drive/${uid}/${folder}`).once('value').then(function(snapshot){
              if(snapshot.val().share){
                removefoldersharing(folder)
                setfolderSharing(folder)
              }else{
                 
              }
          })
          })
           .catch(err =>{console.error(err)})
  }
//--------------------------------------------------------------------//  