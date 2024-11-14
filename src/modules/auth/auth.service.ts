import PrismaService from "../../../prisma/prisma.service";
import {loginBody} from "@modules/auth/auth.dto";

export default class AuthService {

    public async login(login: loginBody, jwt: any) {
        const user = await PrismaService.user.findUnique({
            where: {email: login.email},
        })
        if (user && await Bun.password.verify(login.password, user.password)) {
            user.password = undefined
            return {
                user: user,
                token: await jwt.sign({
                    email: user.email,
                })
            }
        }
    }

}