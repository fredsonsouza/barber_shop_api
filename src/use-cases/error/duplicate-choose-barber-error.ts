export class DuplicateChooseBarberError extends Error {
  constructor() {
    super('Customer is already linked to the barber')
  }
}
