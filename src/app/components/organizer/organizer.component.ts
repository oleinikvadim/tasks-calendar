import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { DateService } from 'src/app/shared/date.service';
import { Task, TasksService } from 'src/app/shared/task.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent {
  form!: FormGroup;
  tasks: Task[] = [];
  constructor(
    public dateService: DateService,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.dateService.date
      .pipe(
        switchMap(value => this.tasksService.load(value))
      ).subscribe({
        next: (tasks) => this.tasks = tasks,
      })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.tasksService
      .create(task)
      .subscribe({
        next: (task) => {
          this.form.reset();
          this.tasks.push(task);
        },
        error: (err) => console.log(err)
      })
  }

  removeTask(task: Task) {
    this.tasksService
      .remove(task)
      .subscribe({
        next: () => this.tasks = this.tasks.filter(t => t.id !== task.id),
        error: (err) => console.error(err)
      });
  }
}
