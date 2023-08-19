import{onAuthStateChanged,auth,getDoc,doc,db,storage, updateDoc,ref, uploadBytesResumable, getDownloadURL,signOut} from "./firebaseConfig.js"
const switchBtn = document.querySelector(".switch")
switchBtn.addEventListener('click',function(){
  const root = document.querySelector(':root');
  let theme = this.firstElementChild.classList.contains("darkBtn")
  this.firstElementChild.classList.toggle("darkBtn")
  if(theme){
    this.firstElementChild.innerHTML = "<i class='fa-solid fa-sun'></i>"
    root.style.setProperty('--dark', '#ab9fc2');
    root.style.setProperty('--dark1', '#fff');
    root.style.setProperty('--dark2', '#666');
  }else{
    this.firstElementChild.innerHTML = "<i class='fa-solid fa-moon'></i>"
    this.firstElementChild.firstElementChild.style.color = "#fff"
    root.style.setProperty('--dark', '#1d2a35');
    root.style.setProperty('--dark1', '#38444d');
    root.style.setProperty('--dark2', '#fff');
  }
  localStorage.setItem('theme',JSON.stringify(theme))
})



const userTheme = JSON.parse(localStorage.getItem('theme')) 
const root = document.querySelector(':root');
if(userTheme == null || userTheme){
  switchBtn.firstElementChild.innerHTML = "<i class='fa-solid fa-sun'></i>"
  root.style.setProperty('--dark', '#f6f0dd');
  root.style.setProperty('--dark1', '#fff');
  root.style.setProperty('--dark2', '#666');
}else{
  switchBtn.firstElementChild.classList.toggle("darkBtn")
  switchBtn.firstElementChild.innerHTML = "<i class='fa-solid fa-moon'></i>"
  switchBtn.firstElementChild.firstElementChild.style.color = "#fff"
  root.style.setProperty('--dark', '#1d2a35');
  root.style.setProperty('--dark1', '#38444d');
  root.style.setProperty('--dark2', '#fff');
}



// *****************for logout function*******************
const logOutBtn = document.getElementById("logOut")
logOutBtn.addEventListener("click",logOut)
function logOut(){

  signOut(auth).then(() => {
    localStorage.removeItem("user")
    window.location.href = "./index.html"
  }).catch((error) => {
    alert(error.message)
  });
}


let onlineUser ;
window.addEventListener("load",function(){
  const user = JSON.parse(localStorage.getItem("user"))
  if(!user){
    window.location.replace("./index.html")
    return
  }
onAuthStateChanged(auth, async(user) => {
  if (user) {
    
    document.body.style.display = "block"
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()){
            alert("user not found")
      }
      onlineUser = docSnap.data()

      let userImg = document.querySelectorAll(".userImg")
      onlineUser.profilePic ? userImg.forEach((ele)=>{
        ele.src = onlineUser.profilePic
      }): ""
        
        document.getElementById("name").innerHTML = `${onlineUser.firstName +" "+onlineUser.lastName}`
        // document.getElementById("tag").innerHTML = `${onlineUser.firstName}@`
        document.querySelector(".spinner").style.display = "none"
        document.querySelector(".main").style.display = "block"
      } else {
        window.location.replace("./index.html")
        return
      }
    });

})



const edtProfile = document.getElementById("EdtProfile")
const saveBtn = document.getElementById("saveBtn")
edtProfile.addEventListener("click",editProfile)

function editProfile(){
        let fName = document.getElementById("fName")
        let lName = document.getElementById("lName") 
        let name = document.getElementById("name") 
        const fullName = name.innerHTML.split(" ")
        fName.value = fullName[0]
        lName.value = fullName[1]
}



saveBtn.addEventListener("click",updateProfile)

async function updateProfile(){
  let fName = document.getElementById("fName").value
  let lName = document.getElementById("lName").value
  let profilePic = document.getElementById("profilePic")
  const uptClose = document.getElementById("uptClose")
  const file = profilePic.files[0]

    if(!fName,!lName){
            alert("Fill Empty Fileds")
            return
    }
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>`
   if(file !== undefined){

                     /** @type {any} */
          const metadata = {
           contentType: 'image/jpeg'
         };
         
         // Upload file and metadata to the object 'images/mountains.jpg'
         const storageRef = ref(storage, 'images/' + file.name);
         const uploadTask = uploadBytesResumable(storageRef, file, metadata);
         
         // Listen for state changes, errors, and completion of the upload.
         uploadTask.on('state_changed',
           (snapshot) => {
             // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log('Upload is ' + progress + '% done');
             switch (snapshot.state) {
               case 'paused':
                 console.log('Upload is paused');
                 break;
               case 'running':
                 console.log('Upload is running');
                 break;
             }
           }, 
           (error) => {
            
             switch (error.code) {
               case 'storage/unauthorized':
                 // User doesn't have permission to access the object
                 break;
               case 'storage/canceled':
                 // User canceled the upload
                 break;
         
               case 'storage/unknown':
                 // Unknown error occurred, inspect error.serverResponse
                 break;
             }
           }, 
           () => {
             // Upload completed successfully, now we can get the download URL
             getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              let userImg = document.querySelectorAll(".userImg")
                 userImg ? userImg.forEach((ele)=>{
                   ele.src = onlineUser.profilePic
                 }): ""
        
              const washingtonRef = doc(db, "users", onlineUser.uid);
              await updateDoc(washingtonRef, {
                  firstName:fName,
                  lastName:lName,
                  profilePic:downloadURL
              });
              profilePic.value = ""
              saveBtn.innerHTML = `Save changes`
              uptClose.click()
             });
           }
         );   
   }else{
       const washingtonRef = doc(db, "users", onlineUser.uid);
       await updateDoc(washingtonRef, {
           firstName:fName,
           lastName:lName,
       });
       document.getElementById("name").innerHTML = `${fName +" "+lName}`
       document.getElementById("tag").innerHTML = `${fName}@`
       saveBtn.innerHTML = `Save changes`
       uptClose.click()
   }
    
}