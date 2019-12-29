global.state = {
  path: '',
  content: `graph TD
  A[Client] --> B[Load Balancer]
  B --> C[Server01]
  B --> D[Server02]`,
  svg: ''
}