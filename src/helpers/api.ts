import md5 from "md5";

interface IFetch {
  url: string;
  method: "GET" | "POST";
  body: {
    action: string;
    params?: {};
  };
  password: string;
}

export default async function createFetch({
  url,
  method,
  body,
  password,
}: IFetch) {
  try {
    return await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        "X-Auth": md5(password),
        "Content-type": "application/json",
        referrerPolicy: "unsafe_url",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
