class AppError(Exception):
    """Base class for application custom exceptions."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class ResourceNotFoundError(AppError):
    """Exception raised when a requested resource is not found."""
    pass

class BusinessValidationError(AppError):
    """Exception raised when business rules are violated."""
    pass

class UnauthorizedAccessError(AppError):
    """Exception raised when user does not have required permissions."""
    pass

class AuthenticationError(AppError):
    """Exception raised when authentication fails (e.g. invalid credentials)."""
    pass
