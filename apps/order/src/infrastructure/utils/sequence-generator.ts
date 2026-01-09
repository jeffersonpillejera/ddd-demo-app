import { SequenceGenerator as ISequenceGenerator } from '@ecore/domain/core/sequence-generator';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { ORDER_ID_PREFIX } from '../../domain/models/order';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SequenceGenerator implements ISequenceGenerator {
  async generateId(prefix?: string): Promise<UniqueIdentifier> {
    const { customAlphabet } = await import('nanoid');
    // The first character must be ${ORDER_ID_PREFIX},
    // and the next 8 characters of the ID are numbers,
    // and the last 10 characters are alphanumeric,
    // but the alphabets are capitalised only ex. O20251218ER79UP7786

    prefix = prefix ?? ORDER_ID_PREFIX;
    const date = new Date();
    // Get the date part and remove hyphens
    const formattedDateUTC = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      10,
    );
    return new UniqueIdentifier(prefix + formattedDateUTC + randomChars());
  }
}
