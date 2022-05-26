import React from "react";
import { useEffect, useRef, useState } from "react";

const Converter = () => {
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
    <div className="converter_container">
      <div className="field has-addons has-addons-right">
        <p className="control">
          <span className="select is-small">
            <select value={firstInput} onChange={handleFromCur}>
              {data.map((rate) => {
                return (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                );
              })}
            </select>
          </span>
        </p>
        <p className="control">
          <input className="input is-small"
            type="number"
            value={fromAmount}
            onChange={onCurChangeFrom}
            min="1"
          />
        </p>
      </div>
      <div className="field has-addons has-addons-right">
        <p className="control">
          <span className="select is-small">
            <select value={secondInput} onChange={handleToCur}>
              {data.map((rate) => {
                return (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                );
              })}
            </select>
          </span>
        </p>
        <p className="control">
          <input className="input is-small"
            type="number"
            value={toAmount}
            onChange={onCurChangeTo}
            min="1"
          />
        </p>
      </div>
    </div>
  );
}
export default Converter;
