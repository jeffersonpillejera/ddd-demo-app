import { SnapshotStore } from './snapshot-store';
import { Model } from 'mongoose';
import { SnapshotEntity } from './snapshot.schema';
import { Order } from '../../domain/models/order';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDataMapper } from '../data-mappers/order.data-mapper';

@Injectable()
export class OrderSnapshotStore extends SnapshotStore<Order> {
  constructor(
    @InjectModel(SnapshotEntity.name)
    snapshotModel: Model<SnapshotEntity>,
    orderDataMapper: OrderDataMapper,
  ) {
    super(snapshotModel, orderDataMapper);
  }
}
