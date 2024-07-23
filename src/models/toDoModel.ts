import { Schema, model } from 'mongoose';
import shortid from 'shortid';

interface IToDo { 
  title: string;
  userId: string;
  isCompleted: boolean;
  createdDate: Date;
  updatedDate: Date;
}

const toDoSchema = new Schema<IToDo>({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

const ToDo = model<IToDo>('ToDo', toDoSchema);
export { ToDo, IToDo };
