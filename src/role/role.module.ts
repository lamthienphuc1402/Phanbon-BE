import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Role, RoleSchema } from './schema/role.schema';
import { AbilityFactory } from '../abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';
@Module({
  imports: [
    forwardRef(() => AdminModule),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleService, AbilityFactory],
  exports: [RoleService],
})
export class RoleModule {}
