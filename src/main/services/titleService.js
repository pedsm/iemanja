function updateTitle(_, state) {
  if (state.path == null) {
    global.window.setTitle('Iemanja')
    return
  }
  const path = state.path.split('/')
  const fileName = path[path.length - 1]
  const fileChanged = state.buffer !== state.content
  global.window.setTitle(`Iemanja - ${fileName}${fileChanged ? '*' : ''}`)
}

global.state.subscribe('path', updateTitle)
global.state.subscribe('content', updateTitle)
