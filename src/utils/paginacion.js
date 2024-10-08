// utils/paginacion.js

export const paginarResultados = async (queryBase, page = 1, pageSize = 10, conexion) => {
  const offset = (page - 1) * pageSize;
  
  // Contar el total de resultados
  const totalQuery = `SELECT COUNT(*) as total FROM (${queryBase}) AS totalCount`;
  const [[{ total }]] = await conexion.query(totalQuery);

  // Obtener los resultados con límite y desplazamiento
  const paginatedQuery = `${queryBase} LIMIT ${pageSize} OFFSET ${offset}`;
  const [rows] = await conexion.query(paginatedQuery);

  // Devolver los resultados paginados y el total
  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    pageSize,
    data: rows
  };
};
