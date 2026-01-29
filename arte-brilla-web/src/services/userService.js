import { apiFetch } from "./api";

export const userService = {
  // GET /api/users/teachers
  listTeachers: async () => {
    return apiFetch("/api/users/teachers");
  }
};
