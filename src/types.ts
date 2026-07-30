export interface Student {
  id: string;
  name: string;
  username: string;
  passHash: string;
  salt: string;
  createdAt: string;
}

export interface AttendanceRecord {
  studentId: string;
  name: string;
  time: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  code: string;
  active: boolean;
  createdAt: string;
  attendees: AttendanceRecord[];
}

export type CurrentUser =
  | { role: 'professor'; name: string }
  | { role: 'student'; studentId: string };

export interface AttendanceActions {
  addStudent: (name: string, username: string, password: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  createSession: (title: string, code: string) => Promise<void>;
  toggleSession: (id: string, active: boolean) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  markAttendance: (sessionId: string, student: Student) => Promise<void>;
}
