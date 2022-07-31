import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@einmex-org/common-auth';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
