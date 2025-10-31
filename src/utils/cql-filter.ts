import type { Filters } from "@/store/mapstore";

/**
 * Escapes single quotes in SQL strings to prevent injection
 */
const escapeSqlString = (str: string): string => {
  return str.replace(/'/g, "''");
};

/**
 * Builds a CQL filter string from filter state
 */
export const buildCqlFilter = (filters: Filters): string => {
  const conditions: string[] = [];

  // Check for non-empty string values
  if (filters.categories?.trim()) {
    conditions.push(
      `categories ILIKE '%${escapeSqlString(filters.categories)}%'`
    );
  }

  if (filters.district?.trim()) {
    conditions.push(`address ILIKE '%${escapeSqlString(filters.district)}%'`);
  }

  if (filters.rating?.trim()) {
    const ratingValue = parseFloat(filters.rating);
    if (!isNaN(ratingValue)) {
      conditions.push(`rating >= ${ratingValue}`);
    }
  }

  if (filters.searchText?.trim()) {
    const searchText = escapeSqlString(filters.searchText);
    conditions.push(
      `(name ILIKE '%${searchText}%' OR description ILIKE '%${searchText}%')`
    );
  }

  return conditions.length > 0 ? conditions.join(" AND ") : "INCLUDE";
};