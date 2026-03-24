export interface Category {
  id: number;
  name: string;
  subcategories: Category[];
  active: boolean;
}

export interface CategorySearchResult {
  node: Category;
  path: string;
  depth: number;
  parentId: number | null;
  isLeaf: boolean;
}
