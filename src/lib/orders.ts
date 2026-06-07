import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'orders.json');

export function getOrders() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data.orders || [];
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
}

export function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ orders }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

export function updateOrderStatus(id: string, status: string) {
  try {
    const orders = getOrders();
    const index = orders.findIndex((o: any) => String(o.id) === String(id));
    if (index === -1) return false;
    orders[index].status = status;
    return saveOrders(orders);
  } catch (error) {
    return false;
  }
}
