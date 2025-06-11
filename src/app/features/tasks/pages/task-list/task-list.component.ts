import { Component, OnInit} from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = true;
  searchText = '';
  selectedStatus = '';
  
  statusOptions = [
    { value: TaskStatus.PENDING, viewValue: 'Pendiente' },
    { value: TaskStatus.IN_PROGRESS, viewValue: 'En Progreso' },
    { value: TaskStatus.COMPLETED, viewValue: 'Finalizada' }
  ];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // Mapeamos los datos de la API a nuestro modelo
        this.tasks = tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status || TaskStatus.PENDING // Por defecto
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.snackBar.open('Error al cargar las tareas', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchText.toLowerCase()) || 
                          task.description.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = !this.selectedStatus || task.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: TaskStatus): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { mode: 'edit', task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  confirmDelete(taskId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '90%',
      maxWidth: '400px',
      data: { 
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que quieres eliminar esta tarea?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteTask(taskId);
      }
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.snackBar.open('Tarea eliminada correctamente', 'Cerrar', { duration: 3000 });
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error deleting task', err);
        this.snackBar.open('Error al eliminar la tarea', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
