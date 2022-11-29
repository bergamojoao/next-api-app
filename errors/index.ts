export interface IBaseError{
  message: string,
  action: string,
  statusCode: number | null;
}

class BaseError extends Error {
  message: string;
  action: string;
  statusCode: number;
  
  constructor(params: IBaseError) {
    super();
    const {message, action, statusCode} = params
    this.name = this.constructor.name;
    this.message = message;
    this.action = action;
    this.statusCode = statusCode || 500;
  }
}

export class InternalServerError extends BaseError {
  constructor() {
    super({
      message: 'Um erro interno não esperado aconteceu.',
      action: "Informe ao suporte.",
      statusCode: 500,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor() {
    super({
      message:  'Não foi possível encontrar este recurso no sistema.',
      action: 'Verifique se o caminho (PATH) e o método (GET, POST, PUT, DELETE) estão corretos.',
      statusCode: 404,
    });
  }
}

export class ServiceError extends BaseError {
  constructor() {
    super({
      message: 'Serviço indisponível no momento.',
      action: 'Verifique se o serviço está disponível.',
      statusCode: 503,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message:string) {
    super({
      message: message,
      action: 'Ajuste os dados enviados e tente novamente.',
      statusCode: 400,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message:string) {
    super({
      message: message,
      action: 'Verifique se você está autenticado com um token válido e tente novamente.',
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor() {
    super({
      message: 'Você não possui permissão para executar esta ação.',
      action: 'Verifique se você possui permissão para executar esta ação.',
      statusCode: 403,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor() {
    super({
      message: 'Você realizou muitas requisições recentemente.',
      action: 'Tente novamente mais tarde ou contate o suporte caso acredite que isso seja um erro.',
      statusCode: 429,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor() {
    super({
      message: 'Não foi possível realizar esta operação.',
      action: 'Os dados enviados estão corretos, porém não foi possível realizar esta operação.',
      statusCode: 422,
    });
  }
}