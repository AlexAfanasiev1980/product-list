import "./App.scss";
import { getDate } from "./helpers/getDate";
import {
  fetchProductsId,
  setLoading,
} from "./store/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "./store/store";
import { PaginationPage } from "./pages/paginationPage/PaginationPage";

function App({ itemsPerPage }: { itemsPerPage: number }) {
  const dispatch = useAppDispatch();
  const productsId = useAppSelector((store) => store.products.productsId);
  const loading = useAppSelector((store) => store.products.loading);

  const date = getDate();

  const getProducts = async () => {
    dispatch(setLoading(true));
    try {
      const listId: any = await dispatch(
        fetchProductsId({
          password: `Valantis_${date}`,
          offset: 0,
          limit: itemsPerPage,
        })
      );
      if (listId.error) {
        dispatch(setLoading(false));
        alert('Ошибка сервера. Попробуйте еще раз.')
      }
      console.log(listId)
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="App">
      {productsId.length === 0 ? (
        <div className="buttonItem">
          {loading ? (
            <div>Loading ...</div>
          ) : (
            <button className="button" onClick={getProducts}>
              Получить список продуктов
            </button>
          )}
        </div>
      ) : (
        <PaginationPage itemsPerPage={itemsPerPage} date={date} />
      )}
    </div>
  );
}

export default App;
