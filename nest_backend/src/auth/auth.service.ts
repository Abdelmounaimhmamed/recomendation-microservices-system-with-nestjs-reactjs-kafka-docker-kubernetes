import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './auth.entity';
import { Repository } from 'typeorm';
import {sign} from "jsonwebtoken"
import {compare, hash} from "bcryptjs"


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository:  Repository<UserEntity>
    ){}
    
    async authenticateUser(email: string , password: string){
        const findUser = await this.userRepository.findOne({where: {email}});
        console.log(findUser);
        if(!findUser) {
            throw new HttpException("no user founf !",HttpStatus.NOT_FOUND);
        }
        
        const isPasswordMatches = compare(password, findUser.password);
        if(!isPasswordMatches){
            throw new HttpException("password is incorrect !", HttpStatus.BAD_REQUEST);
        }
        return this.buildOauthResponse(findUser);
    }

    async SignUser({email , password ,username } : any){
        const emailExist = await this.userRepository.findOne({where: {email}});
        if(emailExist){
            throw new HttpException("email already exist !", HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await hash(password, 10);

        const newUser = this.userRepository.create({
            email,
            password :  hashedPassword,
            username
        });
        const createdUser =  await this.userRepository.save(newUser);
        console.log(createdUser);
        return this.buildOauthResponse(createdUser);
    }

    async generateToken(user: UserEntity){
        const access_token = await sign({ id : user.id , email:  user.email},'abdelmounaim_hmamed_secrets_token__generation')
        return access_token;
    }

    async buildOauthResponse(user:UserEntity){
        return {
            ...user ,
            token : this.generateToken(user)
        }
    }
    
    

}
