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
window.addEventListener('load',function(){
    if(window.innerWidth < 768){
        document.getElementById("left").classList.remove("col-2");
        document.getElementById("left").classList.remove("p-4");
        document.getElementById("left").style.width = '0px'
    }
})


