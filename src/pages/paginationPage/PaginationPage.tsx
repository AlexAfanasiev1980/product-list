import ReactPaginate from "react-paginate";
import { useAppDispatch, useAppSelector } from "../../store/store";
import style from "./paginationPage.module.scss";
import { Table } from "../../components/table/Table";
import {
  deleteFilter,
  fetchFields,
  fetchPagination,
  fetchProductsData,
  fetchProductsId,
  fetchProductsIdFilter,
  setFilter,
  setLoading,
  setPagination,
} from "../../store/features/products/productSlice";
import { FormEvent, useEffect, useState } from "react";
import serializeForm from "../../helpers/utils";

export const PaginationPage = ({
  itemsPerPage,
  date,
}: {
  itemsPerPage: number;
  date: string;
}) => {
  const dispatch = useAppDispatch();
  const [itemOffset, setItemOffset] = useState(0);
  const pagination = useAppSelector((store) => store.products.pagination);
  const productsId = useAppSelector((store) => store.products.productsId);
  const products = useAppSelector((store) => store.products.products);
  const loading = useAppSelector((store) => store.products.loading);
  const filterList = useAppSelector((store) => store.products.filterList);
  const fields = useAppSelector((store) => store.products.fields);


  // функция переключения страницы
  const handlePageClick = async (event: any) => {
    const newOffset = event.selected;
    if (filterList.length > 0) {
      await dispatch(
        setFilter(products.slice(newOffset * 50, newOffset * 50 + 50))
      );
    } else {
      await dispatch(
        fetchProductsId({
          password: `Valantis_${date}`,
          offset: newOffset,
          limit: itemsPerPage,
        })
      );
    }

    setItemOffset(newOffset);
  };


  // функция сброса фильтра
  const handleDeleteFilter = async () => {
    await dispatch(deleteFilter());
  };


  // функция получения данных по выбранному фильтру
  const handleFilter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const data = serializeForm(e.currentTarget);
    try {
      const listId: any = await dispatch(
        fetchProductsIdFilter({
          password: `Valantis_${date}`,
          name: data[0].value,
          value:
            data[0].value === "price" ? Number(data[1].value) : data[1].value,
        })
      );
      const listProducts: any = await dispatch(
        fetchProductsData(`Valantis_${date}`)
      );
      await dispatch(
        setPagination(Math.ceil(listId.payload?.result.length / itemsPerPage))
      );
      setItemOffset(0);
      await dispatch(setFilter(listProducts.payload.result.slice(0, itemsPerPage)));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const getData = async () => {
      dispatch(setLoading(true));
      try {
        await dispatch(fetchProductsData(`Valantis_${date}`));
        dispatch(setLoading(false));
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
      }
    };
    if (productsId.length > 0) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsId]);

  useEffect(() => {
    const getPagination = async () => {
      dispatch(setLoading(true));
      try {
        await dispatch(fetchPagination({ password: `Valantis_${date}` }));
        await dispatch(fetchFields(`Valantis_${date}`));
        dispatch(setLoading(false));
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
      }
    };
    getPagination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={style.content}>
      {loading && products.length === 0 && (
        <div className={style.loading}>
          <p>Loading ...</p>
        </div>
      )}
      {products.length > 0 && fields.length > 0 && pagination && (
        <>
          <div>
            <form onSubmit={handleFilter} className={style.form}>
              <select name="select" id="select">
                {fields.map((el) => (
                  <option value={el} key={el}>
                    {el}
                  </option>
                ))}
              </select>
              <input type="text" name="data" placeholder="Поиск ..." />
              <button type="submit">Найти</button>
            </form>
            <button type="button" onClick={handleDeleteFilter}>
              Сбросить фильтр
            </button>
          </div>

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pagination}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            containerClassName={style.pagination}
            pageClassName={style.pagination__page}
            pageLinkClassName={style.pagination__link}
            activeClassName={style.pagination__page_active}
            breakClassName={style.pagination__brake}
            previousClassName={style.pagination__previous}
            nextClassName={style.pagination__next}
            forcePage={itemOffset}
          />
          {loading && products.length !== 0 && (
            <div className={style.loading}>
              <p>Loading ...</p>
            </div>
          )}

          {!loading && (
            <Table
              products={filterList.length > 0 ? filterList : products}
              fields={fields}
            />
          )}

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pagination}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            containerClassName={style.pagination}
            pageClassName={style.pagination__page}
            pageLinkClassName={style.pagination__link}
            activeClassName={style.pagination__page_active}
            breakClassName={style.pagination__brake}
            previousClassName={style.pagination__previous}
            nextClassName={style.pagination__next}
            forcePage={itemOffset}
          />
        </>
      )}
    </main>
  );
};
