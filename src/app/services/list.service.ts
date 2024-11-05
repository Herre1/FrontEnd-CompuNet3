// services/list.service.ts
import axios from 'axios';

export const getUserLists = async (userId: string, token: string) => {
  const response = await axios.get(`https://proyecto-compunet-lll.onrender.com/api/v1/lists/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
