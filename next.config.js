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
            {
                protocol: 'https',
                hostname: 'pub-6373be2f34c246649e921d2bef6e47c1.r2.dev',
                port: '',
                pathname: '/**'
            },
        ],
    },
    reactStrictMode: true,
}

module.exports = nextConfig
