import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private roleService: RoleService,
  ) {}

  private async createJwtPayload(
    accountHolder: any,
    isUser: boolean,
  ): Promise<any> {
    if (isUser) {
      return {
        _id: accountHolder._id,
        role: accountHolder.role,
        isBlock: accountHolder.isBlock,
        sub: accountHolder._id,
      };
    } else {
      const roles = await this.roleService.findRoleService(
        accountHolder.role.map(String),
      );
      return {
        _id: accountHolder._id,
        email: accountHolder.email,
        fullname: accountHolder.fullname,
        role: roles,
      };
    }
  }

  async loginService(
    account: string,
    password: string,
  ): Promise<{ access_token: string; refreshToken: string; user: any }> {
    try {
      const admin =
        await this.adminService.findOneAdminUserNameService(account);
      const accountHolder = admin;

      if (!accountHolder) {
        throw new UnauthorizedException('Account not found');
      }

      if (!(await bcrypt.compare(password, accountHolder.password))) {
        throw new UnauthorizedException('Password is incorrect');
      }

      if (accountHolder.isBlock) {
        throw new UnauthorizedException('Account is blocked');
      }

      const createRefreshToken = randomBytes(32).toString('hex');
      const payload = await this.createJwtPayload(accountHolder, false);
      await this.adminService.updateRefreshTokenService(
        accountHolder.userName,
        createRefreshToken,
      );
      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: createRefreshToken,
        user: payload,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshTokenService(
    refreshToken: string,
  ): Promise<{ access_token: string; refreshToken: string }> {
    try {
      const admin =
        await this.adminService.findOneAdminRefreshTokenService(refreshToken);
      const accountHolder = admin;

      if (!accountHolder) {
        throw new Error('refresh Token not found');
      }
      if (accountHolder.isBlock) {
        throw new UnauthorizedException('Account is blocked');
      }

      const createRefreshToken = randomBytes(32).toString('hex');
      const payload = await this.createJwtPayload(accountHolder, false);

      await this.adminService.updateRefreshTokenService(
        accountHolder.nameAdmin,
        createRefreshToken,
      );

      return {
        access_token: this.jwtService.sign(payload),
        refreshToken: createRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logoutService(refreshToken: string): Promise<{ message: string }> {
    try {
      console.log(refreshToken);
      const admin =
        await this.adminService.findOneAdminRefreshTokenService(refreshToken);

      const accountHolder = admin;

      if (!accountHolder) {
        throw new Error('refresh Token not found');
      }
      await this.adminService.updateRefreshTokenService(admin.nameAdmin, null);
      return { message: 'Logout successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async forgotPasswordService(
  //   email: string,
  // ): Promise<{ statusCode: number; message: string }> {
  //   const munitesExp = 5;
  //   const authCode = Math.floor(100000 + Math.random() * 900000).toString();
  //   const now = new Date();
  //   const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  //   const expiredCode = new Date(vnTime.getTime() + munitesExp * 60000);
  //   try {
  //     const saveDate = await this.usersService.updateCodeService(
  //       email,
  //       authCode,
  //       expiredCode,
  //     );
  //     if (!saveDate || saveDate === null) {
  //       throw new BadRequestException('Email not found');
  //     }
  //     await this.mailerService.sendEmailWithCode(email, authCode);
  //     return { statusCode: 202, message: 'Email sent successfully' };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       'something went wrong with email. please try again',
  //     );
  //   }
  // }

  // async resetPasswordService(
  //   code: string,
  //   newPassword: string,
  // ): Promise<{ message: string }> {
  //   try {
  //     const user = await this.usersService.findOneCodeService(code);
  //     const hashPassword = await bcrypt.hash(newPassword, 10);
  //     if (!user || user === null) {
  //       throw new BadRequestException('Code is incorrect');
  //     }
  //     const now = new Date();
  //     const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  //     if (user.authCode.expiredAt < vnTime) {
  //       throw new BadRequestException('Code is expired');
  //     }
  //     await this.usersService.updatePasswordService(code, hashPassword);

  //     return { message: 'Password reset successfully' };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async handleVerifyTokenService(token: string): Promise<string> {
    try {
      const Payload = this.jwtService.verify(token);
      return Payload['_id'];
    } catch (error) {
      throw new BadRequestException('Token is invalid');
    }
  }
}
