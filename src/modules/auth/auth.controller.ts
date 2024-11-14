import {BaseController, Post} from "@utils/index";
import AuthService from "./auth.service"
import {loginBody} from "@modules/auth/auth.dto";

class AuthController extends BaseController {
    routes = [];

    constructor(public authService: AuthService) {
        super('/auth');
    }


    @Post("/login", {
        response: {},
        body: loginBody
    })
    async show({body, jwt}: { body: loginBody, jwt: any }) {
        try {
            return authService.login(body, jwt)
        }catch (error) {
            console.log(error);
            throw error;
        }
    }

}

const authService = new AuthService();
export default new AuthController(authService).start();