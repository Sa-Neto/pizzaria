import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function canSSrAuth<P>(fn: GetServerSideProps<P>){
  return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies['@nextauth.token'];

    if(!token){
      return{
        redirect:{
          destination: '/',
          permanent:false,
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if(error instanceof AuthTokenError){

        return{
          redirect:{
            destination: '/',
            permanent: false
          }
        }
      }
    }
  } 
}