import{ auth, signInWithEmailAndPassword,} from "./firebaseConfig.js"

window.addEventListener('load',function(){
   
  
  const user = JSON.parse(localStorage.getItem("user"))
    if(user){
        window.location.replace("./dashbord.html")
        return
    }
  document.body.style.display = "block"
    
})


var show = document.getElementById("psShow")
var password = document.getElementById("password")
var email = document.getElementById("email")
/////////////////////function for password show and hide//////////////////////////
password.addEventListener('input',function(){
    
    if(this.value.length == 0){
        show.style.display = "none"
    }else{
        show.style.display = "inline-block"
    }
    
})
show.addEventListener('click',function(){
    if(show.innerText == "Show" ){
        show.innerText = "Hide"
        password.type = "text"
    }else{
        show.innerText = "Show"
        password.type = "password"
    }
})
//////////////////////////////function for login////////////////////////////////////////////////////
const signIn = document.getElementById("signIn")
signIn.addEventListener("click",login)
function login(){
   
    if(!email.value || !password.value){
        Swal.fire({
            title: 'Fill All The Fields',
            icon: 'warning',
            confirmButtonColor: '#ffc107',
            iconColor: '#ffc107'
          })
        return
    }
    

signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) =>{
    let signUpMessage = document.querySelector(".signUpMessage")
    signUpMessage.style.animationName = "message"
    localStorage.setItem("user",JSON.stringify(userCredential))
    setTimeout(function(){
    window.location.replace("./dashbord.html")
    },1000)
  })
  .catch((error) => {
    const errorMessage = error.message
    console.log(error.message);
    if(errorMessage == "Firebase: Error (auth/user-not-found)."){
        Swal.fire({
            title: 'User Not Exist',
            icon: 'warning',
            confirmButtonColor: 'red',
            iconColor: 'red'
          })
    }else if(errorMessage == "Firebase: Error (auth/invalid-email)."){
        Swal.fire({
            title: 'Invalid-Email',
            icon: 'warning',
            confirmButtonColor: 'red',
            iconColor: 'red'
          })
    }else if(errorMessage == "Firebase: Error (auth/wrong-password)."){
         Swal.fire({
                text: 'Password Doesn\'t Match',
                icon: 'warning',
                iconColor: '#f15555',
                confirmButtonColor: '#ffc107',
              })
    }
  });
 

        
}