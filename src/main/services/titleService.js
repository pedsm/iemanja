global.state.subscribe('path', (newValue) => {
  if (newValue == null) {
    global.window.setTitle('Iemanja')
  }
  const path = newValue.split('/')
  const fileName = path[path.length - 1]
  global.window.setTitle(`Iemanja - ${fileName}`)
})
