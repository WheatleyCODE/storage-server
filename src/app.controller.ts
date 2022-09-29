import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Редирект на фронтенд' })
  @Get()
  redirect(@Res() res): void {
    res.redirect(process.env.URL_CLIENT);
  }
}
