export class RepoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepoError';
  }
}

export class NotFoundError extends RepoError {
  constructor(key: string) {
    super(`Not found: ${key}`);
    this.name = 'NotFoundError';
  }
}

export class QuotaExceededError extends RepoError {
  constructor() {
    super('IndexedDB quota exceeded');
    this.name = 'QuotaExceededError';
  }
}

export class ConflictError extends RepoError {
  constructor(message = 'Version conflict on write') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class MigrationError extends RepoError {
  constructor(message: string) {
    super(`Migration failed: ${message}`);
    this.name = 'MigrationError';
  }
}
