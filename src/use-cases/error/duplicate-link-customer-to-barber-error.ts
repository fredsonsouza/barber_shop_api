export class DuplicateLinkCustomerToBarberError extends Error {
  constructor() {
    super('Customer is already linked to the barber')
  }
}
