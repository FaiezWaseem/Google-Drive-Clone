import {getParam , extra} from './extra.js'


window.onload = () =>{
  
    const auth = firebase.auth();
    var isstatus;
    //----------------user if loggined---------------------//
    auth.onAuthStateChanged(function(user){
            
        if(user){
            console.log('User LoggedIn')
           isstatus = true;
          
        }else{
            console.log("No Active User");
            //no user is signed in
            isstatus = false
        }
    });

var url = getParam();
const key = atob(url.key);
var download_url;

    if(url.folder){
       
        if(isstatus){

        }else{

        }

    }else{
        // if its only a file
        const main = document.querySelector('.main')
        firebase.database().ref(`sharing/${key}`).once('value').then(function (snapshot) {
            console.log(snapshot.val())
            if(snapshot.exists()){
           document.querySelector('#title').innerText = snapshot.val().title;
           download_url = snapshot.val().download;
           document.querySelector('#download').href = download_url;
            const fname = snapshot.val().title;
            if(snapshot.key == "folder"){
           
            }else{
                var type = snapshot.val().title;
            if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') ||  type.includes('.jpeg') || type.includes('.gif')){
                main.innerHTML += extra.img(snapshot.val().download);
                
             }else if (type.includes('.zip')){
                 main.innerHTML += extra.zip(fname);
                 
             }else if (type.includes('.mp4')){
                 var link = snapshot.val().download
                var link2 = link.replace('https://drive.google.com/uc?export=download&id=', "")
                link2 = link2.replace(/\s/g, '')
                const vid_key = link2
                link2 =  `https://www.googleapis.com/drive/v3/files/${vid_key}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NdlAW8n3uh2q6AJkyAA`
                 main.innerHTML = extra.video(vid_key , link2)
        
             }else{
              
                main.innerHTML += extra.zip(fname)
            }
            
        }
        }else{
            main.innerHTML += extra.nofile();
        document.querySelector('#download').disable = true
        }
        })
    }
function goback(){window.location.replace("../index.html");}


}
