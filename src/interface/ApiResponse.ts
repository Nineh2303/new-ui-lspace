export class ApiResponse<T> {
    isError: boolean = false;
    message?: string;
    object?: T;
    error?: unknown;

}