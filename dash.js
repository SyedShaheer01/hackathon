import {auth, onAuthStateChanged, signOut, doc, db, getDoc, collection, addDoc, setDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, query, orderBy,storage,ref, uploadBytesResumable, getDownloadURL} from "./firebaseConfig.js"
var postsParent = document.querySelector(".posts")


//////////////////---For Dark Mode---////////////////////////
const switchBtn = document.querySelector(".switch")
switchBtn.addEventListener('click',function(){
  const root = document.querySelector(':root');
  // console.log(root)
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
////////////////////////////////////////////////////////////

  ///////////////////////////////---USERTHEME---///////////////////////////////
  const userTheme = JSON.parse(localStorage.getItem('theme')) 
  const root = document.querySelector(':root');
  if(userTheme == null || userTheme){
    switchBtn.firstElementChild.innerHTML = "<i class='fa-solid fa-sun'></i>"
    root.style.setProperty('--dark', '#ab9fc2');
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
  /////////////////////////////////////////////////////////////////////////


// ******************* function for delete post ***********************
async function remove(ele){
  const overLap = document.querySelector(".overlap")
  overLap.style.display = "block"
  document.body.style.overflowY = "hidden"
  const postId = ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id
  console.log(postId)
  await deleteDoc(doc(db, "posts", postId));
  overLap.style.display = "none"
  document.body.style.overflowY = "auto"
  ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}
window.remove = remove
// ********************************************************************




// ******************* function for update post ***********************

function edit(ele){
  const uptTitle = document.getElementById("uptTitle")
  const uptDescription = document.getElementById("uptDescription")
  const postId = ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id
  const post = ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  const postDetails = post.querySelector(".postDetails")
  uptTitle.value = postDetails.children[0].innerHTML
  uptDescription.value = postDetails.children[1].innerHTML
  const postImg = post.querySelector(".postImage-video img")
  const updateBtn = document.getElementById("updateBtn")
  updateBtn.addEventListener("click",async function(){
    updateBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>`
    updateBtn.style.pointerEvents = "none"
    updateBtn.style.opacity = "0.5"
      const uptPic = document.getElementById("uptPic")
      
      if(uptPic.files[0]){
        
                await uploadImg(uptPic).then(async(data)=>{
                  
                  const washingtonRef = doc(db, "posts", postId);
                  await updateDoc(washingtonRef, {
                    title: uptTitle.value,
                    description: uptDescription.value,
                    postImg:data
                  });
                  postImg.src = data
            }).catch((e)=>{
              console.log(e.message);
          })     
          
      }else{
        const washingtonRef = doc(db, "posts", postId);
        await updateDoc(washingtonRef, {
          title: uptTitle.value,
          description: uptDescription.value,
        });
      }
         
      
        postDetails.children[0].innerHTML = uptTitle.value
        postDetails.children[1].innerHTML =  uptDescription.value
        document.getElementById("uptClose").click()
        updateBtn.innerHTML = "Update"
        updateBtn.style.pointerEvents = "auto"
        updateBtn.style.opacity = "1"
  })
  
}
window.edit = edit
// ********************************************************************




// ***********************ReUseable Function For Create Post*************************
async function createPostForUi(firstName,lastName,time,title,description,id,user,uId,postImg){
  let date = new Date(time.seconds*1000).toLocaleString()
  const docRef = doc(db, "users", uId);
  const docSnap = await getDoc(docRef);
  docSnap.data().profilePic
//   var divElement = document.createElement("div")
//   divElement.id = id
let blog=document.getElementById("blog")
  blog.innerHTML += `<div class="postConatiner postInputContainer mt-3">
   <div class="d-flex justify-content-between ">
     <div class="authorsDetails d-flex align-items-center">
       <div class="post-header-container d-flex align-items-center">
         <div class="image">
           <img
             src="${docSnap.data().profilePic ? docSnap.data().profilePic : "./admin.png"}"
             alt="" class="img-fluid rounded mx-auto d-block">
         </div>
         <div class="userName-id ms-2">
           <p class="mb-1 userTag">
             ${firstName}@</p>
           <div class="d-flex align-items-center justify-content-center">
             <h5 class="mb-1 text-capitalize username">${firstName+" "+lastName}</h5>
             <p class="mb-0 ms-2" style="color: #ab9fc2; font-size: 12px;">${date}</p>
           </div>
         </div>
       </div>
     </div>
     <div>
       <div>
        

        ${user == onlineUser.email ? `<button class="btn border-0 " type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical opt"></i>
      </button>
      <ul style="background-color: #fff; cursor: pointer;" class="dropdown-menu">
        <li><a data-bs-toggle="modal" data-bs-target="#editModal" data-bs-whatever ="Edit" class="dropdown-item" onclick="edit(this)">Edit</a></li>
        <li><a class="dropdown-item" onclick="remove(this)">Delete</a></li>
      </ul>` : ""}

       </div>
     </div>
   </div>
   <div class="postDetails">
       <h5>${title}</h5>
     <p class="mt-2">${description}</p>
   </div>
   ${postImg ? `<div class="postImage-video">
   <img src="${postImg}"alt="" >
   </div>` : ""}
   
   <div class="like-comment-share d-flex justify-content-start align-items-center mt-3" style="color: #ab9fc2;">
     <i class="fa-solid fa-heart ms-3 fs-5"></i>
     <i class="fa-solid fa-comment ms-3 fs-5"></i>
     <i class="fa-solid fa-share ms-3 fs-5"></i>
   </div>
   <div class="comment-container d-flex align-items-center mt-3 border-top border-secondary-subtle pt-2">
     <div class="image">
       <img
         src="./admin.png"
         alt="" class="img-fluid rounded mx-auto d-block">
     </div>
     <div class="search ps-3 " style="width: 100%;">
       <div class="input-group" style="width: 100%;">
         <input type="text" class="form-control" placeholder="Write your comment"
           aria-label="Example text with button addon" aria-describedby="button-addon1" id="comment">
         <button class="btn " type="button" id="button-addon1" style="background-color: #ab9fc2;"><i
             class="fa-solid fa-paper-plane" style="color: #6f42c1;"></i></button>
       </div>
     </div>
   </div>
 </div> `

//  postsParent.prepend(divElement)


}
// **********************************************************************************


let lastScrollTop = 0
let navbar = document.querySelector("nav")
window.addEventListener("scroll",function(){
  let scrollTop = window.pageYOffset || this.document.documentElement.scrollTop;
  
    if(scrollTop > lastScrollTop && scrollTop  > navbar.offsetHeight){
      navbar.style.top = `-${navbar.offsetHeight}px`
    }else{
      navbar.style.top = "0"
    }
    lastScrollTop = scrollTop
})


/////////////////////For check User log in or not//////////////////////
let onlineUser ;
window.addEventListener("load",function(){
  const user = JSON.parse(localStorage.getItem("user"))
  if(!user){
    window.location.replace("./index.html")
    return
  }
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    let callBack = async function(){
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
       onlineUser = docSnap.data()
       const q = query(collection(db, "posts"), orderBy("postTime"));
       const querySnapshot = await getDocs(q);
       let userImg = document.querySelectorAll(".userPic")
       
        document.getElementById("name").innerHTML = `${onlineUser.firstName +" "+onlineUser.lastName}`
        document.getElementById("tag").innerHTML = `${onlineUser.firstName}@`
       querySnapshot.forEach((doc) => {

        const {firstName,lastName,postTime,title,description,id,user,uId,postImg} = doc.data()
              createPostForUi(firstName, lastName, postTime, title, description, id ,user,uId,postImg)
              doc.data().profilePic ? userImg.forEach((ele)=>{
                ele.src = onlineUser.profilePic
              }): ""
       });
       document.querySelector(".spinner").style.display = "none"
       document.querySelector(".main").style.display = "block"
        

      } else {
        alert("No such document!");
      }
    }
    callBack()
      } else {
        window.location.replace("./index.html")
        return
      }
    });


  //////////////////////////////////////////////////////////////////////
 
})





/////////////////---Function For Logout---///////////////////
const logOutBtn = document.getElementById("logOut")
logOutBtn.addEventListener("click",logOut)
function logOut(){

  signOut(auth).then(() => {
    console.log(auth);
    localStorage.removeItem("user")
    window.location.href = "./index.html"
  }).catch((error) => {
    alert(error.message)
  });
}
//////////////////////////////////////////////////////////////






// ************************--Function For Create Post---************************
const createPostBtn = document.getElementById("createPost")
const closeBtn = document.getElementById("closeBtn")
createPostBtn.addEventListener("click",createPost)
async function createPost(){



        try{
          var title = document.getElementById("title")
          var description = document.getElementById("description")
          const pic = document.getElementById("pic")
          let postPic;
          
          createPostBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Loading...</span>`
          createPostBtn.style.pointerEvents = "none"
          createPostBtn.style.opacity = "0.5"
          const obj ={
            postTime : serverTimestamp(),
            firstName : onlineUser.firstName,
            lastName : onlineUser.lastName,
            title : title.value,
            description : description.value,
            user: onlineUser.email,
            uId: onlineUser.uid
          }
    
            if(pic.files[0]){
            postPic = await uploadImg(pic)
              obj.postImg = postPic

              
            }
    
            const docRef = await addDoc(collection(db, "posts"),obj);
            const getDocRef = doc(db, "posts", docRef.id);
            obj.id = docRef.id
            await setDoc(doc(db, "posts", docRef.id),obj);
            const docRef1 = doc(db, "posts", docRef.id);
            const docSnap = await getDoc(docRef1);
            const time = docSnap.data().postTime;

                  
                  pic.files[0] ? createPostForUi(obj.firstName,obj.lastName,time,obj.title,obj.description,docRef.id,obj.user,obj.uId,postPic) : createPostForUi(obj.firstName,obj.lastName,time,obj.title,obj.description,docRef.id,obj.user,obj.uId,"")
                  createPostBtn.innerHTML="Create"
                  createPostBtn.style.pointerEvents = "auto"
                  createPostBtn.style.opacity = "1"
                   title.value = ""
                   description.value = ""
                  closeBtn.click()
        }catch(e){
            console.log(e.message);
        }
    
     
    
}
// **********************************************************************

function uploadImg(ele){
    return new Promise(function(resolve,reject){

      const file = ele.files[0]
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
          reject(error.message)
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
      
            // ...
      
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                  resolve(downloadURL)
          });
        }
      );

    }) 
}