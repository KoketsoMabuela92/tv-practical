import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Bundle } from '../entities/bundle.entity';
import { User } from '../entities/user.entity';
@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepository: Repository<Bundle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getUserBundles(userId: string): Promise<Bundle[]> {
    const cachedBundles = await this.cacheManager.get<Bundle[]>(`user_bundles_${userId}`);
    if (cachedBundles) {
      return cachedBundles;
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bundles'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(`User ${userId} bundles:`, user.bundles);
    const bundles = user.bundles.filter(bundle => bundle.is_active);
    console.log(`Active bundles for user ${userId}:`, bundles);
    await this.cacheManager.set(`user_bundles_${userId}`, bundles, 300);
    return bundles;
  }
  async createSampleBundle(userId: string): Promise<Bundle> {
    console.log(`Attempting to create sample bundle for user ID: ${userId}`);
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'phone_number'] 
    });
    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    }
    console.log(`User found: ${user.phone_number}`);
    const bundle = this.bundleRepository.create({
      name: 'Sample Data Bundle',
      data_balance: 5.0, 
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      user: user,
      is_active: true,
    });
    try {
      const savedBundle = await this.bundleRepository.save(bundle);
      console.log(`Bundle created successfully: ${savedBundle.id}`);
      await this.cacheManager.del(`user_bundles_${userId}`);
      return savedBundle;
    } catch (error) {
      console.error('Error saving bundle:', error);
      throw error;
    }
  }
  async addBundle(userId: string, bundleData: Partial<Bundle>): Promise<Bundle> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const bundle = this.bundleRepository.create({
      ...bundleData,
      user: user,
    });
    const savedBundle = await this.bundleRepository.save(bundle);
    await this.cacheManager.del(`user_bundles_${userId}`);
    return savedBundle;
  }
}
