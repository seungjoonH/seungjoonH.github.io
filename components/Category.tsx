interface CategoryProps { children: string; }

const Category = (props: CategoryProps) => (
  <span className="category">{props.children}</span>
);

export default Category;