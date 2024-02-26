import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store";
import { BASE_URL } from "../../../helpers/consts";
import createFetch from "../../../helpers/api";
import { IProductsData, IProductsId, ProductState } from "./types";


// функция получения списка полей таблицы
export const fetchFields = createAsyncThunk(
  "products/fetchFields",

  async (password: string) => {
    const response = await createFetch({
      url: BASE_URL,
      method: "POST",
      body: {
        action: "get_fields"
      },
      password,
    });
    const res = await response?.json();

    return res;
  }
);

// функция установки количества страниц
export const fetchPagination = createAsyncThunk<
  number,
  {
    password: string;
  }
>(
  "products/fetchPagination",

  async ({ password }) => {
    const response = await createFetch({
      url: BASE_URL,
      method: "POST",
      body: {
        action: "get_ids",
        params: {},
      },
      password,
    });
    const res = await response?.json();

    const count = res.result.length;
    return Math.ceil(count / 50);
  }
);


// функция получения списка id продуктов
export const fetchProductsId = createAsyncThunk<
  IProductsId,
  {
    password: string;
    offset?: number;
    limit?: number;
  }
>(
  "products/fetchProductsId",

  async ({ password, offset, limit }) => {
    const response = await createFetch({
      url: BASE_URL,
      method: "POST",
      body: {
        action: "get_ids",
        params: { offset: offset, limit: limit },
      },
      password,
    });
    const res = await response?.json();
    return res;
  }
);

// функция получения списка продуктов
export const fetchProductsData = createAsyncThunk<
  IProductsData,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("products/fetchProductsData", async (password, thunkAPI) => {
  const params = { ids: thunkAPI.getState().products.productsId };
  const response = await createFetch({
    url: BASE_URL,
    method: "POST",
    body: {
      action: "get_items",
      params: params,
    },
    password,
  });
  const res = await response?.json();
  return res;
});

// функция получения списка id продуктов по фильтру
export const fetchProductsIdFilter = createAsyncThunk<
  IProductsId,
  {
    password: string;
    name: string;
    value: string | number;
  }
>(
  "products/fetchProductsIdFilter",

  async ({ password, name, value }) => {
    const response = await createFetch({
      url: BASE_URL,
      method: "POST",
      body: {
        action: "filter",
        params: { [name]: value },
      },
      password,
    });
    const res = await response?.json();
    return res;
  }
);

const initialState: ProductState = {
  pagination: undefined,
  productsId: [],
  products: [],
  filterList: [],
  fields: [],
  loading: false,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setFilter: (state, action) => {
      state.filterList = action.payload;
    },
    deleteFilter: (state) => {
      state.filterList = [];
      state.pagination = undefined;
      state.productsId = [];
      state.products = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsId.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(fetchProductsId.fulfilled, (state, action) => {
      state.productsId = action.payload.result;
    });
    builder.addCase(fetchProductsData.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(fetchProductsData.fulfilled, (state, action) => {
      state.products = action.payload.result;
    });
    builder.addCase(fetchPagination.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(fetchPagination.fulfilled, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(fetchFields.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(fetchFields.fulfilled, (state, action) => {
      state.fields = action.payload.result;
    });
    builder.addCase(fetchProductsIdFilter.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(fetchProductsIdFilter.fulfilled, (state, action) => {
      state.productsId = action.payload.result;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setPagination, setFilter, deleteFilter } = productSlice.actions;

export default productSlice.reducer;
