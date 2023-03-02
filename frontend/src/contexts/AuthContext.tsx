import Router from 'next/router';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/apiClient';

 
type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}
 
type UserProps = {
  id: string;
  name: string;
  email: string;
}
 
type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
}
 
type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)
 
export function signOut(){
  try {
    destroyCookie(undefined,'@nextauth.token')
    Router.push('/')
  } catch (error) {
    console.log('Error ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;
  
  useEffect(() => {
    // Tentar pegar algo no cookie
    const {'@nextauth.token': token} = parseCookies()

    if(token){
      api.get('/me').then(response => {
        const {id, name, email} = response.data;
      
        setUser({
          id,
          name,
          email
        })

      })
      .catch(() => {
        signOut();
      })
    }
  }, [])

  async function signIn({email, password}:SignInProps){
    try {
      const response = await api.post('/session',{
        email,
        password
      })
      const { id, name, token } = response.data;
      
      setCookie(undefined, '@nextauth.token', response.data.token,{
        maxAge: 60 * 60 * 24 * 30, 
        path: '/'
      })
      setUser({
        id,
        name,
        email
      })

      // Passar para proximas requisições o nosso token
      api.defaults.headers['Authoeization'] = `Bearer ${token}`
      toast.success('Logado com Sucesso!')
      //Redirecionar o user para /dashboad
      Router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao Acessar!')
      console.log('Erro ao Acessar', error)
    }
  }

  async function signUp({name,email,password}: SignUpProps){
    try {
      const response = await api.post('/user', {
        name,
        email,
        password
      })
      toast.success('Cadastrdo com sucesso!')
      Router.push('/')
    } catch (error) {
      toast.error('Erro ao cadastrar')
      console.log('Error ao cadastrar', error)
    }
  }
  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}