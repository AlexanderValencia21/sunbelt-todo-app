import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    TasksComponent,
    TaskListComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
    MaterialModule,IonicModule
  ]
})
export class TasksModule { }
