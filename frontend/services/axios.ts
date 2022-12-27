import axios from "axios";
import { parseCookies } from "nookies";
import { GetServerSidePropsContext } from "next/types";

export const api = axios.create({
  baseURL: 'http://localhost:3333'
});


export function getAPIClient(ctx?: GetServerSidePropsContext) {
  const { 'wsk8s.token': token } = parseCookies(ctx)

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}