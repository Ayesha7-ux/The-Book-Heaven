import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'users.json');

export function getUsers() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data.users || [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

export function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ users }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

export function deleteUser(id: string) {
  try {
    const users = getUsers();
    const filtered = users.filter((u: any) => String(u.id) !== String(id));
    return saveUsers(filtered);
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

export function updateUser(id: string, updates: any) {
  try {
    const users = getUsers();
    const index = users.findIndex((u: any) => String(u.id) !== String(id));
    if (index === -1) return false;
    users[index] = { ...users[index], ...updates };
    return saveUsers(users);
  } catch (error) {
    return false;
  }
}
