import { Controller } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('/api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
}
