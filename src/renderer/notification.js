const notificationDiv = document.getElementById('error')
const closeButton = document.getElementById('close')
const msgP = document.getElementById('error-msg')

function closeNotification() {
  notificationDiv.classList.add('hidden')
}

function notify(msg) {
  msgP.innerHTML = msg
  notificationDiv.classList.remove('hidden')
}

closeButton.onclick = closeNotification

module.exports = {
  notify,
  closeNotification,
}
