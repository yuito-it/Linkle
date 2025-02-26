import CryptoJS from "crypto-js";
import { fetchErrorResponse } from "@/lib/server/error";
import Club from "@/models/Club";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import DashboardContent from "./Client";
import { Alert, Stack, Typography } from "@mui/material";
import Article from "@/models/Article";

export default function Dashboard({
  apiBase,
  cookie,
  email,
}: {
  apiBase: string;
  cookie: string | undefined;
  email: string;
}) {
  const getMyClubs = async (
    apiBase: string,
    cookie: string | undefined,
    email: string
  ): Promise<Club[] | fetchErrorResponse> => {
    if (!cookie) return "unauthorized";
    try {
      const key =
        CryptoJS.AES.encrypt(
          (email as string) || "No Auth",
          process.env.API_ROUTE_SECRET as string
        ).toString() || "";
      const res = await fetch(`${apiBase}/api/user/clubs?email=${email}`, {
        headers: new Headers({
          Cookie: cookie,
          "X-Api-Key": key,
        }),
      });
      if (res.status == 403) return "forbidden";
      if (res.status == 404) return "notfound";
      if (res.status == 401) return "unauthorized";
      const club = await res.json();
      if (!club) return "notfound";
      return club;
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const clubs = use(getMyClubs(apiBase, cookie, email));
  switch (clubs) {
    case "forbidden":
      forbidden();
    case "notfound":
      notFound();
    case "unauthorized":
      unauthorized();
    default:
      break;
  }

  const getMyArticles = async (
    apiBase: string,
    cookie: string | undefined,
    email: string
  ): Promise<Article[] | fetchErrorResponse> => {
    if (!cookie) return "unauthorized";
    try {
      const key =
        CryptoJS.AES.encrypt(
          (email as string) || "No Auth",
          process.env.API_ROUTE_SECRET as string
        ).toString() || "";
      const res = await fetch(`${apiBase}/api/user/articles?email=${email}`, {
        headers: new Headers({
          Cookie: cookie,
          "X-Api-Key": key,
        }),
      });
      if (res.status == 403) return "forbidden";
      if (res.status == 404) return "notfound";
      if (res.status == 401) return "unauthorized";
      const articles = await res.json();
      if (!articles) return "notfound";
      return articles;
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const articles = use(getMyArticles(apiBase, cookie, email));
  switch (articles) {
    case "forbidden":
      forbidden();
    case "notfound":
      notFound();
    case "unauthorized":
      unauthorized();
    default:
      break;
  }
  if (clubs instanceof Error) throw clubs;
  if (articles instanceof Error) throw articles;
  if (clubs.length)
    return (
      <DashboardContent
        clubs={clubs}
        articles={articles}
      />
    );
  else
    return (
      <Stack>
        <Typography variant="h3">ダッシュボード</Typography>
        <Alert severity="error">エラーが発生しました。</Alert>
      </Stack>
    );
}
