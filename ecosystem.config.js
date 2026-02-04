module.exports = {
    apps: [
        {
            name: "optipath-app",
            script: "./backend/server.js",
            env: {
                NODE_ENV: "production",
                PORT: 5000
            }
        }
    ]
};
