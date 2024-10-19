import { Dispatch } from "react";
import { BaseResponse } from "../types/api/base-response";
import { Result } from "../types/api/result";
import { URL_BASE } from "../constants/url-base";

async function fetchingItems({ page }: { page: number }) {
  const response = await fetch(`${URL_BASE}/character?page=${page}`);
  const data: BaseResponse<Result> = await response.json();
  return data.results;
}

export default async function handlerSetItemsFromApi({
  page,
  setItems,
  setLoading
}: {
  page: number;
  setItems: Dispatch<React.SetStateAction<Result[]>>;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
}) {
  try {
    const results = await fetchingItems({ page });
    setItems(results);
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
  } finally {
    setLoading(false);
  }
}