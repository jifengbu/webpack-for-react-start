import events from 'events';
const EventEmitter = events.EventEmitter;
class TaskEmitter extends EventEmitter {};

export default new TaskEmitter();
