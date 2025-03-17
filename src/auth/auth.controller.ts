import {
  Body,
  Put,
  Patch,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {RegisterDto,LoginDto,RefreshTokenDto,ForgotPasswordDto,ResetPasswordDto} from './dto/index';

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'login successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('login')
  async loginController(@Body() user: LoginDto) {
    const loginResult = await this.authService.loginService(
      user.account,
      user.password,
    );
    return { message: 'successfully', data: loginResult };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'refresh token successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('refresh-token')
  async refreshTokenController(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshTokenService(
      refreshToken.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'logout successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('logout')
  async logoutController(
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<{ message: string }> {
    return await this.authService.logoutService(refreshToken.refreshToken);
  }


  

}
