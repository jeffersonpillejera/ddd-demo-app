import { EventBus } from '@nestjs/cqrs';
import { Subject, takeUntil } from 'rxjs';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ofType } from '@nestjs/cqrs';
import { LoggerService } from '@ecore/logger/logger.service';
import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { CreditPurchaseApprovedEvent } from '../../domain/events/credit-purchase-approved.event';
import { CreditPurchaseRejectedEvent } from '../../domain/events/credit-purchase-rejected.event';

@Injectable()
export class AllCustomerEventsHandler implements OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.eventBus
      .pipe(
        takeUntil(this.destroy$),
        ofType(
          CustomerCreatedEvent,
          CreditPurchaseApprovedEvent,
          CreditPurchaseRejectedEvent,
        ),
      )
      .subscribe((event) => {
        this.logger.log(
          `Handling customer event ${event.constructor.name} for customer ${event.customerId.toString()}`,
        );
      });
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
