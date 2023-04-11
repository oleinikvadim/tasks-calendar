import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, map } from "rxjs";

export interface Task {
  id?: string;
  title: string;
  date?: string
}

interface TaskObject {
  [key: string]: Task
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url: string = 'https://calendar-organizer-task-default-rtdb.firebaseio.com/tasks';

  constructor(private http: HttpClient) { }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<TaskObject>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks) => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map((key) => ({ ...tasks[key], id: key }));
        })
      );
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(
        map((response) => ({ ...task, id: response.name }))
      )
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }
}
