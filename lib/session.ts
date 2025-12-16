import 'server-only'

import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SECRET) 

type SessionPayload = {
    username: string;
    expiresAt: Date;
}


export async function encrypt(payload: SessionPayload)
{
    return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}

export async function decrypt(session: string | undefined = "")
{
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256']
        })

        return payload
    }
    catch(error)
    {
        console.error("Failed to verify session")
    }
}

// session management

export async function createSession(username: string)
{
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({username, expiresAt});

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt
    })
}

export async function verifySession()
{
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if(!session?.username)
    {
        redirect('/login')
    }

    return { username: session.username}
}

export async function deleteSession()
{
    (await cookies()).delete('session');
    redirect('/login');
}