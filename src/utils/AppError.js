// Error de negocio con código HTTP sugerido (la capa de servicios no conoce req/res).
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
