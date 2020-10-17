import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from '../dto/user-update.dto';
import { UserService } from '../services/user.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Get()
  async index() {
    return await this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Get('/:_id')
  async userById(@Param() id: string) {
    return await this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Put('/:_id')
  async update(@Param() id: string, @Body() userData: UpdateUserDto) {
    return await this.userService.updateUser(id, userData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  async delete(@Param() id: string) {
    return await this.userService.deleteUser(id);
  }
}
