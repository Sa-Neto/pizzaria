import Head from "next/head";
import { Header } from "../../components/Header";
import { canSSrAuth } from "../../utils/canSSRAuth";
import styles from './styles.module.scss';
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
}

type CategoryProps ={
  categoryList: ItemProps[]
}

export default function Product({categoryList}: CategoryProps){
  

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || [])
  const [categorySelected, setCategorySelected] = useState(0)

  function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(!e.target.files){
      return;
    }

    const image = e.target.files[0];

    if(!image){
      return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png'){
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  function handleChange(event){
    //console.log('Categoria selecionada' ,categories[event.target.value])
    setCategorySelected(event.target.value)
  }

  async function handleRegister(){
    try {
      const data = new FormData();

    if(name === '' || price === '' || description === '' || imageAvatar === null){
      toast.error('Preencha todos os campos')
      return;
    }

    data.append('name', name);
    data.append('price', price);
    data.append('description', description);
    data.append('category_id', categories[categorySelected].id);
    data.append('file', imageAvatar)

    const apiClient = setupAPIClient();
    await apiClient.post('/product', data)

    toast.success('Cadastrado com sucesso!')
    } catch (error) {
      console.log(error);
      toast.error('Ops erro ao cadastrar')
    }
  }
  return(
    <>
    <Head>
      <title>Novo produto - Sujeito Pizzaria</title>
    </Head>
    <Header/>
    <main className={styles.container}>
      <h1>Novo Produto</h1>
      <form className={styles.form} onSubmit={handleRegister}>

        <label className={styles.labelAvatar}>
          <span>
            <FiUpload size={25} color='#FFF' />
          </span>
          <input type="file" accept="image/png image/png" onChange={handleFile}/>
          {avatarUrl && (
            <Image
              className={styles.preview}
              src={avatarUrl}
              alt='Foto do produto'
              width={250}
              height={250}
            />
          )}
        </label>

        <select value={categorySelected} onChange={handleChange}>
          {categories.map((item,index) => {
            return(
              <option key={item.id} value={index}>
                {item.name}
              </option>
            )
          })}
        </select>

        <input 
          type="text"
          placeholder="Digite o nome do produto"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


        <input 
          type="text"
          placeholder="Preço do produto"
          className={styles.input}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          placeholder="Descrição do Produto"
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className={styles.buttonAdd} type='submit'>
          Cadastrar
        </button>
      </form>
    </main>
    </>
  )
}

export const getServerSideProps = canSSrAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)

  const response = await apiClient.get('/category')

  // console.log(response.data)

  return{
    props:{
      categoryList: response.data
    }
  }
})