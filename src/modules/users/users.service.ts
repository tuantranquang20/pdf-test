import PrismaService from "../../../prisma/prisma.service";
import {createUser} from "@modules/users/user.dto";

export default class UsersService {

    public async createUser(data: createUser) {
        data.password = await Bun.password.hash(data.password);

        return PrismaService.user.create({
            data,
        })
    }
}