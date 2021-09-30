const config = {
  dev: {
    server: {
      port: 5000,
    },
    database: {
      name: "plan",
      host: "localhost",
      port: "5432",
      user: "postgres",
      password: "postgres",
    },
    secret: "secret",
  },
  production: {
    server: {
      port: 5000,
    },
    database: {
      name: "plan",
      host: "localhost",
      port: "5432",
      user: "postgres",
      password: "postgres",
    },
    secret: "secret",
  },
};

module.exports = config;
