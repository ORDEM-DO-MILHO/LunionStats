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
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Get()
  async index() {
    return await this.userService.findAllUsers();
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Get('/:_id')
  async userById(@Param() id: string) {
    return await this.userService.findUserById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Put('/:_id')
  async update(@Param() id: string, @Body() userData: UpdateUserDto) {
    return await this.userService.updateUser(id, userData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Get('/summoner/:summoner')
  async findBySummoner(@Param() summoner: string) {
    return await this.userService.findUserBySummoner(summoner);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  async delete(@Param() id: string) {
    return await this.userService.deleteUser(id);
  }
}
