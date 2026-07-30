import {
  addDoc, arrayUnion, collection, deleteDoc, doc,
  getDocs, onSnapshot, query, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase';
import { hashPassword, todayISO, uid } from './utils';
import type { Session, Student } from '../types';

export const subscribeStudents = (cb: (list: Student[]) => void) =>
  onSnapshot(collection(db, 'students'), snap => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Student);
    list.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    cb(list);
  });

export const subscribeSessions = (cb: (list: Session[]) => void) =>
  onSnapshot(collection(db, 'sessions'), snap => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Session);
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    cb(list);
  });

export async function loginStudent(username: string, password: string): Promise<Student | null> {
  const snap = await getDocs(
    query(collection(db, 'students'), where('username', '==', username.trim()))
  );
  if (snap.empty) return null;
  const student = { id: snap.docs[0].id, ...snap.docs[0].data() } as Student;
  const hash = await hashPassword(password, student.salt);
  return hash === student.passHash ? student : null;
}

export async function addStudent(name: string, username: string, password: string): Promise<void> {
  const salt = uid();
  const passHash = await hashPassword(password, salt);
  await addDoc(collection(db, 'students'), {
    name: name.trim(),
    username: username.trim(),
    passHash,
    salt,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'students', id));
}

export async function createSession(title: string, code: string): Promise<void> {
  await addDoc(collection(db, 'sessions'), {
    title: title.trim(),
    code,
    date: todayISO(),
    active: true,
    createdAt: new Date().toISOString(),
    attendees: [],
  });
}

export async function toggleSession(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'sessions', id), { active });
}

export async function deleteSession(id: string): Promise<void> {
  await deleteDoc(doc(db, 'sessions', id));
}

export async function markAttendance(sessionId: string, student: Student): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), {
    attendees: arrayUnion({
      studentId: student.id,
      name: student.name,
      time: new Date().toISOString(),
    }),
  });
}
