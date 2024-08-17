import { expressjwt } from 'express-jwt';
function authJwt() {
    const secret = process.env.JWT_SECRET
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/catagory(.*)/, methods: ['GET', 'OPTIONS'] },
            '/users/login',
            '/users/register'
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        return true;
    }
    return false
}

export default authJwt;
