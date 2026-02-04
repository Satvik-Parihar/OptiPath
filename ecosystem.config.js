module.exports = {
    apps: [
        {
            name: "optipath-app",
            script: "server.js",
            cwd: "./backend",
            env: {
                NODE_ENV: "production",
                PORT: 5000
            },
            error_file: "~/.pm2/logs/optipath-error.log",
            out_file: "~/.pm2/logs/optipath-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z"
        }
    ]
};
