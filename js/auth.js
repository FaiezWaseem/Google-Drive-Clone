//------variables---------
const auth = firebase.auth();
var uid , email , pass;

function register(){
    
    if(inputValues()){
        const promise = auth.createUserWithEmailAndPassword(email, pass).then(function(){

            uid = firebase.auth().currentUser.uid;
            console.log(uid);
            info();

       }).catch(function(error){
           alert(error);
       });   
       
        document.getElementById('pass').value = ''
        document.getElementById('email').value = ''
    }else{
        alert("Fill All required fields");
    }
    return false;

}

function signIn(){
    if(inputValues()){
        document.querySelector('.Loading-Modal').style.display = "block"
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => {alert(e.message);document.querySelector('.Loading-Modal').style.display = "none"});
    }else{alert('please fill out all fields');}
}
function SignOut(){
    auth.signOut();
    console.log('SignOut')
}

function inputValues(){
    email = document.getElementById("email").value;
    pass = document.getElementById("pass").value;
    if( email != null && email != "" && pass != null && pass != ""){
        return true
    }
    else{
        return false
    }
}
function info(){
    firebase.database().ref("users/"+uid).set({ 
        "uid": uid ,
        "Email": email,
        "Avatar" : "https://firebasestorage.googleapis.com/v0/b/chat-app2-b59ab.appspot.com/o/JSIMG%2Fpp.png?alt=media&token=17b65eef-fe8d-4ff0-9b8f-3ada4ffd4e11",
        "Password": pass
    });
}
//----------------user if loggined---------------------//
auth.onAuthStateChanged(function(user){
		
    if(user){
        console.log('User LoggedIn')
       uid = user.uid;
       localStorage.setItem("uid",uid); 
       window.setInterval(function(){
        window.location.replace("index.html");
       },2000)
    
    }else{
        console.log("No Active User");
        //no user is signed in
    }
});
window.addEventListener('keypress' , function(e){
    if (e.keyCode == 13) {
     console.log('enter Pressed')
     signIn()
    }
})