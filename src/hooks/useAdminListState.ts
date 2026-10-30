import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useAdminListState(pageSize = 10) {
  const router = useRouter();
  const [search, setSearchState] = useState("");
  const [page, setPageState] = useState(1);
  const [sort, setSortState] = useState("name");
  const [direction, setDirectionState] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!router.isReady) return;
    setSearchState(typeof router.query.q === "string" ? router.query.q : "");
    const queryPage = Number(router.query.page);
    setPageState(Number.isInteger(queryPage) && queryPage > 0 ? queryPage : 1);
    setSortState(
      typeof router.query.sort === "string" ? router.query.sort : "name",
    );
    setDirectionState(router.query.order === "desc" ? "desc" : "asc");
  }, [
    router.isReady,
    router.query.order,
    router.query.page,
    router.query.q,
    router.query.sort,
  ]);

  const updateQuery = (values: {
    q?: string;
    page?: number;
    sort?: string;
    order?: "asc" | "desc";
  }) => {
    const query = { ...router.query };
    if (values.q !== undefined) {
      if (values.q) query.q = values.q;
      else delete query.q;
    }
    if (values.page !== undefined) {
      if (values.page > 1) query.page = String(values.page);
      else delete query.page;
    }
    if (values.sort !== undefined) query.sort = values.sort;
    if (values.order !== undefined) query.order = values.order;
    void router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const setSearch = (value: string) => {
    setSearchState(value);
    setPageState(1);
    updateQuery({ q: value, page: 1 });
  };
  const setPage = (value: number) => {
    setPageState(value);
    updateQuery({ page: value });
  };
  const toggleSort = (field: string) => {
    const nextDirection =
      sort === field && direction === "asc" ? "desc" : "asc";
    setSortState(field);
    setDirectionState(nextDirection);
    setPageState(1);
    updateQuery({ sort: field, order: nextDirection, page: 1 });
  };
  const sortItems = <T>(
    items: T[],
    selectors: Record<string, (item: T) => string | number>,
  ) => {
    const selector =
      selectors[sort] ?? selectors.name ?? Object.values(selectors)[0];
    return [...items].sort((left, right) => {
      const a = selector(left);
      const b = selector(right);
      const result =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b), "pt-BR");
      return direction === "asc" ? result : -result;
    });
  };
  const paginate = <T>(items: T[]) => {
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(page, pageCount);
    return {
      items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
      page: safePage,
      pageCount,
      total: items.length,
    };
  };

  return {
    search,
    setSearch,
    page,
    setPage,
    paginate,
    pageSize,
    sort,
    direction,
    toggleSort,
    sortItems,
  };
}
