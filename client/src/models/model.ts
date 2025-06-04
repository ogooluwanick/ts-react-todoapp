export interface Todo {
    id: string; // Changed from number to string to align with backend _id
    todo: string;
    isDone: boolean;
    createdAt?: string; // Added createdAt, optional for now
}
