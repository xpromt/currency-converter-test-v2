import "./App.css";
import Navbar from "./Navbar";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [data, setData] = useState([]);
  const [money, setMoney] = useState(1);
  const [moneyFrom, setMoneyFrom] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();
  function useFirstPrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  function useSecondPrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    fetch(
      `https://v6.exchangerate-api.com/v6/e358cad154c3f7421c0ffffa/latest/USD`
    )
      .then((response) => response.json())
      .then((responsedata) => {
        const firstCurr = Object.keys(responsedata.conversion_rates)[1];
        setData([...Object.keys(responsedata.conversion_rates)]);
        setFirstInput(responsedata.base_code);
        setSecondInput(Object.keys(responsedata.conversion_rates)[144]);
        setExchangeRate(responsedata.conversion_rates[firstCurr]);
      });
  }, []);
  const first = useFirstPrevious(firstInput);
  const second = useSecondPrevious(secondInput);
  useEffect(() => {
    if (firstInput === secondInput) {
      setFirstInput(second);
      setSecondInput(first);
    }
    if (firstInput != null && secondInput != null) {
      fetch(
        `https://v6.exchangerate-api.com/v6/7cc8565835b9b47e14685f57/pair/${firstInput}/${secondInput}`
      )
        .then((response) => response.json())
        .then((responseData) => {
          setExchangeRate(responseData.conversion_rate);
        });
    }
  }, [firstInput, secondInput, first, second]);
  let toAmount = 0,
    fromAmount = 1;
  if (moneyFrom) {
    fromAmount = money;
    toAmount = fromAmount * exchangeRate || 0;
    toAmount = toAmount.toFixed(2);
  } else {
    toAmount = money;
    fromAmount = toAmount / exchangeRate;
    fromAmount = fromAmount.toFixed(2);
  }

  function onCurChangeFrom(e) {
    const value = e.target.value;
    setMoney(value);
    setMoneyFrom(true);
  }
  function onCurChangeTo(e) {
    const value = e.target.value;
    setMoney(value);
    setMoneyFrom(false);
  }
  function handleFromCur(e) {
    if (firstInput === secondInput) {
      setFirstInput(second);
    } else setFirstInput(e.target.value);
  }
  function handleToCur(e) {
    if (firstInput === secondInput) {
      setSecondInput(first);
    } else setSecondInput(e.target.value);
  }

  return (
    <div classNameName="App">
      <Navbar 
        data={data}
        money={money}
        onCurChangeFrom={onCurChangeFrom}
        onCurChangeTo={onCurChangeTo}
        fromInput={firstInput}
        toInput={secondInput}
        toAmount={toAmount}
        fromAmount={fromAmount}
        handleFromCur={handleFromCur}
        handleToCur={handleToCur}
      />
      <article className="message is-warning is-medium">

        <div className="message-body is-warning">
        <span className="icon-text">
          <span className="icon">
            <i className="fas fa-hand-point-right"></i>
          </span>
          <span><strong>{fromAmount}</strong> {firstInput}</span>
          <span className="icon">
            <i className="fas fa-exchange-alt"></i>
          </span>
          <span><strong>{toAmount}</strong> {secondInput}</span>
        </span>
        </div>
      </article>

    </div>
  );
}
