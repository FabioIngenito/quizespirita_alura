/* eslint-disable react/prop-types */
import React from 'react';
import { Lottie } from '@crello/react-lottie';
// import db from '../../../db.json';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import loadingAnimation from './animations/loading.json';
import Link from 'next/link';


function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultado:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {/* {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return somatoriaAtual + 1;
            }
            return somatoriaAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          perguntas
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${index}`}>
              #
              {index + 1}
              {' '}
              Resultado:
              {result === true
                ? 'Acertou'
                : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>

      {/* Ricardo Temoteo #9100 */}
      {/*       <Widget.Header>
            <h1>
              <a href="/"
                style={{
                textDecoration: 'none',
                color: 'white',
                }}>
                Voltar para a home
              </a>
            </h1>
      </Widget.Header> */}

      {/* Trebias #4788 */}
      <Widget.Header>
        <Link href="/">
          <a style={{
            textDecoration: 'none',
            color: 'black',
          }}>
            Clique aqui para voltar
            </a>
        </Link>
      </Widget.Header>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        <Lottie
          width="200px"
          height="200px"
          className="lottie-container basic"
          config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
        />
      </Widget.Content>

    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
  handleSolution
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  React.useEffect(() => {
    setSelectedAlternative(undefined)
  }, [])

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        {/* ISTO É O ORIGINAL - QUERO FAZER UM PEQUENO "DESVIO" AQUI: */}
        {/*     
        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3 * 1000);
          }}
        > 
*/}
        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            // setIsQuestionSubmited(true);
            addResult(isCorrect);
            handleSolution();
            setSelectedAlternative(undefined);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            CONFIRMAR
          </Button>
          {/* {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>} */}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

/* ISTO AQUI É NOVO - o Trebias#4788 está me ajudando forte... */
function SolutionWidget({
  question,
  questionIndex,
  goToNextQuestion,
  isCorret
}) {
  return (
    <Widget style={{ marginLeft: 10 }}>
      <Widget.Header>
        {`Pergunta ${questionIndex + 1}
         - Resposta ${isCorret ? "Correta" : "Incorreta"}:
         `}
      </Widget.Header>
      <Widget.Content>
        <p>{question.alternatives[question.answer]}</p>
        <p>
          {question.solution}
        </p>

        <Button type="button" onClick={goToNextQuestion} >
          Próxima Pergunta
          </Button>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ externalQuestions, externalBg }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [showSolution, setShowSolution] = React.useState(false);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  const lastAnwser = results[currentQuestion];

  function addResult(result) {
    // results.push(result);
    setResults([
      ...results,
      result,
    ]);
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 2000);
    // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;

    setShowSolution(false);

    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }


  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />

        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {screenState === screenStates.QUIZ && (
            <QuestionWidget
              question={question}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              addResult={addResult}
              handleSolution={() => setShowSolution(true)}
            />
          )}

          {showSolution && <SolutionWidget question={question} questionIndex={questionIndex} goToNextQuestion={handleSubmitQuiz} isCorret={lastAnwser} />}
        </div>

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground >
  );
}
