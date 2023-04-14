const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    cleanDistDir: true,
    reactStrictMode: true,
    swcMinify: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    },
    images: {
        domains: ['images.unsplash.com']
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true
            }
        ]
    }
}

module.exports = nextConfig
