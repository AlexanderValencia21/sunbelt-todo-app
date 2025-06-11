export enum TaskStatus {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En Progreso',
    COMPLETED = 'Finalizada'
  }
  
  export interface Task {
    id?: number;  // Opcional porque al crear no tendrá ID
    title: string;
    description: string;
    status: TaskStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }