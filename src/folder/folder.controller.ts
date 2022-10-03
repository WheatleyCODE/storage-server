import { Controller } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('/api/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
}
