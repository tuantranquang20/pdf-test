export default async function Guard(req) {
    const authorizationHeader = req.headers.authorization;

    // Check if the header exists
    if (!authorizationHeader) {
        return new Response('Authorization header is missing', { status: 401 });
    }

    // Validate the format of the Authorization header
    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return new Response('Invalid Authorization header format', { status: 401 });
    }

    const token = parts[1];

    try {
        // Verify the token
        const verifiedToken = await req.jwt.verify(token);
        if (!verifiedToken) {
            return new Response('Token is invalid', { status: 401 });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return new Response('Token verification failed', { status: 403 });
    }
}