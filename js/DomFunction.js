
function dropDown($){
    const key = $.getAttribute('key')
    const link = atob($.getAttribute('link'))
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
    get('#date').textContent = date
    get('#size').textContent = size
    get('#button-download').onclick= ()=>{
        let a = document.createElement('a')
            let str = link;
            str =  str.replace("https://drive.google.com/uc?export=download&id=" , "")
            str = str.replace(/\s/g, '');
            str =  `https://www.googleapis.com/drive/v3/files/${str}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`
             a.href = str
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
    if(id === null){
        jNotify.error('Id Null','Coundnt process');
        switchSharing.checked = false
    }else{
        if(switchSharing.checked){
  setfileSharing(id);
}else{
        removefilesharing(id)
        }
    }
})

function setfileSharing(id){

try{
    if(folder == null){
        firebase.database().ref(`drive/${uid}/${id}`).once('value').then(function (snapshot) {
            if(snapshot.exists()){
                const url = snapshot.val().file;
                const title = snapshot.val().filename
              firebase.database().ref('sharing/'+id).set({
                  download : url ,
                  title : title
              })
              firebase.database().ref(`drive/${uid}/${id}`).update({
                  "share" : true
              });
              get(`.${id}`).setAttribute('share','true')
          }else{
               
                console.warn('file not exist')
            }
          
            })
    }else{
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
    }
 
}catch(err){
console.log(err)
}
}
function removefilesharing(id){
    try{
           firebase.database().ref(`sharing`).child(id).remove();
           if(folder == null){
            firebase.database().ref(`drive/${uid}/${id}`).update({
                "share" : false
            });
           }else{
            firebase.database().ref(`drive/${uid}/${folder}/${id}`).update({
                "share" : false
            });
           }

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
    
  }else if(e.currentTarget.innerWidth < 768){
    document.getElementById("left").classList.remove("col-2");
    document.getElementById("left").classList.remove("p-4");
    document.getElementById("left").style.width = '0px'
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
    jNotify.success("Link", 'Link Copied Successfully');
    return resultCopy;
  }
  //Function SignOut
get('.fa-sign-out-alt').onclick=()=>{
      auth.signOut();
  }
  //File Side bar CLose 
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
        document.querySelector('.jnotify').style.display = 'block'
        dropArea.classList.remove("active");
        file = event.dataTransfer.files;
        for(let x = 0 ; x < event.dataTransfer.files.length ; x++){
            uploadToDrive(event.dataTransfer.files[x])
        }
    }else{
        document.querySelector('.jnotify').style.display = 'block'
        dropArea.classList.remove("active");
        file = event.dataTransfer.files;
        for(let x = 0 ; x < event.dataTransfer.files.length ; x++){
            uploadToDrive(event.dataTransfer.files[x])
        }
       console.log(file)
    }
  }); 
  //Genereate Random Key
  function generate(l) {
    if (typeof l==='undefined'){var l=8;}
    /* c : alphanumeric character string */
    var c='abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ',
    n=c.length,
    /* p : special character string */
    p='-_',
    o=p.length,
    r='',
    n=c.length,
    /* s : determinate the position of the special character */
    s=Math.floor(Math.random() * (p.length-1));

    for(var i=0; i<l; ++i){
        if(s == i){
            /* special charact insertion (random position s) */
            r += p.charAt(Math.floor(Math.random() * o));
        }else{
            /* alphanumeric insertion */
            r += c.charAt(Math.floor(Math.random() * n));
        }
    }
    return r + Math.floor((Math.random()*10));
}
//Folder DropDown Menu 
try{
//Long press
var el = document.querySelector('#docs');
 el.addEventListener('long-press', function(e) {

// stop the event from bubbling up
e.preventDefault()
const id = e.target.getAttribute('data-id')

if(id == null){

}else{
   
    var menu = document.querySelector('.menu2');
    showMenu(e.detail.clientX,e.detail.clientY)
    function showMenu(x, y){
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('menu-show');
        get('#rename').setAttribute('data-id',id)
        get('#folderDelete').setAttribute('data-id',id)
        get('#openFolder').setAttribute('data-id',id)
        get('#shareFolder').setAttribute('data-id',id)
        get('#folderShare').setAttribute('data-id',id)
        firebase.database().ref(`drive/${uid}/${id}`).once('value').then(function(snapshot){
            if(snapshot.val().share){
             get('#folderShare').checked = true
            }else{
                get('#folderShare').checked = false
            }
        })
    }
    
    function hideMenu(){
        menu.classList.remove('menu-show');
    }
  document.addEventListener('click',function(){
      hideMenu()
  })
}
});
}catch(err){
console.warn(err)
}
//Search File
let search = document.getElementById('fileSearch');
search.addEventListener('keyup',function(){
    if(folder == null){
      let h5 = document.querySelectorAll('.card-body h5');
      h5.forEach((h)=>{
          const searchvalue = search.value.toLowerCase()
          const text = h.innerText.toLowerCase();
          if(searchvalue == ""){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
          }else{
          if(text.includes(searchvalue)){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
          }else{
              const id = h.getAttribute("data-id")
          document.querySelector(`.${id}`).style.display = 'none';
        }
    }
    })
}else{
    let h5 = document.querySelectorAll('.card-body h5');
    h5.forEach((h)=>{
        const searchvalue = search.value.toLowerCase()
        const text = h.innerText.toLowerCase();
        if(searchvalue == ""){
          const id = h.getAttribute("data-id")
          document.querySelector(`.${id}`).style.display = 'flex';
        }else{
        if(text.includes(searchvalue)){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
        }else{
            const id = h.getAttribute("data-id")
        document.querySelector(`.${id}`).style.display = 'none';
      }
  }
  })

    }
})
search.addEventListener('keydown',function(){  
    if(folder == null){
      let h5 = document.querySelectorAll('.card-body h5');
      h5.forEach((h)=>{
          const searchvalue = search.value.toLowerCase()
          const text = h.innerText.toLowerCase();
          if(searchvalue == ""){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
          }else{
          if(text.includes(searchvalue)){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
          }else{
              const id = h.getAttribute("data-id")
          document.querySelector(`.${id}`).style.display = 'none';
        }
    }
    })
}else{
    let h5 = document.querySelectorAll('.card-body h5');
    h5.forEach((h)=>{
        const searchvalue = search.value.toLowerCase()
        const text = h.innerText.toLowerCase();
        if(searchvalue == ""){
          const id = h.getAttribute("data-id")
          document.querySelector(`.${id}`).style.display = 'flex';
        }else{
        if(text.includes(searchvalue)){
            const id = h.getAttribute("data-id")
            document.querySelector(`.${id}`).style.display = 'flex';
        }else{
            const id = h.getAttribute("data-id")
        document.querySelector(`.${id}`).style.display = 'none';
      }
  }
  })

    }
})
let close = document.getElementById('close_upload_box');
close.onclick = () =>{
 document.querySelector('.jnotify').style.display = 'none'
}
//Folder Sharing
const folderSharing = get('#folderShare')
folderSharing.addEventListener('click',function(){
    const id = get('#folderShare').getAttribute('data-id');
    if(id === null){
        jNotify.error('Id Null','Coundnt process');
        folderSharing.checked = false
    }else{
        if(folderSharing.checked){
  setfolderSharing(id);
}else{
        removefoldersharing(id)
        }
    }
})
function setfolderSharing(folder){
    const keyFolder = folder
  var obj ;
    try{
        firebase.database().ref(`drive/${uid}/${keyFolder}`).update({
            "share" : true
        });
        firebase.database().ref(`drive/${uid}/${keyFolder}`).once('value').then(function (snapshot) {
          obj = snapshot.val();
                for (const [key, value] of Object.entries(obj)) {
                   if(value == true  || value == false){

                   }else{
                       if( key == 'folder'){
                        firebase.database().ref('sharing/'+keyFolder+'/').update({
                            folder : value
                        });
                       }else{
                     firebase.database().ref('sharing/'+keyFolder+'/'+key).set({
                         date : value.date,
                         file : value.file,
                         filename : value.filename,
                         key : value.key,
                         share : value.share,
                         size : value.size,
                         type : value.type
                     })
                    }
                    }
                  }
             

            })
   
}catch(err){console.error(err)}
}
function removefoldersharing(id){
    firebase.database().ref(`sharing`).child(id).remove();
    firebase.database().ref(`drive/${uid}/${id}`).update({
        "share" : false
    });
}