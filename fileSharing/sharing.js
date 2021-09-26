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
var key ;
var download_url;
if(url.key){
  key  = atob(url.key);
}else if (url.folder){
key = atob(url.folder)
}

    if(url.folder){
       console.log('Hooray Its A Folder'  , key)
        if(isstatus){
//if user Logged in 
const main = document.querySelector('.multipleFiles')
main.style.display = 'flex'
firebase.database().ref(`sharing/${key}`).once('value').then(function (snapshot) {
    var obj = snapshot.val();
    if(snapshot.exists()){
        for (const [key, value] of Object.entries(obj)) {
            if(key != 'folder'){
                const s = value;
                console.log(s)
                const type = s.filename;
                if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') ||  type.includes('.jpeg') || type.includes('.gif')){
                    var link2 = value.file.replace('https://drive.google.com/uc?export=download&id=', "")
                    link2 = link2.replace(/\s/g, '')
                    link2 = 'https://drive.google.com/thumbnail?id='+link2
                    main.innerHTML += extra.picture(s.size , s.date , s.key , s.filename , link2 , s.share)
                    
                 }else if (type.includes('.zip')){
                     main.innerHTML += extra.filezip(s.size , s.date , s.key , s.filename , s.file , s.share)
                     
                 }else if (type.includes('.mp4')){
                    var link2 = value.file.replace('https://drive.google.com/uc?export=download&id=', "")
                    link2 = link2.replace(/\s/g, '')
                    link2 = 'https://drive.google.com/thumbnail?id='+link2
                     main.innerHTML += extra.filevideo(s.size , s.date , s.key , s.filename , link2 , s.share)
            
                 }else{
                  
                    main.innerHTML += extra.filezip(s.size , s.date , s.key , s.filename , s.file , s.share)
                }
            }else{
                    document.querySelector('#title').innerText =  key == 'folder' ? value : 'folder Name' 
        } 
        }
    }else{
        main.innerHTML += extra.nofile()
    }
})
        }else{
            // if user anonymous

            const main = document.querySelector('.multipleFiles')
            main.style.display = 'flex'
            firebase.database().ref(`sharing/${key}`).once('value').then(function (snapshot) {
                var obj = snapshot.val();
                if(snapshot.exists()){
                    for (const [key, value] of Object.entries(obj)) {
                        if(key != 'folder'){
                            const s = value;
                            console.log(s)
                            const type = s.filename;
                            if(type.includes('.png') ||type.includes('.PNG') || type.includes('.jpg') ||  type.includes('.jpeg') || type.includes('.gif')){
                                var link2 = value.file.replace('https://drive.google.com/uc?export=download&id=', "")
                                link2 = link2.replace(/\s/g, '')
                                link2 = 'https://drive.google.com/thumbnail?id='+link2
                                console.log('image')
                                main.innerHTML += extra.picture(s.size , s.date , s.key , s.filename , link2 , s.share)
                                
                             }else if (type.includes('.zip') || type.includes('.pdf') || type.includes('.doc') || type.includes('.xls') ){
                                 main.innerHTML += extra.filezip(s.size , s.date , s.key , s.filename , s.file , s.share)
                                 
                             }else if (type.includes('.mp4')){
                                var link2 = value.file.replace('https://drive.google.com/uc?export=download&id=', "")
                                link2 = link2.replace(/\s/g, '')
                                link2 = 'https://drive.google.com/thumbnail?id='+link2
                                 main.innerHTML += extra.filevideo(s.size , s.date , s.key , s.filename , link2 , s.share)
                        
                             }else{
                               console.log('other')
                                main.innerHTML += extra.filezip(s.size , s.date , s.key , s.filename , s.file , s.share)
                            }
                        }else{
                                document.querySelector('#title').innerText =  key == 'folder' ? value : 'folder Name' 
                    } 
                    }
                }else{
                    main.innerHTML += extra.nofile()
                }
            })

        }

    }else{
        // if its only a file
        const main = document.querySelector('.main')
        main.style.display = 'grid'
        firebase.database().ref(`sharing/${key}`).once('value').then(function (snapshot) {
       
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
