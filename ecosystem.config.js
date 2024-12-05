module.exports = {
  apps: [
    {
      name: "proxy",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "server1",
      script: "npm",
      args: "run start:server1",
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "server2",
      script: "npm",
      args: "run start:server2",
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "server3",
      script: "npm",
      args: "run start:server3",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
