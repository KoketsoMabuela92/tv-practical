import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BundleService } from '../services/bundle.service';
import { User } from '../../auth/decorators/user.decorator';
import { Bundle } from '../entities/bundle.entity';
@ApiTags('bundles')
@Controller('bundles')
@UseGuards(JwtAuthGuard)
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}
  @Get('user-bundle')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bundles' })
  @ApiResponse({ status: 200, description: 'Returns user bundles' })
  async getUserBundles(@User('id') userId: string) {
    return this.bundleService.getUserBundles(userId);
  }
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a sample bundle for testing' })
  @ApiResponse({ status: 201, description: 'Sample bundle created successfully', type: Bundle })
  async createSampleBundle(@User('id') userId: string): Promise<Bundle> {
    return this.bundleService.createSampleBundle(userId);
  }
}
