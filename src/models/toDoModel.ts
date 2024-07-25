import { Schema, model, Types } from 'mongoose';

interface IToDo { 
  title: string;
  userId: Types.ObjectId;
  isCompleted: boolean;
  createdDate: Date;
  updatedDate: Date;
}

const toDoSchema = new Schema<IToDo>({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  isCompleted: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

const ToDo = model<IToDo>('ToDo', toDoSchema);
export { ToDo, IToDo };
