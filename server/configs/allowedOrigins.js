const allowedOrigins = [
    process.env.FRONTEND_ORIGIN_DEV,
    process.env.FRONTEND_ORIGIN_PROD,
]

module.exports = allowedOrigins;