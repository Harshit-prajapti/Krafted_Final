/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ichef.bbci.co.uk',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'dreamlineoutdoorfurniture.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            },
        ],
    },
    reactStrictMode: true,
}

module.exports = nextConfig
