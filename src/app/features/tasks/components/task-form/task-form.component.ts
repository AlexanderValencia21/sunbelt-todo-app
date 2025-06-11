import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit{
  taskForm: FormGroup;
  loading = false;
  isEditMode = false;
  statusOptions = [
    { value: TaskStatus.PENDING, viewValue: 'Pendiente' },
    { value: TaskStatus.IN_PROGRESS, viewValue: 'En Progreso' },
    { value: TaskStatus.COMPLETED, viewValue: 'Finalizada' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; task?: Task }
  ) {
    this.isEditMode = data.mode === 'edit';
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [TaskStatus.PENDING, Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.isEditMode && this.data.task) {
      this.taskForm.patchValue(this.data.task);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.loading = true;
    const taskData = this.taskForm.value;

    const operation = this.isEditMode && this.data.task
      ? this.taskService.updateTask({ ...this.data.task, ...taskData })
      : this.taskService.createTask(taskData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Tarea ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error saving task', err);
        this.snackBar.open(
          `Error al ${this.isEditMode ? 'actualizar' : 'crear'} la tarea`,
          'Cerrar',
          { duration: 3000 }
        );
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
