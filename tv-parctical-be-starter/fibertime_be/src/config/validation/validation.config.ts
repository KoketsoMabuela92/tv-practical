import { ValidationPipe, BadRequestException } from '@nestjs/common';
export const validationPipeConfig = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    const formattedErrors = errors.map(error => ({
      property: error.property,
      constraints: error.constraints,
      value: error.value,
    }));
    return new BadRequestException({
      message: formattedErrors.map(err => 
        Object.values(err.constraints || {}).join(', ')
      ),
      errors: formattedErrors,
    });
  },
});
