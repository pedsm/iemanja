global.state = {
  path: null,
  content: `graph TD
  A[Client] --> B[Load Balancer]
  B --> C[Server01]
  B --> D[Server02]`,
  svg: '',
}

global.window = null
