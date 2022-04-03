const dotenv = require("dotenv");

let result = dotenv.config();

if (result.error) {
  throw result.error;
}

const env = {
  ...result.parsed,
  NODE_ENV: "development",
};

module.exports = {
  watch: false,
  apps: [
    {
      name: "Netlify CLI",
      script: "netlify dev",
      ignore_watch: ["."],
    },
    {
      name: "CSS",
      script: "npm run dev:css",
      ignore_watch: ["."],
      env,
    },
  ],
};
