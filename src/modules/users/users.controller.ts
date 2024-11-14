import {BaseController, Post} from "@utils/index";
import UsersService from "@modules/users/users.service";
import {createUser} from "@modules/users/user.dto";

class UsersController extends BaseController {
    // Initialize routes as an empty array
    routes = [];

    constructor(public usersService: UsersService) {
        super('/users');
    }

    @Post("/create-user", {
        response: {},
        body: createUser
    })
    async create({body}: { body: createUser }) {
        try {
            // Use usersService to access the service instance
            return await usersService.createUser(body);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

// Create an instance of UsersService
const usersService = new UsersService();

// Export an instance of UsersController with the UsersService
export default new UsersController(usersService).start();