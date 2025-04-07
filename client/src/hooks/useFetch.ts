import { useEffect, useState } from "react";

export function useFetch<T>(url: string, deps: any[] = []) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");

  async function getData() {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data) {
        setData(data);
      }
    } catch (err: any) {
      setError(err?.message || "error occurred");
    }
  }

  useEffect(() => {
    getData();
  }, deps);

  return { data, setData, error };
}

export async function getData(url: string) {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (err: any) {
    console.log(err);
  }
}