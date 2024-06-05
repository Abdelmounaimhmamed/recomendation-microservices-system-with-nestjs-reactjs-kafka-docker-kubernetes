import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {


    constructor(
        private readonly authService: AuthService
    ){}

    


    @Post("/register")
    async sendMessage(@Body() data : any ){
        return await this.authService.SignUser(data);
    }

    @Post("/login")
    async login(@Body() {email,password} : any ){
        
        return await this.authService.authenticateUser(email , password);
    }
    @Post("/updateProfile")
    async updateProfile(){
        
    }
}


