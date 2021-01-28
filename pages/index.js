import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `

// const BackgroundImage = styled.div`
//    background-image: url(${db.bg});
//    flex: 1;
//    background-size: cover;
//    background-position: center;
// `;

//function Title(props) { //propcidades/propriedades
//  return (
//    <h1>
//    {props.children}
//    </h1>
//  )
//}

export const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home() {
  const router = useRouter();
  //https://pt-br.reactjs.org/docs/hooks-state.html
  const [name, setName] = React.useState('');
  //console.log('retorno do useState', name, setName)

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Quiz Espírita - Modelo Base</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{db.description}</p>
            <form onSubmit={function (infosDoEnvento) {
                infosDoEnvento.preventDefault();

                // router manda para a próxima página
                router.push(`/quiz?name=${name}`);
                //console.log('Fazendo uma submissão por meio do React');
            }}
            >
{/*               <Input 
                  name="nomeDoUsuario"
                  onChange={(infosDoEnvento) => {
                  //console.log(infosDoEnvento.target.value);
                  // State
                  //name = infosDoEnvento.target.value;
                  setName(infosDoEnvento.target.value)
              }}
              placeholder="Por favor, digite seu nome." 
              value={name}
              />
*/}

              <Input 
                name="nomeDoUsuario"
                OnChange={(infosDoEnvento) => setName(infosDoEnvento.target.value)}
                placeholder="Por favor, digite seu nome."
                value={name}
              />

              <button type="submit" disabled={name.length === 0}>
                  {/* Jogar {name} */}
                  {`Jogar ${name} `}
              </button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>Quizes da Galera</h1>

            <p>lorem ipsum dolor sit amet...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/FabioIngenito/quizespirita_alurabase" />
    </QuizBackground>
  );
}