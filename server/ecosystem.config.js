module.exports = {
  apps: [
    {
      name: 'sniperthink-api',
      script: './index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'sniperthink-worker',
      script: './workers/fileProcessor.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
