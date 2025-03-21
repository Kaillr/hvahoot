export interface ErrorDetails {
    code: ErrorCodes;
    message: string;
    details?: string;
    trace_id?: string;
}

type ErrorCodes =
    | 'INTERNAL_SERVER_ERROR'
    | 'INVALID_PARAMETERS'
    | 'NOT_FOUND'
    | 'INVALID_REQUEST'
    | 'USERNAME_ALREADY_EXISTS'
    | 'EMAIL_ALREADY_EXISTS'
    | 'BAD_REQUEST';
