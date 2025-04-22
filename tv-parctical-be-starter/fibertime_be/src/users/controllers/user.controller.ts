import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post('test-user')
  @ApiOperation({ summary: 'Create a test user' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        phoneNumber: { 
          type: 'string', 
          example: '+27test1234' 
        } 
      } 
    } 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Test user created successfully', 
    type: User 
  })
  async createTestUser(@Body('phoneNumber') phoneNumber?: string): Promise<User> {
    return this.userService.findOrCreateTestUser(phoneNumber);
  }
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List users (admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users', 
    type: User, 
    isArray: true 
  })
  async listUsers(): Promise<User[]> {
    return this.userService.listUsers();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User details', 
    type: User 
  })
  async getUserById(@Param('id') userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
