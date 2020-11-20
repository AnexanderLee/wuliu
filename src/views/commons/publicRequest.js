import { postData } from '@/api/data'

export function saveInventory(data) {
  return postData('/api/k3/saveInventory', data)
}
