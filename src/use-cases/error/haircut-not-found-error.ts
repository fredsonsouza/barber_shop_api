export class HaircutNotFoundError extends Error {
  constructor() {
    super('Haircut not found.')
  }
}
