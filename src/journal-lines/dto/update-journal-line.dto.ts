import { PartialType } from '@nestjs/swagger';
import { CreateJournalLineDto } from './create-journal-line.dto';

export class UpdateJournalLineDto extends PartialType(CreateJournalLineDto) {}