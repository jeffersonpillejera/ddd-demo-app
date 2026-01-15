import { EventBus } from '@nestjs/cqrs';
import { Subject, takeUntil } from 'rxjs';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ofType } from '@nestjs/cqrs';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { OrderProjectionRebuilder } from '../projection-store/order.projection-rebuilder';
import { LoggerService } from '@ecore/logger/logger.service';

@Injectable()
export class AllOrderEventsHandler implements OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBus,
    private readonly orderProjectionRebuilder: OrderProjectionRebuilder,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.eventBus
      .pipe(
        takeUntil(this.destroy$),
        ofType(OrderPlacedEvent, OrderConfirmedEvent, OrderCancelledEvent),
      )
      .subscribe((event) => {
        this.logger.log(
          `Rebuilding order ${event.orderId.toString()} from event ${event.constructor.name}`,
        );

        void this.orderProjectionRebuilder.rebuild(event);

        this.logger.log(
          `Order ${event.orderId.toString()} rebuilt from event ${event.constructor.name} successfully`,
        );
      });
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
