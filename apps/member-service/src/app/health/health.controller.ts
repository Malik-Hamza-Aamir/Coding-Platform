import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  checkServerHealth() {
    return 'Server is Running Healthy';
  }

  @Get('service')
  checkServicesHealth() {
    return 'Service is Running healthy';
  }
}
