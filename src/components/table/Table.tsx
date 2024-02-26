import { IProducts } from "../../store/features/products/types";
import style from './table.module.scss';

export const Table = ({
  products,
  fields,
}: {
  products: IProducts[];
  fields: string[];
}) => {
  return (
    <table className={style.table}>
      <thead>
        <tr>
          {fields.map((el) => (
            <th key={el} className={style.table__headCell}>{el}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((el: any, index: number) => (
          <tr key={index}>
            {fields.map((key) => (
              <td key={key} className={style.table__bodyCell}>{el[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
