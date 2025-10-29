export const DepartmentMenuAccessSettings = {
  departmentApi: '/api/departments',
  menuItemsApi: (departmentId: number) => `/api/department/${departmentId}/menu-items`,
  assignApi: (departmentId: number, menuId: number) => `/api/department/${departmentId}/menu-items/${menuId}`
};