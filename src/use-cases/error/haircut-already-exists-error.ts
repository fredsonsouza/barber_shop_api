export class HaircutAlreadyExistsError extends Error {
  constructor() {
    super('Haircut already exists!')
  }
}
