import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => AdminModule),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
