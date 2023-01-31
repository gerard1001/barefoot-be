const socket = io("http://localhost:5000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRSQVZFTF9BRE1JTkBnbWFpbC5jb20iLCJ1c2VySWQiOjIsImlhdCI6MTY0OTkzMDU3MCwiZXhwIjoxNjUwMDE2OTcwfQ.LUQsF1oTBxln1--OJ4boHbTjTbCmxuuLec-1PtywRi0"
    },
})

const notification = document.querySelector(".alert-section")
socket.on("notification", (data) => {
    notification.innerHTML += `<div class="alert">
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>Notification!!!</strong> ${data}
</div>`
})

socket.on("authFailed", (data) => {
    console.log(data)
})

socket.on("user", data => {
    socket.emit("checkManager", data)
})